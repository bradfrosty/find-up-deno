import { resolve } from 'https://deno.land/std@0.150.0/path/mod.ts';
import { basename, dirname } from 'https://deno.land/std@0.150.0/path/win32.ts';

export interface Options {
  stopAt?: string;
}

export async function findUp(name: string, options: Options = {}): Promise<string | undefined> {
  const stopAtResolved = resolve(options.stopAt ?? '/');
  const nameResolved = resolve(name);

  try {
    await Deno.stat(name);
    return nameResolved;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      const cwd = dirname(nameResolved);
      if (cwd === stopAtResolved) return;
      return findUp(resolve(cwd, '..', basename(name)), options);
    } else {
      throw error; // let bubble if unexpected error
    }
  }
}
