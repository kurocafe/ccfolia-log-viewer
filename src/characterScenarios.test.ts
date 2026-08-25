import { describe, test, expect } from "vitest"
import { scenariosForCharacter } from "./characterScenarios"
import { readFileSync } from "fs";

const ccHtml = readFileSync("docs/cc.html", "utf-8")
const x5html = readFileSync("docs/x5.html", "utf-8")

const scenarioA = {
  id: "1",
  scenario: "シナリオA",
  run: 1,
  content: ccHtml,
  contentHash: "dummy",
  createdAt: "2026-01-01T00:00:00Z",
}

const scenarioB = {
  id: "2",
  scenario: "シナリオB",
  run: 1,
  content: ccHtml,
  contentHash: "dummy",
  createdAt: "2026-01-01T00:00:00Z",
}

const scenarioC = {
  id: "3",
  scenario: "シナリオC",
  run: 1,
  content: x5html,
  contentHash: "dummy",
  createdAt: "2026-01-01T00:00:00Z",
}

describe("scenariosForCharacter", () => {
  test("あるキャラが2つのシナリオに登場するログを渡したら、2件のグループが返る", () => {
    const log = scenariosForCharacter("天道 未久美", [scenarioA, scenarioB, scenarioC])
    expect(log).toHaveLength(2)
  })
})