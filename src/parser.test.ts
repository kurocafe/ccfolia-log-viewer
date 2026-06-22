import { describe, test, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parserLog, parseD100Rolls } from "./parser"

// 実際のサンプルログ（docs/cc.html）を入力に使う。
// happy-dom 環境なので DOMParser が利用できる。
const ccHtml = readFileSync("docs/cc.html", "utf-8")

describe("parser（実ログ docs/cc.html）", () => {
  test("parseD100Rolls は技能値なしの生1d100を155件抽出する", () => {
    const rolls = parseD100Rolls(ccHtml)
    expect(rolls).toHaveLength(155)
  })

  test("抽出した出目はすべて 1〜100 の範囲に収まる", () => {
    const rolls = parseD100Rolls(ccHtml)
    for (const r of rolls) {
      expect(r.roll).toBeGreaterThanOrEqual(1)
      expect(r.roll).toBeLessThanOrEqual(100)
    }
  })

  test("parserLog は CC/CCB エントリを抽出する（1件以上）", () => {
    const entries = parserLog(ccHtml)
    expect(entries.length).toBeGreaterThan(0)
    // 生1d100は CC/CCB エントリには混ざらない
    for (const e of entries) {
      expect(["CC", "CCB"]).toContain(e.command)
    }
  })
})
