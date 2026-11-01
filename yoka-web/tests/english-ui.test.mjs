import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
// Keep the Thai baht symbol valid while checking Thai language characters.
const thai = /[\u0e01-\u0e3a\u0e40-\u0e5b]/;

test("website UI literals contain no untranslated Thai text", () => {
  const untranslated = [];
  function inspect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) { inspect(filename); continue; }
      if (!/\.tsx?$/.test(filename)) continue;
      const source = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true);
      function visit(node) {
        if ((ts.isStringLiteralLike(node) || ts.isJsxText(node) ||
          [ts.SyntaxKind.TemplateHead, ts.SyntaxKind.TemplateMiddle, ts.SyntaxKind.TemplateTail].includes(node.kind)) && thai.test(node.text)) {
          untranslated.push(`${path.relative(root, filename)}: ${node.text.trim()}`);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  for (const directory of ["app", "components", "hooks", "lib", "service", "types", "utils"]) inspect(path.join(root, directory));
  assert.deepEqual(untranslated, []);
});

test("bundled review text and dates are in English", () => {
  const reviews = JSON.parse(fs.readFileSync(path.join(root, "assets/yoga_by_niti_reviews.json"), "utf8"));
  for (const review of reviews) {
    assert.equal(thai.test(review.content), false, review.name);
    assert.equal(thai.test(review.date), false, review.name);
  }
});
