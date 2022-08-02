# find-up-deno

Find the path of a given file or directory by walking up similar to [find-up on npm](https://www.npmjs.com/package/find-up).

## Usage

```ts
import { findUp } from 'https://deno.land/x/find-up-deno/mod.ts';

// cwd: /home/user/foo/src/nested/
// package.json exists at /home/user/foo/package.json
const result = await findUp('package.json');
console.log(result); // /home/user/foo/package.json
```
