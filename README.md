# ccfolia Log Viewer

ccfoliaのダイスログを解析・可視化するツールです。

## 概要

ccfoliaのセッションログ（HTML形式）を読み込み、キャラクターごとのダイス判定結果を集計します。また、セッション終了後の成長ロールを自動で処理する機能も備えています。

**主な機能**

- キャラクターごとの判定結果（クリティカル / スペシャル / ハード成功 / 成功 / 失敗 / ファンブル）を集計
- 成功率・クリティカル率・ファンブル率の表示
- 列ヘッダークリックによる並び替え
- キャラクターを選択して成長ロールを自動実行
- クリティカル成長・成長ロール・合計増加値の表示

## 使い方

1. ccfoliaのセッションログをHTML形式でエクスポートする
2. 「ccfolia ログ (.html) を選択」ボタンからファイルを読み込む
3. 判定記録テーブルで結果を確認する
4. 成長ロールを行うキャラクターにチェックを入れる
5. 「成長ロール実行」ボタンを押す

> - 初期値成功による成長判定は含まれていません。
> - 成長ルールは「どんでも卓」に準拠しています。

## 技術スタック

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4

## 環境構築
**必要なもの**
- [Node.js](https://nodejs.org/) 18以上（npm同梱）

```bash
# リポジトリをクローン
git clone https://github.com/kurocafe/ccfolia-log-viewer.git
cd ccfolia-log-viewer

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

起動後にターミナルに表示されるURLを開いてください