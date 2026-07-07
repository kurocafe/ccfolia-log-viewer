import { describe, test, expect } from "vitest"
import { readFileSync } from "node:fs"
import { parserLog, parseD100Rolls } from "./parser"

// 実際のサンプルログ（docs/cc.html）を入力に使う。
// happy-dom 環境なので DOMParser が利用できる。
const ccHtml = readFileSync("docs/cc.html", "utf-8")
const x5html = readFileSync("docs/x5.html", "utf-8")
const x10html = readFileSync("docs/x10.html", "utf-8")

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

describe("parserLog (x5 複数判定)", () => {
  test("parserLog は x5 の行を5件に展開する", () => {
    const entries = parserLog(x5html)
    expect(entries).toHaveLength(5)
  })

  test("フルログを展開込みで95件にパースする", () => {
    const entries = parserLog(x10html)
    expect(entries).toHaveLength(95)
  })
}) 
