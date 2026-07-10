---
name: coding-style
description: プロジェクトのコーディングスタイルガイドライン。コードを書く・レビューするときにこのスキルを参照してください。
user-invocable: false
---

# コーディングスタイルガイド

このプロジェクト（Vite + React + TypeScript + Tailwind CSS）のコーディング規約です。
スキルは読み込まれるたびに全文がコンテキストに入るため、短く保ちます。
プロジェクトの慣習と食い違う場合は、このガイドより既存コードのパターンを優先してください。

## 基本原則

- **明快さ優先**: 賢いコードより読みやすいコードを書く
- **最小限の複雑さ**: 現在の要件に必要な分だけ実装する
- **一貫性**: 迷ったら既存コードのパターンに従う

## 命名規則 — TypeScript / React

```ts
// 変数・関数: camelCase。関数は動詞で始める
const userName = "..."
function fetchUser() {}

// boolean は is / has / can / should で始める
const isLoading = true
const hasPermission = false

// クラス・型・インターフェース: PascalCase（I プレフィックスは付けない）
class UserService {}
type UserResponse = {}
interface Props {}        // ✅ / ❌ IProps

// 定数: UPPER_SNAKE_CASE（モジュールレベルの不変値のみ）
const MAX_RETRY_COUNT = 3

// React コンポーネント: PascalCase。カスタムフックは use で始める
function UserCard() {}
function useDiceLog() {}

// イベントハンドラ: 定義側は handle〜、props 側は on〜
<Button onClick={handleSubmit} />   // 定義: handleSubmit / props名: onClick
```

**ファイル名:**

- React コンポーネント: `UserCard.tsx`（PascalCase）
- それ以外: `dice-parser.ts`（kebab-case）
- テスト: 対象と同名 + `.test.ts(x)`（例: `dice-parser.test.ts`）

## 関数

- 1関数1責務を守る
- 引数は3つ以内を目安にする（超える場合はオブジェクトにまとめる）
- 早期リターンを優先し、ネストは3段以内に抑える

```ts
// ❌ 悪い例: ネストが深い
function process(user) {
  if (user) {
    if (user.isActive) { /* ... */ }
  }
}

// ✅ 良い例: 早期リターン
function process(user) {
  if (!user?.isActive) return
  /* ... */
}
```

## エラーハンドリング

- エラーを握りつぶさない
- エラーメッセージには「何をしようとして・何が起きたか」を含める
- ユーザー向けメッセージとデバッグ用ログを区別する

```ts
// ❌ 悪い例: 握りつぶし
try { await save(data) } catch (e) {}

// ✅ 良い例: 文脈を付けて処理する
try {
  await save(data)
} catch (e) {
  logger.error("設定の保存に失敗", { cause: e, dataId: data.id })
  throw new SaveError("設定を保存できませんでした", { cause: e })
}
```

## import 順序（TypeScript）

1. 外部ライブラリ（react, ...）
2. プロジェクト内の絶対パス（`@/...`）
3. 相対パス（`./`, `../`）

各グループの間は空行で区切る。

## コメント

- **何をするか**ではなく**なぜそうするか**をコメントする
- 自明なコードにコメントは不要
- TODO コメントには担当者と期日を添える

```ts
// TODO(username): 2025-XX-XX までに○○に対応する
```

## テスト

- テスト名は「〜のとき、〜すること」の形式で書く
- Arrange / Act / Assert の構造を意識する
- 内部実装ではなく振る舞い（入力→出力・副作用）を検証する
- 外部依存はモック化する（ただし統合テストは除く）
