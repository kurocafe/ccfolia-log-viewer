# 設計書: ccfolia ログビューワー

## ログフォーマット

### HTML構造（CC・CCB共通）

```html
<p style="color:#xxx;">
  <span> [main]</span>
  <span>キャラクター名</span> :
  <span>
    CC/CCB コマンドと結果
  </span>
</p>
```

### CCフォーマット（7版）

```
CC<=95 【知識】 (1D100<=95) ボーナス・ペナルティダイス[0] ＞ 92 ＞ 92 ＞ レギュラー成功
```

結果語: `イクストリーム成功` / `ハード成功` / `レギュラー成功` / `失敗` / `ファンブル`

### CCBフォーマット（6版）

```
CCB<=50 【幸運】 (1D100<=50) ＞ 6 ＞ スペシャル
```

結果語: `決定的成功/スペシャル` / `スペシャル` / `成功` / `失敗` / `致命的失敗`

---

## 型定義

```typescript
type DiceCommand = 'CC' | 'CCB'

type ResultType = 'critical' | 'special' | 'success' | 'failure' | 'fumble'

// 正規化マッピング
// CC:  イクストリーム成功 → critical
//      ハード成功         → special
//      レギュラー成功     → success
//      失敗               → failure
//      ファンブル         → fumble
// CCB: 決定的成功/スペシャル → critical  ※出目≦5 かつ 出目≦技能値/5
//      決定的成功            → critical  ※出目≦5 だが技能値が低く技能値/5の閾値に届かない場合
//      スペシャル            → special   ※出目≦技能値/5 だが出目>5 の場合（技能値が高い場合）
//      成功                  → success
//      失敗                  → failure
//      致命的失敗            → fumble

interface DiceRollEntry {
  charName: string
  command: DiceCommand
  skill: string    // 例: "知識"
  target: number   // 1D100<=XX の XX
  roll: number     // 出目
  result: ResultType
}

interface CharacterStats {
  charName: string
  total: number
  counts: Record<ResultType, number>
  successRate: number  // (critical + special + success) / total
  fumbleRate: number   // fumble / total
}
```

---

## データフロー

```
HTML file（アップロード）
  └─ Parser: HTML → DiceRollEntry[]
       └─ Analyzer: DiceRollEntry[] → CharacterStats[]
            └─ View: CharacterStats[] → テーブル表示
```

### パーサーの方針

```
HTMLをDOMParserで解析
  └─ 全<p>要素を取得
       └─ 各<p>の2番目<span> → charName
          各<p>の3番目<span> → コマンドテキスト
            └─ CCまたはCCBで始まる場合のみ処理
                 └─ 全角「＞」で分割して末尾 → result文字列
                      └─ ResultTypeに正規化 → DiceRollEntry
```

---

## 画面構成

```
[HTMLファイルをアップロード]
         ↓
┌──────────────────────────────────────────────────────┐
│ キャラ名 | 合計 | 大成功 | 成功 | 失敗 | 大失敗 | 成功率 |
│ 探索者A  |  10  |   1   |  6  |  2  |   1   |  70%  │
│ 探索者B  |   8  |   0   |  5  |  3  |   0   |  62%  │
└──────────────────────────────────────────────────────┘
```

---

## 実装ステップ

| # | 内容 | ファイル |
|---|------|---------|
| 1 | 型定義を整理 | `src/types.ts` |
| 2 | 結果語 → ResultType のマッピング関数 | `src/parser.ts` |
| 3 | HTML → DiceRollEntry[] のパーサー | `src/parser.ts` |
| 4 | DiceRollEntry[] → CharacterStats[] の集計 | `src/analyzer.ts` |
| 5 | ファイルアップロードUI | `src/App.tsx` |
| 6 | テーブル表示コンポーネント | `src/StatsTable.tsx` |
