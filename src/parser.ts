import type { ResultType, DiceRollEntry, D100Roll } from "./types"

// 文字列やファイルを読み取って構造化データに変換する
function mapResultType(type: string): ResultType | null {
  switch (type) {
    case '決定的成功':
    case '決定的成功/スペシャル':
    case 'クリティカル':
      return 'critical'
    case 'スペシャル':
    case 'イクストリーム成功':
      return 'special'
    case 'ハード成功':
      return 'hardSuccess'
    case '成功':
    case 'レギュラー成功':
      return 'success'
    case '失敗':
      return 'failure'
    case '致命的失敗':
    case 'ファンブル':
      return 'fumble'
    default:
      return null
  }
}

export function parserLog(html: string): DiceRollEntry[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const paragraphs = doc.querySelectorAll('p')

  const entries: DiceRollEntry[] = []
  for (const p of paragraphs) {
    const spans = p.querySelectorAll('span')
    if (spans.length < 3) continue
    const charName = spans[1].textContent?.trim().replace(/\s+/g, ' ') ?? ''
    const commandText = spans[2].textContent?.trim() ?? ''
    if (!commandText.startsWith('CC<=') && !commandText.startsWith('CCB<=')) {
      continue
    }
    const parts = commandText.split('＞')
    if (parts.length < 2) continue
    const resultLabel = parts[parts.length - 1].trim()
    if (!isNaN(Number(resultLabel))) {
      continue
    }
    const command = commandText.startsWith('CCB') ? 'CCB' : 'CC'
    const skillMatch = commandText.match(/【(.+?)】/)
    const skill = skillMatch?.[1]
    const targetMatch = commandText.match(/1D100<=(\d+)/)
    const target = targetMatch?.[1]
    const roll = parts[parts.length - 2].trim()
    const baseTargetMatch = commandText.match(/CC[B]?<=(\d+)/)
    const baseTarget = baseTargetMatch?.[1]

    if (!skill || !target || !baseTarget || isNaN(Number(roll)
    )) continue

    const result = mapResultType(resultLabel)
    if (result === null) continue

    entries.push({
      charName,
      command,
      skill: skill ?? '',
      target: Number(target),
      roll: Number(roll),
      result,
      baseTarget: Number(baseTarget)
    })
  }

  return entries
}

// 技能値を持たない生の 1d100（例: "1D100  (1D100) ＞ 40"）を抽出する
export function parseD100Rolls(html: string): D100Roll[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const paragraphs = doc.querySelectorAll('p')

  const rolls: D100Roll[] = []
  for (const p of paragraphs) {
    const spans = p.querySelectorAll('span')
    if (spans.length < 3) continue
    const charName = spans[1].textContent?.trim().replace(/\s+/g, ' ') ?? ''
    const commandText = spans[2].textContent?.trim() ?? ''
    // 技能値付き（CC/CCB や 1D100<=XX）は対象外。出目だけの 1d100 のみ拾う
    if (!commandText.startsWith('1D100') || commandText.includes('<=')) {
      continue
    }
    const parts = commandText.split('＞')
    if (parts.length < 2) continue
    const roll = Number(parts[parts.length - 1].trim())
    if (isNaN(roll)) continue

    rolls.push({ charName, roll })
  }

  return rolls
}