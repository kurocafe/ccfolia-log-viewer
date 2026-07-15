import type { Theme } from "./useTheme"

interface ThemeCopy {
  eyebrow: string
  title: string
  subtitle: string
  uploadIdle: string
  uploadDrag: string
  excludeNpc: string
  includeD100: string
  growthButton: string
  growthNote: string
  statsTitle: string
  explorer: string
  countSuffix: string
  growthTitle: string
  toggleLabel: string
  navLocal: string
  navDashboard: string
  dashboardEmpty: string
  uploadTitle: string
  uploadPasswordPlaceholder: string
  uploadFileLabel: string
  uploadSubmit: string
  uploadInProgress: string
  loadingLogs: string
  scenarioListTitle: string
  characterStatsButton: string
  characterStatsTitle: string
  allRunsLabel: string
  runSuffix: string
}

export const COPY: Record<Theme, ThemeCopy> = {
  cool: {
    eyebrow: "✦ ARCANE CHRONICLE ✦",
    title: "CCFOLIA LOG VIEWER",
    subtitle: "",
    uploadIdle: "⊕ ログファイルを選んでね (.html)",
    uploadDrag: "⊕ ログファイルをドロップ (.html)",
    excludeNpc: "NPCとおもわしきキャラクターを除外する",
    includeD100: "技能値なしの1d100も判定に含める",
    growthButton: "✦ 成長ロール実行",
    growthNote: "※ 初期値成功による成長判定は含まれていません",
    statsTitle: "判定記録",
    explorer: "探索者",
    countSuffix: "characters",
    growthTitle: "成長記録",
    toggleLabel: "🌸",
    navLocal: "LOCAL",
    navDashboard: "CHRONICLE",
    dashboardEmpty: "まだ記録がありません",
    uploadTitle: "記録を追加",
    uploadPasswordPlaceholder: "合言葉",
    uploadFileLabel: "⊕ ログファイルを選ぶ (.html)",
    uploadSubmit: "アップロード実行",
    uploadInProgress: "アップロード中…",
    loadingLogs: "記録を読み込み中…",
    scenarioListTitle: "シナリオ記録",
    characterStatsButton: "✦ 探索者名鑑を見る",
    characterStatsTitle: "探索者名鑑",
    allRunsLabel: "全陣",
    runSuffix: "陣",
  },
  soft: {
    eyebrow: "✿ ccfolia dice log ✿",
    title: "ろぐびゅ〜あ〜",
    subtitle: "ダイスログを可視化するよ〜",
    uploadIdle: "🎲 ログファイルをえらんでね（.html）",
    uploadDrag: "🎲 ここにぽいっとしてね",
    excludeNpc: "NPCっぽいキャラクターをかくす",
    includeD100: "技能なしの1d100もいれる",
    growthButton: "✨ 成長ロールするよ",
    growthNote: "※ 初期値成功による成長判定は含まれていません",
    statsTitle: "はんてい記録",
    explorer: "たんさくしゃ",
    countSuffix: "にん",
    growthTitle: "せいちょう記録",
    toggleLabel: "🌙",
    navLocal: "てもと",
    navDashboard: "みんなのログ",
    dashboardEmpty: "まだログがないよ〜 さいしょの記録をおくってね",
    uploadTitle: "ログをついかする",
    uploadPasswordPlaceholder: "あいことば",
    uploadFileLabel: "🎲 ログファイルをえらんでね",
    uploadSubmit: "🎲 とうろくする",
    uploadInProgress: "とうろくちゅう…",
    loadingLogs: "なうろーでぃんぐ…",
    scenarioListTitle: "シナリオ一覧",
    characterStatsButton: "✨ みんなのとうけいを見る",
    characterStatsTitle: "みんなのとうけい",
    allRunsLabel: "ぜんぶ",
    runSuffix: "じん",
  },
}
