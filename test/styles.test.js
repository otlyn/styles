import assert from "node:assert/strict";
import test from "node:test";
import { styles } from "@otlyn/styles";

test("joins matching rules in declaration order", () => {
  const button = styles([
    { className: ["button", "", "rounded"] },
    { variant: ["primary", "secondary"], className: "colored" },
    { disabled: false, className: "enabled" },
    { variant: "primary", disabled: false, className: "interactive" },
  ]);

  assert.equal(button(), "button rounded");
  assert.equal(button({ variant: "secondary" }), "button rounded colored");
  assert.equal(button({ variant: "primary", disabled: false }),
    "button rounded colored enabled interactive");
  assert.equal(button({ variant: null, disabled: true }), "button rounded");
});

test("returns an empty string when no class applies", () => {
  assert.equal(styles([])(), "");
  assert.equal(styles([{ active: true, className: "active" }])({ active: false }), "");
  assert.equal(styles([{ className: "" }, { className: [] }])(), "");
});

test("does not mutate rules or selections", () => {
  const rule = Object.freeze({
    variant: Object.freeze(["primary"]),
    className: Object.freeze(["button", "primary"]),
  });
  const selection = Object.freeze({ variant: "primary" });
  const button = styles(Object.freeze([rule]));

  assert.equal(button(selection), "button primary");
  assert.equal(button(), "");
  assert.deepEqual(rule, {
    variant: ["primary"],
    className: ["button", "primary"],
  });
  assert.deepEqual(selection, { variant: "primary" });
});
