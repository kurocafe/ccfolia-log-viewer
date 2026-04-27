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

このドキュメントはプロジェクト固有のコーディング規約を定義します。
チームのニーズに合わせてカスタマイズしてください。

## 基本原則

- **明快さ優先**: 賢いコードより読みやすいコードを書く
- **最小限の複雑さ**: 現在の要件に必要な分だけ実装する
- **一貫性**: 既存のパターンに従う

## 命名規則

```
// 変数・関数: camelCase
const userName = "..."
function fetchUser() {}

// クラス・型: PascalCase
class UserService {}
type UserResponse = {}

// 定数: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3

// ファイル名: kebab-case
user-service.ts
```

## 関数

- 1関数1責務を守る
- 引数は3つ以内を目安にする（超える場合はオブジェクトにまとめる）
- 副作用は最小限にする

## エラーハンドリング

- エラーを握りつぶさない
- エラーメッセージは具体的にする
- ユーザー向けメッセージとデバッグ用ログを区別する

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
- 外部依存はモック化する（ただし統合テストは除く）
