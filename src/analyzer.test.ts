import { describe, test, expect } from "vitest"
import { analyzer } from "./analyzer"
import type { DiceRollEntry, D100Roll } from "./types"

// テスト用に DiceRollEntry を手早く作るヘルパー。
// 必要な項目だけ上書きできるようにしておく。
function entry(overrides: Partial<DiceRollEntry>): DiceRollEntry {
  return {
    charName: "A",
    command: "CCB",
    skill: "目星",
    target: 50,
    roll: 30,
    result: "success",
    baseTarget: 50,
    ...overrides,
  }
}

function d100(roll: number, charName = "A"): D100Roll {
  return { charName, roll }
}

describe("analyzer の 1d100 合算", () => {
  test("includeD100 が false のとき 1d100 は集計されない", () => {
    const entries = [entry({ command: "CCB", roll: 30 })]
    const rolls = [d100(1), d100(100)]

    const stats = analyzer(entries, rolls, false)

    expect(stats[0].total).toBe(1) // CCB の1件だけ
    expect(stats[0].counts.critical).toBe(0)
  })

  test("CCB ログでは 1〜5 がクリティカル", () => {
    const entries = [entry({ command: "CCB" })]
    const rolls = [d100(1), d100(5), d100(6)]

    const stats = analyzer(entries, rolls, true)

    // 出目 1, 5 がクリティカル、6 は中間（成否なし）
    expect(stats[0].counts.critical).toBe(2)
  })

  test("CC ログでは出目1だけがクリティカル", () => {
    const entries = [entry({ command: "CC" })]
    const rolls = [d100(1), d100(3), d100(5)]

    const stats = analyzer(entries, rolls, true)

    // CC は 1 のみ。3, 5 はクリティカルにならない
    expect(stats[0].counts.critical).toBe(1)
  })

  // === ここから下はご自身で書いてみる用のTODO ===
  // test("96〜100 はファンブルになる", () => { ... })
  // test("中間の出目（6〜95）は total にだけ加算される", () => { ... })
  // test("1d100しか振っていないキャラも includeD100 時は集計対象になる", () => { ... })
})
