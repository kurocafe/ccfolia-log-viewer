# TEMPLATE

新規プロジェクト向けの Claude Code スターターテンプレートです。
よく使うスラッシュコマンド・エージェント・スキル・ルールをあらかじめ用意しています。

## ディレクトリ構成

```
.
├── .claude/
│   ├── CLAUDE.md                        # Claude Code 向けプロジェクト設定
│   ├── settings.json                    # 権限・hooks 設定
│   ├── commands/
│   │   ├── plan.md                      # /plan — 実装計画の立案
│   │   ├── review.md                    # /review — コードレビュー
│   │   └── commit.md                    # /commit — コミット作成
│   ├── agents/
│   │   └── reviewer.md                  # レビュー専門サブエージェント
│   ├── skills/
│   │   └── coding-style/
│   │       └── SKILL.md                 # コーディングスタイルガイド
│   └── rules/
│       └── markdown-docs.md             # ドキュメント規約
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md         # PR テンプレート
└── README.md
```

## セットアップ

1. このテンプレートからリポジトリを作成する
2. `.claude/CLAUDE.md` にプロジェクト固有の情報を記述する
3. `.claude/settings.json` の権限設定をプロジェクトに合わせて調整する
4. `.claude/skills/coding-style/SKILL.md` をプロジェクトの規約に合わせて編集する
5. Claude Code で開発を開始する

---

## 各ファイルの役割と使い方

### `.claude/CLAUDE.md` — プロジェクト設定

Claude Code がプロジェクトを理解するための中心ファイルです。
**200行以内**に収めるほど遵守精度が上がります。

記述すべき内容：

| セクション | 内容 |
|-----------|------|
| プロジェクト概要 | 目的・ゴール |
| 技術スタック | 言語・フレームワーク・ツール |
| 開発ルール | ブランチ戦略・コミット規約 |
| 重要なコンテキスト | アーキテクチャ上の決定・背景情報 |
| よく使うコマンド | `npm run dev` など |

---

### `.claude/settings.json` — 権限設定

Claude Code が実行できるツールと確認が必要な操作を定義します。
以下は構造の説明用サンプルです（実際の値はテンプレートの `settings.json` を参照）。

```
{
  "permissions": {
    "allow": [...],  // 自動で許可
    "ask":   [...],  // 実行前に確認
    "deny":  []      // 常に拒否
  },
  "hooks": {}
}
```

**カスタマイズ例：**
- `npm` コマンドを毎回確認なしで実行したい → `"allow"` に `"Bash(npm *)"` を追加
- `git push` を禁止したい → `"deny"` に `"Bash(git push*)"` を移動
- フックで自動処理を追加したい → `/update-config` スキルを使う

---

### `.claude/commands/` — スラッシュコマンド

チャット欄で `/コマンド名` と入力すると実行されます。

#### `/plan` — 実装計画の立案

```
/plan ログイン機能を追加したい
```

要件整理 → 影響ファイルの特定 → 実装ステップの提示 → **承認後に実装開始**、という流れで作業します。
いきなりコードを書き始めるリスクを減らせます。

#### `/review` — コードレビュー

```
/review
/review src/auth.ts
```

変更済みコードを、セキュリティ・パフォーマンス・可読性・設計の観点でレビューします。
指摘は `🔴 Critical / 🟡 Warning / 🔵 Suggestion` の3段階で分類されます。

#### `/commit` — コミット作成

```
/commit
/commit ログイン機能の実装
```

`git diff` を解析し、[Conventional Commits](https://www.conventionalcommits.org/) 形式でコミットメッセージを作成・実行します。

---

### `.claude/agents/` — サブエージェント

複雑なタスクを専門エージェントに委譲するための定義ファイルです。

#### `reviewer` エージェント

コードレビューに特化したエージェントです。`/review` コマンドから内部的に呼び出されます。
使用ツールを `Read / Glob / Grep` に制限し、`permissionMode: plan` で安全に動作します。

> `skills:` フィールドはデフォルトでコメントアウトされています。`coding-style` スキルをレビュー時に参照させたい場合は `agents/reviewer.md` の以下の行を解除してください。
> ```yaml
> # skills:
> #   - coding-style
> ```
> ↓
> ```yaml
> skills:
>   - coding-style
> ```

**フロントマターの主なフィールド：**

| フィールド | 説明 |
|-----------|------|
| `allowedTools` | エージェントが使えるツールの制限 |
| `model` | 使用モデル（`sonnet` / `haiku` / `opus`） |
| `maxTurns` | 最大ターン数（暴走防止） |
| `permissionMode` | `plan`（書き込み不可）/ `default` |
| `skills` | プリロードするスキルのリスト |

**カスタムエージェントの追加方法：**
`agents/my-agent.md` を作成し、`Agent(subagent_type="my-agent", ...)` で呼び出します。

---

### `.claude/skills/` — スキル

エージェントや Claude Code にプリロードできる知識・手順の定義です。

#### `coding-style` スキル

`user-invocable: false` のため、ユーザーが直接呼び出すことはできません。
`reviewer` エージェントの `skills:` フィールドで読み込まれ、レビュー時の判断基準になります。

**カスタマイズ：** `SKILL.md` の命名規則・関数設計・テスト方針をプロジェクトに合わせて書き換えてください。

---

### `.claude/rules/` — ルール

会話を通じて常に適用されるガイドラインです。`CLAUDE.md` に書くと長くなる内容をここに切り出します。

#### `markdown-docs.md`

`docs/` ディレクトリへのドキュメント作成規約と ADR（アーキテクチャ決定記録）のテンプレートを定義しています。

---

## スラッシュコマンド一覧

| コマンド | 説明 |
|---------|------|
| `/plan` | 実装前に計画を立案する |
| `/review` | コードレビューを実施する |
| `/commit` | Conventional Commits 形式でコミットする |

---

## アーキテクチャパターン

### Command → Agent → Skill の3層構造

```
/command (commands/*.md)
  └─ Agent (agents/*.md)            ← 専門エージェントに委譲
       └─ Skill (skills/*/SKILL.md) ← エージェントにプリロード
```

- **Command**: ユーザー入力を受け取るエントリーポイント
- **Agent**: 専門的な作業を担当するサブエージェント
- **Skill**: 知識・手順の定義（`user-invocable: false` で内部専用化も可能）

サブエージェントは Bash では起動できません。必ず `Agent` ツールを使います：

```
Agent(subagent_type="agent-name", description="...", prompt="...")
```

---

## ベストプラクティス

- 複雑なタスクは `/plan` で計画を立ててから実装する
- コンテキスト使用率が 50% 前後になったら `/compact` で圧縮する
- サブタスクはコンテキスト 50% 以内で完了できる粒度に分割する
- 長時間コマンドはバックグラウンドタスクとして実行する
