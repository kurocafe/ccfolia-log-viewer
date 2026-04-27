---
description: 変更内容を分析してconventional commits形式でコミットを作成する
# argument-hint: "[コミットの補足情報]"
# model: haiku
---

# /commit

変更内容を分析してコミットを作成します。

## 手順

1. `git status` と `git diff` で変更内容を確認する
2. 変更の意図を理解してコミットメッセージを作成する
3. 関連するファイルをステージングする
4. コミットを実行する

## コミットメッセージ規約

```
<type>: <summary>

[optional body]
```

**type の種類:**
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント
- `chore`: ビルド・設定変更
- `style`: フォーマット変更（動作に影響なし）

## 注意事項

- `.env` や認証情報を含むファイルはコミットしない
- 無関係な変更は別コミットに分ける

$ARGUMENTS
