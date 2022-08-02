import { findUp } from "./mod.ts";
import { assertEquals, assertExists, assertFalse } from "https://deno.land/std@0.150.0/testing/asserts.ts";
import { assertPath } from "https://deno.land/std@0.150.0/path/_util.ts";
import { assert } from "https://deno.land/std@0.150.0/_util/assert.ts";
import { dirname, fromFileUrl, resolve } from "https://deno.land/std@0.150.0/path/mod.ts";

const ROOT = fromFileUrl(dirname(import.meta.url));
const NESTED_DIR = './testdata/nested/deep';

Deno.test('find in current dir', async () => {
  const result = await findUp('README.md');
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isFile);
});

Deno.test('find from nested dir', async () => {
  Deno.chdir('./testdata/nested/deep');
  const result = await findUp('README.md');
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isFile);
  Deno.chdir(ROOT);
});

Deno.test('return undefined for non-existent file', async () => {
  const result = await findUp('this-shouldnt-exist.wtf');
  assertEquals(result, undefined);
});

Deno.test('find directory', async () => {
  Deno.chdir(NESTED_DIR);
  const result = await findUp('testdata');
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isDirectory);
  Deno.chdir(ROOT);
});

Deno.test('find root', async () => {
  const result = await findUp('/');
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isDirectory);
});

Deno.test('find other file with no ext', async () => {
  Deno.chdir(NESTED_DIR);
  const result = await findUp('no-ext');
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isFile);
  Deno.chdir(ROOT);
});

Deno.test('find with custom stopAt', async () => {
  Deno.chdir(NESTED_DIR);
  const result = await findUp('nested', { stopAt: resolve(ROOT, './testdata') });
  assertExists(result);
  assertPath(result);
  assert(Deno.statSync(result).isDirectory);
  Deno.chdir(ROOT);
});

Deno.test('fail to find existing file with custom relative stopAt', async () => {
  Deno.chdir(NESTED_DIR);
  const result = await findUp('README.md', { stopAt: '../..' });
  assertEquals(result, undefined);
  Deno.chdir(ROOT);
});

Deno.test('fail to find existing file with custom resolved stopAt', async () => {
  Deno.chdir(NESTED_DIR);
  const result = await findUp('README.md', { stopAt: resolve(ROOT, './testdata') });
  assertEquals(result, undefined);
  Deno.chdir(ROOT);
});
