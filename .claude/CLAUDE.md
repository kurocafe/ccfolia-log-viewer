# CLAUDE.md

このファイルはClaude Codeがプロジェクトを理解するための設定ファイルです。
**200行以内に収めること**（超えると遵守精度が下がります）。

## プロジェクト概要

ccfoliaのダイスログの結果を可視化するツールです。

## 技術スタック

vite + react + typescript + tailwindcss

## 開発ルール

勉強するため、できるだけユーザが自力でコーディングします


## 重要なコンテキスト

 - CoC（クトゥルフ神話TRPG）6版のルールに基づいている
 - 成長ロールは「失敗＝成長できる」（reRoll > target で成長）
 - baseTargetは修正前の技能値（デバフ後の値ではない）
 - NON_GROWTH_SKILLSは成長判定対象外

## よく使うコマンド

```bash
# 例: 開発サーバー起動
npm run dev

# 例: テスト実行
# npm test

# 例: ビルド
# npm run build
```

## アーキテクチャパターン

### Command → Agent → Skill

複雑なワークフローは以下の3層で構成します：

```
/command (commands/*.md)
  └─ Agent (agents/*.md)         ← 専門エージェントに委譲
       └─ Skill (skills/*/SKILL.md) ← エージェントにプリロード
```

- **Command**: エントリーポイント。ユーザーの入力を受け取り、エージェントを呼び出す
- **Agent**: 専門的な作業を担当。`skills:` フィールドでスキルをプリロード可能
- **Skill**: 知識・手順の定義。`user-invocable: false` で内部専用にできる

### サブエージェントの呼び出し

サブエージェントはbashコマンドでは起動できません。必ず `Agent` ツールを使用：

```
Agent(subagent_type="agent-name", description="...", prompt="...")
```

## ベストプラクティス

- 複雑なタスクは `/plan` で計画を立ててから実装する
- コンテキスト50%前後で手動 `/compact` を実行する
- サブタスクはコンテキスト50%以内で完了できる粒度に分割する
- 長時間コマンドはバックグラウンドタスクとして実行する
