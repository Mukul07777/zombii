import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, parseCSV, cleanMerchant } from "../api/_detector.js";
import { SAMPLES } from "../api/_samples.js";

const TODAY = "2026-07-25";

function run(id) {
  const s = SAMPLES[id];
  return analyze(parseCSV(s.csv), { today: TODAY, unused: s.unused });
}

test("cleanMerchant strips gateway junk", () => {
  assert.equal(cleanMerchant("UPI-NETFLIX ENTERTAINMENT REF8890"), "netflix");
  assert.equal(cleanMerchant("AUTOPAY-CULT FIT GYM MANDATE"), "cult fit");
});

test("parseCSV ignores headers and malformed rows", () => {
  const txns = parseCSV("date,description,amount\n2026-01-01,NETFLIX,-499\nbad,row\n");
  assert.equal(txns.length, 1);
  assert.equal(txns[0].amount, -499);
});

test("detects the right number of recurring subscriptions", () => {
  assert.equal(run("professional").summary.count, 5);
  assert.equal(run("family").summary.count, 9);
});

test("flags exactly one zombie per persona", () => {
  for (const id of ["professional", "student", "family"]) {
    assert.equal(run(id).summary.zombies, 1, `${id} should have 1 zombie`);
  }
});

test("detects silent price hikes", () => {
  const r = run("professional");
  const adobe = r.subscriptions.find((s) => s.name === "Adobe");
  assert.equal(adobe.type, "hike");
  assert.ok(adobe.hikePct >= 25, "Adobe hike should be ~31%");
});

test("computes a positive total leak", () => {
  assert.ok(run("professional").summary.totalLeak > 0);
});

test("overlap detector finds duplicate categories", () => {
  assert.ok(run("family").summary.overlaps.length >= 1);
  assert.ok(run("family").summary.overlapAnnual > 0);
});

test("Trial Guardian catches a recent single-charge trial", () => {
  const trials = run("professional").summary.trials;
  assert.equal(trials.length, 1);
  assert.ok(trials[0].daysUntilNext > 0);
});

test("confidence and regret fields are present", () => {
  const s = run("professional").subscriptions[0];
  assert.ok(s.confidence >= 55 && s.confidence <= 99);
  assert.ok(typeof s.spentTotal === "number");
});

test("empty input yields zero subscriptions, no crash", () => {
  const r = analyze([], { today: TODAY });
  assert.equal(r.summary.count, 0);
  assert.equal(r.summary.totalLeak, 0);
});
