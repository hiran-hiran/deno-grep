import * as io from "https://deno.land/std@0.165.0/io/mod.ts";
import { walk } from "https://deno.land/std@0.165.0/fs/walk.ts";

export type GrepResult = {
  fileName: string;
  line: number;
  text: string;
};

export const grep = async (
  word: string,
  root: string
): Promise<GrepResult[]> => {
  const reslut = [];

  for await (const entry of walk(root, { skip: [/^\.git/] })) {
    if (entry.isFile) {
      const file = await Deno.open(entry.path);

      try {
        let line = 1;
        for await (const text of io.readLines(file)) {
          if (text.match(word)) {
            reslut.push({
              fileName: entry.path,
              line,
              text,
            });
          }
          line++;
        }
      } catch (error) {
        console.error({ error });
      } finally {
        file.close();
      }
    }
  }

  return reslut;
};
