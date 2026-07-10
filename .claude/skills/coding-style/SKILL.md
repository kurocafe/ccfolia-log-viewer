---
name: coding-style
description: プロジェクトのコーディングスタイルガイドライン。コードを書く・レビューするときにこのスキルを参照してください。
user-invocable: false
# allowed-tools:
#   - "Read"
#   - "Grep"
# model: sonnet
# context: fork        # 独立したサブエージェントコンテキストで実行する場合
# agent: general-purpose
---

# コーディングスタイルガイド

プロジェクト固有のコーディング規約を定義します。
以下は TypeScript / React / Python / Go / Ruby / Java / C の**模範デフォルト**です。
プロジェクトの慣習と食い違う場合はプロジェクト側に合わせて書き換えてください。

> **プロジェクト開始時**: 使わない言語のセクションは削除してください。
> スキルは読み込まれるたびに全文がコンテキストに入るため、短いほど効きます。

## 基本原則

- **明快さ優先**: 賢いコードより読みやすいコードを書く
- **最小限の複雑さ**: 現在の要件に必要な分だけ実装する
- **一貫性**: 迷ったら既存コードのパターンに従う（このガイドより既存の慣習を優先）

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

## 命名規則 — Python

```python
# 変数・関数: snake_case。関数は動詞で始める
user_name = "..."
def fetch_user(): ...

# クラス: PascalCase / 定数: UPPER_SNAKE_CASE
class UserService: ...
MAX_RETRY_COUNT = 3

# モジュール内部専用: 先頭アンダースコア
def _parse_line(): ...
```

## 命名規則 — Ruby

RuboCop の標準ルールに従う。

```ruby
# 変数・メソッド: snake_case / クラス・モジュール: PascalCase / 定数: SCREAMING_SNAKE_CASE
user_name = "..."
def fetch_user; end
class UserService; end
MAX_RETRY_COUNT = 3

# 真偽値を返すメソッドは ? で終える / 破壊的・危険なメソッドは ! で終える
def active?; end
def save!; end

# ファイル名: クラス名に対応する snake_case（UserService → user_service.rb）
```

**Rails の場合**: 命名はスタイルではなく動作を決める（自動ロード・自動マッピングの前提）。

```ruby
# モデル: 単数形クラス ⇔ テーブルは複数形（app/models/user.rb）
class User < ApplicationRecord; end          # → users テーブル

# コントローラ: 複数形 + Controller（app/controllers/users_controller.rb）
class UsersController < ApplicationController; end

# 外部キー: 参照先モデル名_id（user_id）。アソシエーションが自動解決される
# ファイルパスとクラス名の対応を崩さない（崩すと Zeitwerk のロードが失敗する）
```

## 関数

- 1関数1責務を守る
- 引数は3つ以内を目安にする（超える場合はオブジェクト/辞書にまとめる）
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

1. 外部ライブラリ（react, next, ...）
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
