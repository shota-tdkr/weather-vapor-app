const airMass = document.getElementById("air-mass");
const airMassCloud = document.getElementById("air-mass-cloud");
const tempValueEl = document.getElementById("temp-value");
const tempStripFill = document.getElementById("temp-strip-fill");
const heightValueEl = document.getElementById("height-value");
const vaporFill = document.getElementById("vapor-fill");
const vaporExcessBand = document.getElementById("vapor-excess-band");
const vaporNoRoom = document.getElementById("vapor-no-room");
const vaporCapLine = document.getElementById("vapor-cap-line");
const vaporCapLabel = document.getElementById("vapor-cap-label");
const excessValueEl = document.getElementById("excess-value");
const excessReadoutEl = document.getElementById("excess-readout");
const cloudFlashEl = document.getElementById("cloud-flash");
const cloudFlashMainEl = document.getElementById("cloud-flash-main");
const cloudFlashSubEl = document.getElementById("cloud-flash-sub");
const legendEl = document.getElementById("legend");
const distanceLever = document.getElementById("distance-lever");
const distanceLeverFill = document.getElementById("distance-lever-fill");
const distanceLeverHandle = document.getElementById("distance-lever-handle");
const distanceLeverCaptionEl = document.getElementById("distance-lever-caption");
const distanceLeverPanel = document.getElementById("distance-lever-panel");
const vaporLevelLever = document.getElementById("vapor-level-lever");
const vaporLevelFill = document.getElementById("vapor-level-fill");
const vaporLevelHandle = document.getElementById("vapor-level-handle");
const vaporLevelCaptionEl = document.getElementById("vapor-level-caption");
const vaporLevelLabelEl = document.getElementById("vapor-level-label");
const liftArrows = Array.from(document.querySelectorAll(".lift-arrow"));
const LIFT_ARROW_OFFSETS = [
  [0, 34],
  [-14, 42],
  [14, 42],
];
const changeLogList = document.getElementById("change-log-list");
const changeLogEl = document.getElementById("change-log");
const mapEl = document.getElementById("map");
const heldVaporValueEl = document.getElementById("held-vapor-value");
const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialBubble = document.getElementById("tutorial-bubble");
const tutorialStepLabelEl = document.getElementById("tutorial-step-label");
const tutorialTextEl = document.getElementById("tutorial-text");
const tutorialNextButton = document.getElementById("tutorial-next");
const tutorialSkipButton = document.getElementById("tutorial-skip");
const tutorialReplayButton = document.getElementById("tutorial-replay");
const quizStartButton = document.getElementById("quiz-start-button");
const quizPanel = document.getElementById("quiz-panel");
const quizProgressEl = document.getElementById("quiz-progress");
const quizExitButton = document.getElementById("quiz-exit-button");
const quizQuestionEl = document.getElementById("quiz-question");
const quizChoicesEl = document.getElementById("quiz-choices");
const quizHintEl = document.getElementById("quiz-hint");
const quizVerifyButton = document.getElementById("quiz-verify-button");
const quizCmpLinesEl = document.getElementById("quiz-cmp-lines");
const quizCmpLineA = document.getElementById("quiz-cmp-line-a");
const quizCmpLabelA = document.getElementById("quiz-cmp-label-a");
const quizCmpLineB = document.getElementById("quiz-cmp-line-b");
const quizCmpLabelB = document.getElementById("quiz-cmp-label-b");
const quizCmpNowEl = document.getElementById("quiz-cmp-now");
const quizHeightGuideEl = document.getElementById("quiz-height-guide");
const quizRevealEl = document.getElementById("quiz-reveal");
const quizYourGuessEl = document.getElementById("quiz-your-guess");
const quizRevealTextEl = document.getElementById("quiz-reveal-text");
const quizNextButton = document.getElementById("quiz-next-button");
const quizSummaryEl = document.getElementById("quiz-summary");
const quizSummaryTitleEl = document.getElementById("quiz-summary-title");
const quizSummaryResultsHeadingEl = document.getElementById("quiz-summary-results-heading");
const quizSummaryTableWrap = document.getElementById("quiz-summary-table-wrap");
const quizSummaryConclusionEl = document.getElementById("quiz-summary-conclusion");
const quizSummaryTermEl = document.getElementById("quiz-summary-term");
const quizRestartButton = document.getElementById("quiz-restart-button");
const quizSummaryExitButton = document.getElementById("quiz-summary-exit-button");
const vaporLevelPanel = document.getElementById("vapor-level-panel");

const MESSAGES = {
  // 「実験モード」という言葉が伝わらなかった非同期テストのフィードバックを受けて、
  // 「モード」という抽象的な言葉自体をやめた。
  //
  // 2026-08-26: モード切り替え方式を廃止し、「距離レバー」「高さレバー」の2本を
  // 常時同時表示する方式に変更（design.md参照）。
  //
  // 2026-08-27: 実装を確認したところ、気温はcurrentHeightのみの関数で、
  // currentDistanceは○の見た目の位置計算にしか使われておらず、モデルの中に
  // 「山の影響」という独立した要素は存在しないことが分かった（距離レバーで
  // 高さ120にした状態と、高さレバーで高さ120にした状態は完全に同一だった）。
  // 弟さんテストで「バーが二つあるのはなぜ?」という疑問が出たこととあわせ、
  // 高さレバーを撤去し、距離レバー1本の構成に戻した（design.md参照）。
  // ○自体は直接ドラッグできず、レバー操作の結果として位置・高さが自動で決まる
  //
  // 2026-08-27: レイアウト変更（マップ内蔵ゲージ・水蒸気ゲージの反転・コップ
  // 撤去）。「読む」計器（温度・水蒸気ゲージ）はマップの中、「触る」距離レバーは
  // マップの外・横向きに配置し、場所・向き・色の3点で区別する。コップは雲と
  // 同じ数字を2回描いているだけで情報を持たないため撤去し、あふれ量のg数表示を
  // 水蒸気ゲージに追加した（design.md参照）
  //
  // 2026-08-27: 「季節スライダー」改め「水蒸気の量スライダー」を実装。気温を
  // 15℃に固定したまま季節と呼ぶのは学習アプリとして誤りになるため、季節ではなく
  // 「水蒸気の量」という量そのものを動かす形にした（design.md参照）。用語も
  // 「保有水蒸気量」（教科書に存在しない造語）をやめ、「水蒸気の量」（教科書の
  // 「空気1m³中にふくまれる水蒸気の量」の一部）に統一した
  leverCaptionDistance: "距離レバー（左＝遠い　右＝山に近い）",
  leverAriaDistance: "距離レバー（山までの距離を操作します）",
  leverCaptionVapor: "水蒸気の量（左＝少ない　右＝多い）",
  leverAriaVapor: "水蒸気の量スライダー（左が少ない、右が多いです）",
  // 以下、常時表示の補足用の凡例（初回起動時の正式なチュートリアルとは別物）
  legendTitle: "記号の説明",
  legendAirMass: "○ = 空気の塊。レバー操作にあわせて位置と高さが自動で変わります（直接ドラッグはできません）。",
  legendMountain: "▲ = 山。○が斜面にぶつかると、斜面に沿って押し上げられて高さが上がります。",
  legendDistanceLever:
    "マップ下の横向きのレバー: 右へ動かすと○が山に近づきます。山にぶつかるまでは高さ0のままで、斜面に入ってから高さが上がります。",
  // 凡例では操作方法と「比べてみる」という動機だけを渡す。「多いほど低い高さで
  // 雲ができる」という法則そのものは書かない（タイプCで自分で発見させたい答えを
  // 凡例で先に説明してしまうと、比較する意味がなくなる。docs/design.md「設計思想と
  // 実装の食い違いの是正」参照）。法則はタイプCの答え合わせと3問後のまとめで初めて明示する
  legendVaporLevel:
    "マップ下のもう1本のレバー: 水蒸気の量を4段階（少ない/やや少ない/やや多い/多い）で切り替えます。条件を変えると、雲のできる高さがどう変わるか比べてみよう。",
  // ゲージ横の「ラベル＋数値」表示のフォーマット（例: やや多い（9.4 g/m³））
  gaugeHeldVapor: (label, value) => `${label}（${value} g/m³）`,
  // 凡例は増やさず、既存のゲージの説明に斜線の一句を足すだけにする（凡例の長さは
  // 画面が自分で説明できていない量の裏返しなので、行数を増やさない）
  // 点線は「上限」と呼ぶ。ここで「飽和水蒸気量」を出すと、体験の最後（3問後の
  // まとめ quizSummaryTerm）で「アプリで見てきた『上限』を理科では飽和水蒸気量と
  // いいます」と橋渡しする演出が成立しなくなる。「飽和水蒸気量」を出すのはあの
  // 1箇所だけ（docs/design.md「設計思想と実装の食い違いの是正」参照）
  legendVaporGauge:
    "マップ内の水蒸気ゲージ: 塗り＝水蒸気の量（高さを変えても変わりません。下のレバーで切り替えられます）、点線＝水蒸気の上限（その気温で含むことのできる量。気温が下がると降りてきます）。点線より上の斜線は、その気温ではもう入らない量です。点線が塗りより下に来た分＝上限を超えて水滴になった量を、白抜き＋輪郭線で示します。",
  // 「○が白く曇る＝雲ができる様子」という凡例は2026-08-27に削除した。○自体を
  // もくもくした雲の形に変化させる表現に変えたことで、注釈なしで雲だと伝わる
  // ようになったため（design.md参照）
  // 変化ログ（因果を段階表示するテキスト）。数値を埋め込むため関数にしているが、
  // 文言はすべてここに集約する（コード中に日本語を散らさない）
  changeLogTitle: "変化ログ",
  logLifted: "空気の塊を持ち上げました",
  logLowered: "空気の塊を下ろしました",
  // 「上げると冷える」の中間過程。教科書（中学理科・雲のでき方）:「空気は上昇すると
  // まわりの気圧が小さくなるため膨張する。そのため上昇する空気の温度は下がり…」。
  // 下げるときは逆（気圧が上がって縮む＝断熱圧縮で温まる）
  logExpand: "→ まわりの気圧が下がり、空気がふくらみました",
  logCompress: "→ まわりの気圧が上がり、空気が縮みました",
  logTempDrop: (from, to) => `→ 気温が${from}℃から${to}℃に下がりました`,
  logTempRise: (from, to) => `→ 気温が${from}℃から${to}℃に上がりました`,
  // ゲージの「上限」表示と直接つながる言い方に統一する（「抱える」の比喩を
  // アプリ全体で多用すると説明文っぽくなるため。design.md「数値の位置づけ」周辺）
  logCapacityDrop: (from, to) => `→ 水蒸気の上限が${from}g/m³から${to}g/m³に下がりました`,
  logCapacityRise: (from, to) => `→ 水蒸気の上限が${from}g/m³から${to}g/m³に上がりました`,
  // コップ撤去にともない、あふれ量の増減も「雲」の言葉だけで語る（同じ事象を
  // 2つの表現で2回言わない。design.md「端の小道具：汗をかくコップ」参照）。
  // 「あふれ」だと水蒸気のまま溢れるように読めるため、表示は「水滴になった量」に
  // 統一（理科的には抱えきれない水蒸気は水滴になる。内部の変数名 excess は据え置き）
  logExcessMore: "→ 水滴になった量が増えました",
  logExcessLess: "→ 水滴になった量が減りました",
  logExcessStillRoom: "→ まだ上限に余裕があるので、水滴はできていません",
  // 雲ができた瞬間にマップ上へ数秒だけ出す一行（変化ログは読まれないことがあるため、
  // 因果の要点をその場・その瞬間に出す。詳細は従来どおり変化ログが補う）。
  // 「ここで雲ができた！」はユーザーが今見た現象をそのまま言葉にするだけで
  // 説明臭さがない。cloudFlashSub は演出と説明を分けるための小さな補足
  // （狭い画面で収まらなければ非表示。#cloud-flash-sub の CSS 参照）
  cloudFlash: "ここで雲ができた！",
  cloudFlashSub: "水蒸気の一部が水滴に変わった",
  // 「上限をこえた水蒸気」がそのまま水蒸気で存在し続けるように読めるという指摘を受け、
  // 「こえた分が水滴になる」と因果を明示する（Phase 1 の「あふれ」→「水滴になった量」
  // と同じ整理）
  logCloudStart: "→ 上限を超えた分が水滴になり、雲ができました",
  logCloudEnd: "→ 水蒸気の量が上限を下回り、雲が消えました",
  // 水蒸気の量スライダーを切り替えたときの変化ログ。高さは変えていないので、
  // 気温・抱えられる量（飽和水蒸気量）は変化しない。変わるのは水蒸気の量自体と、
  // それに応じたあふれ量だけ
  logVaporLevelChanged: (beforeLabel, afterLabel, beforeValue, afterValue) =>
    `水蒸気の量を「${beforeLabel}」(${beforeValue}g/m³)から「${afterLabel}」(${afterValue}g/m³)に変えました`,
  // あふれ量が最大に達したときだけの一言。「雲ができる=雨が降る」という誤った
  // 因果を避けるため、雨を降らせる演出は追加せず、条件付きの説明に留める
  logRainHint: "→ さらに条件が重なると、雲の粒が成長して雨になります",
  // チュートリアル（初回起動時のみ、吹き出しガイド）。step1で「何をするアプリか」を
  // 先に渡す（審査員が最初に読む文がアプリの目的になるように。10秒で伝える狙い）。
  // 前提知識（飽和水蒸気量）のない人向けのコップの結露の導入はstep2に統合した
  // （消したわけではなく順序を「目的→背景の理科」に変えた。design.md「チュートリアル」参照）
  tutorialStepLabel: (current, total) => `${current} / ${total}`,
  // お題は3種類（C: どちらが低い高さで雲になるか / B: この高さで雲になるか /
  // A: どの高さで雲になるか）。「雲ができる高さ」だとタイプAしか説明できないので
  // 「雲ができる条件」にして3種類すべてをカバーする（docs/design.md「設計思想と
  // 実装の食い違いの是正」参照）
  tutorialStep1:
    "空気を山で持ち上げると、雲ができます。\n『お題に挑戦』で、雲ができる条件を予想して確かめてみよう。",
  tutorialStep2:
    "冷たいコップの外側に水のつぶがつくのは、まわりの空気が冷やされて、水蒸気を抱えきれなくなるから。\n同じことが空の上でも起きていて、抱えきれなかった分が水のつぶ＝雲になるよ。",
  tutorialStep3: "距離レバーを動かして、空気の塊（○）を山（▲）に近づけてみよう",
  tutorialStep4:
    "レバーを動かすと、画面の下の「変化ログ」に、なぜそうなったかが順番に表示されるよ。スクロールして見てみよう。",
  tutorialNext: "次へ",
  tutorialFinish: "はじめる",
  tutorialSkip: "スキップ",
  tutorialReplay: "使い方を見る",
  // お題モード（design.md「お題モード」参照）。「予想してから確かめる」形式にすることで、
  // レバー操作に理由と結果を与える。「不正解」「間違い」等の否定的な表現は使わず、
  // 実際の答えと理由だけを見せる
  quizStartButtonLabel: "お題に挑戦",
  quizExitButtonLabel: "自由に触る",
  quizProgress: (current, total) => `お題 ${current} / ${total}`,
  // 問題文は「言葉で直感 → 数字で確認」の順にする（design.md「数値の位置づけ」）。
  // 初見のユーザーは 9.4 が多いのか少ないのか判断できず当てずっぽうになっていた
  // ため、最初に考えるのが「水蒸気の量が多い/少ない空気」という条件になるよう、
  // 段階のラベルを主・数値をかっこ書きの補助にする。「水蒸気の量が」を主語にして
  // ゲージの見出し「水蒸気の量」と対応させる（「何がやや少ないのか分からない」への対応）。
  // ラベルはスライダー側の表記とそろえる。サブタイトルはキャッチコピーとして別文言
  quizQuestion: (label, heldVapor) =>
    `水蒸気の量が「${label}」空気です。（${heldVapor} g/m³）\n高さがどのくらいになると、雲ができるだろう？`,
  quizChoiceLabel: (index, value) => `${["①", "②", "③", "④"][index]}${value}くらい`,
  quizCheckingHint: "距離レバーを動かして、実際に確かめてみよう",
  // タイプB（この高さで雲はできる?）とタイプC（どちらが先に雲になる?）。個別値の
  // 暗記に頼らず「条件を変えたときに結果がどう変わるか」で答えられる問い方
  // （docs/design.md「お題の形式」参照）。確かめる操作は自動再生にして、操作の
  // 精度で結果が変わる余地をなくす。高さは「40 / 100」の形で相対値だと分かるように
  // する（情報パネルの「高さ 40 / 100」と一貫。「40m」と誤読させない）。
  // 高さも水蒸気の量と同じ「言葉で直感 → 数字で確認」にする（heightWord）。
  // あわせてマップ上に目標高さの目印も出す（renderQuizHeightGuide）
  quizQuestionB: (label, value, height, heightWord) =>
    `水蒸気の量が「${label}」空気（${value} g/m³）です。\n高さ${height} / 100（${heightWord}）まで上げたら、雲はできる？`,
  quizQuestionC: (aLabel, aValue, bLabel, bValue) =>
    `A: 水蒸気の量が「${aLabel}」空気（${aValue} g/m³）\nB: 水蒸気の量が「${bLabel}」空気（${bValue} g/m³）\nどちらが低い高さで雲になる？`,
  quizChoiceCanForm: "できる",
  quizChoiceCannotForm: "まだできない",
  quizChoiceA: "A",
  quizChoiceB: "B",
  quizVerifyButtonLabel: "確かめる",
  quizVerifyHint: "「確かめる」を押すと、空気の塊が自動で上がっていきます",
  // タイプCの自動再生中、いまどちらを上げているかを出す（先にAが上がることを
  // 分かりやすくする。実ユーザーの「今どちらを再生中か分からない」への対応）
  quizCmpNowPlaying: (which) => `${which} を上げています`,
  quizYourGuess: (label) => `あなたの予想: ${label}`,
  quizRevealMatched: "予想通りでした！",
  // actual は選択肢に揃えた値（実測が9でも選択肢の10で見せる。10と9の差は
  // 学習上意味がなく、選択肢と解説の食い違いによる混乱の方が問題）
  quizRevealText: (actual, heldVapor) =>
    `実際は${actual}くらいでした。この空気は水蒸気を${heldVapor}g/m³含んでいるので、${actual}まで上げると上限に達して、水滴ができ始めます。`,
  // タイプBの解説は自動再生の実測で出し分ける（design.md「お題の形式」）:
  //  ・目標より手前で雲ができた → 実際にできた高さを示す（onsetDisplayHeight）
  //  ・目標まで雲ができなかった → その旨
  quizRevealTextB: (label, value, targetHeight, canForm, onsetDisplayHeight) => {
    if (!canForm) {
      return `高さ${targetHeight} / 100ではまだ雲ができません。「${label}」空気（${value} g/m³）は、もっと上げないと上限に達しません。`;
    }
    if (onsetDisplayHeight !== null && onsetDisplayHeight < targetHeight - 2) {
      return `高さ${onsetDisplayHeight}くらいで、すでに雲ができました。「${label}」空気（${value} g/m³）は、低い高さで上限に達します。`;
    }
    return `高さ${targetHeight} / 100で上限に達し、水滴ができ始めます。（「${label}」空気 ${value} g/m³）`;
  },
  quizRevealTextC: (winner, winnerLabel) =>
    `${winner}（水蒸気の量が「${winnerLabel}」空気）の方が、低い高さで雲になりました。水蒸気の量が多いほど、少し上がったところで上限に達します。`,
  quizNextButtonLabel: "次の問題へ",
  quizFinishButtonLabel: "まとめを見る",
  // お題は C→B→A の3問固定なので問題数は受け取らない。「◯問終わりました」は完了
  // 通知で見出しとして弱かったため、画面の役割を表す「まとめ」に変更（読み順は
  // まとめ → 要点(quizSummaryConclusion) → 3問の結果 → 表 → 正式用語(quizSummaryTerm)）
  quizSummaryTitle: "まとめ",
  // 対比表の直前の小見出し。要点（法則）の後、具体的な3問の振り返りに入ることを示す
  quizSummaryResultsHeading: "3問の結果",
  // まとめ表（3問）: 予想と実際を出題順に並べる。「正解/不正解」は出さず、見比べれば
  // どこがずれたか分かる形にする（design.md「お題モード」参照）。タイプが混在するため
  // 水蒸気量ソートはやめた。1列目は問題（タイプごとに書式が違う。狭い画面は短縮形）
  quizSummaryHeadQuestion: "問題",
  quizSummaryHeadGuess: "あなたの予想",
  quizSummaryHeadActual: "実際",
  quizSummaryAirCell: (label, value) => `${label} (${value})`,
  quizSummaryCellB: (label, value, height) => `「${label}」(${value}) 高さ${height}`,
  quizSummaryCellBShort: (label, height) => `「${label}」高さ${height}`,
  quizSummaryCellC: (aLabel, aValue, bLabel, bValue) => `「${aLabel}」(${aValue}) ⇔ 「${bLabel}」(${bValue})`,
  quizSummaryCellCShort: (aLabel, bLabel) => `「${aLabel}」⇔「${bLabel}」`,
  // タイプCが必ず1問入り、比較を直接体験する。A/Bの実際列に傾向が並ばなくなる代わり
  // （design.md「お題の形式」で了承済み）
  quizSummaryConclusion: "水蒸気の量が多い空気ほど、低い高さで雲になりましたね。",
  // 学校の授業・テストに戻ったときに使えるよう、まとめの最後に正式用語へ橋渡しする。
  // 初見では「上限」で通し、最後にここで名前を渡す（design.md「お題モード」参照）
  quizSummaryTerm:
    "アプリで見てきた「上限」を、理科では「飽和水蒸気量」といいます。テストや授業でこの言葉が出てきたら、上限の点線を思い出そう。",
  quizRestartButtonLabel: "もう一度挑戦する",
};

// 気温(℃)と飽和水蒸気量(g/m³)の対応表（教科書の値と照合済み）
const SATURATION_TABLE = [
  { temp: 0, value: 4.8 },
  { temp: 5, value: 6.8 },
  { temp: 10, value: 9.4 },
  { temp: 15, value: 12.8 },
  { temp: 20, value: 17.3 },
  { temp: 25, value: 23.1 },
  { temp: 30, value: 30.4 },
];

const LAPSE_RATE = 0.08; // ℃ / 高さ1単位あたりの上昇による気温低下
const INITIAL_TEMP = 15;
const MIN_CAPACITY = 0.1; // saturationVaporAmount()が返す最小値（低温側の外挿がマイナスにならないための下限）

// 水蒸気の量スライダー: 教科書の対応表の値をそのまま4段階として使う
// （4.8=0℃欄、6.8=5℃欄、9.4=10℃欄。11.6だけは表の値そのものではなく、15℃欄の
// 12.8をそのまま使うと高さ0の時点で湿度100%＝最初から曇ってしまうため、
// 少し余裕を残した値にしている）。初期値の9.4は「露点10℃・湿度約73%」という
// 不自然でない組み合わせで、旧HELD_VAPOR固定値と同じ（design.md「水蒸気の量
// スライダー」参照）
const VAPOR_LEVELS = [
  { value: 4.8, label: "少ない" },
  { value: 6.8, label: "やや少ない" },
  { value: 9.4, label: "やや多い" },
  { value: 11.6, label: "多い" },
];
const VAPOR_LEVEL_INITIAL_INDEX = 2;
let vaporLevelIndex = VAPOR_LEVEL_INITIAL_INDEX;
let currentHeldVapor = VAPOR_LEVELS[vaporLevelIndex].value;

// お題モードは1回3問。タイプ C → B → A を1問ずつ、この固定順で出す（実ユーザーの
// フィードバック。「比較(C)で法則を掴む → 適用(B)で使う → 予測(A)で具体的な位置を
// 当てる」という学習の流れ。docs/design.md「お題の形式」参照）。プールから各タイプ
// 1問ずつランダムに選ぶので、再プレイの組み合わせは 4×20×6 = 480通り。正解はどの
// タイプもハードコードせず、確かめる段階で実際に雲が出た瞬間の高さから判定する
// （モデルの定数を変えても答えがズレない）。
//
// タイプA: 雲ができる高さを4択で予想（プール = 4段階 × 1 = 4通り）
// タイプB: 指定した高さで雲はできるか（プール = 4段階 × 5高さ = 20通り）
// タイプC: 2つの空気のどちらが低い高さで雲になるか（プール = 4段階から2つ = 6組）
const QUIZ_POOL_A = VAPOR_LEVELS.map((_, i) => ({ type: "A", vaporLevelIndex: i }));
const QUIZ_CHOICES = [10, 25, 50, 75];

// タイプBの高さ段階。「できる」10問／「まだできない」10問でちょうど半々、かつ
// 4段階すべてで両方の答えが出るように選んだ（例: 上限を70にすると「少ない」は
// 常に「まだできない」になり、段階と答えの対応を暗記できてしまう。5と90を含めて
// それを潰している。docs/design.md「お題の形式」参照）
const QUIZ_TYPE_B_HEIGHTS = [5, 20, 40, 65, 90];
// 高さ5段階の「言葉の目安」。水蒸気の量のラベル（少ない/やや少ない/やや多い/多い）と
// 同じく「やや〜」を真ん中を軸に対称に使う（design.md「お題の形式」参照）。
// index は QUIZ_TYPE_B_HEIGHTS と対応
const QUIZ_TYPE_B_HEIGHT_LABELS = ["低い", "やや低い", "中くらい", "やや高い", "高い"];
const QUIZ_POOL_B = [];
for (let vi = 0; vi < VAPOR_LEVELS.length; vi++) {
  for (const h of QUIZ_TYPE_B_HEIGHTS) {
    QUIZ_POOL_B.push({ type: "B", vaporLevelIndex: vi, targetHeight: h });
  }
}

// タイプC: 4段階から2つ選ぶ6組。プール上は aIndex < bIndex（水蒸気が少ない方,
// 多い方）で持つが、出題時に buildQuizQuestions が A/B の配置を 50% の確率で
// 入れ替える。固定のままだと「水蒸気が多い方＝B」で正解が毎回 B になり、数回
// 遊べば「CはBを押せばいい」という攻略法が成立して、「条件を比較して考える」
// というタイプCの学習目的そのものが損なわれるため（docs/design.md「設計思想と
// 実装の食い違いの是正」参照）。判定はどちらの向きでもハードコードせず、自動
// 再生で実際に雲になった高さの比較で行う
const QUIZ_POOL_C = [];
for (let i = 0; i < VAPOR_LEVELS.length; i++) {
  for (let j = i + 1; j < VAPOR_LEVELS.length; j++) {
    QUIZ_POOL_C.push({ type: "C", aIndex: i, bIndex: j });
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 3問を C → B → A の固定順で組む。各タイプのプールから1問ずつランダムに選ぶ。
// タイプCだけは、選んだ組の A/B 配置を 50% の確率で入れ替える（正解が毎回 B に
// ならないように。上記 QUIZ_POOL_C のコメント参照）。これで正解は A/B ほぼ半々に
// なり、Cの実効の組み合わせは 6組 × 2向き = 12通り（全体で 4×20×12 = 960通り）
function buildQuizQuestions() {
  const c = pickRandom(QUIZ_POOL_C);
  const cOriented =
    Math.random() < 0.5 ? c : { type: "C", aIndex: c.bIndex, bIndex: c.aIndex };
  return [cOriented, pickRandom(QUIZ_POOL_B), pickRandom(QUIZ_POOL_A)];
}

let quizQuestions = [];

let quizActive = false;
let quizQuestionIndex = 0;
let quizPhase = "choosing"; // "choosing"(予想前) | "checking"(予想後、確認中) | "revealed"(答え合わせ済み)
let quizSelectedChoice = null;
let quizResults = [];
// お題が出た直後（choosing）は距離レバーもロックし、「先に動かして確かめる」を
// できなくする。予想を選んだ時点（checking）でロック解除する
let distanceLocked = false;

// 実際に到達する範囲（温度15℃〜-5℃、飽和水蒸気量2.8〜12.8g/m³）に対して
// 余裕を持たせつつ、可動域の大半を使うように調整した値（レビュー指摘対応）
const TEMP_MIN = -10;
const TEMP_MAX = 20;
const VAPOR_MAX = 16;

// 水蒸気ゲージ（マップ内、<g transform>でオフセットするローカル座標系）のトラック寸法。
// 上に「水蒸気の量」見出し＋段階のラベル＋数値の2行を置くため、トラックの開始を
// 0→14 に下げた（下端は 14+196=210 で従来と同じ。index.htmlのrectと一致させること）
const VAPOR_TRACK_TOP = 14;
const VAPOR_TRACK_HEIGHT = 196;

// 気温の横帯（マップ左上の情報パネル内）の幅
const TEMP_STRIP_WIDTH = 76;

// 距離レバー（マップ外、横向き）のトラック寸法。cyは横向きなので常に一定
// （index.html側の初期値のまま動かさない）
const LEVER_TRACK_X = 4;
const LEVER_TRACK_WIDTH = 392;

// 雲の段階数。CLOUD_PATHSの要素数と一致させる
const CLOUD_STEPS = 4;

// 雲の形（1本のpathで表現。円を複数重ねると内側にも輪郭線が出て「丸の集合」に
// 見えてしまうため、あふれ量の各段階ごとに手描きの雲の輪郭を1つ用意し、
// 段階が変わるたびにd属性ごと差し替える。同じアンカー点を基準にスケールして
// 作っているため、段階が変わっても雲の底の位置はほぼ揃う（design.md参照）
const CLOUD_PATHS = [
  "M -12.4,-2.4 C -13.2,-5.6 -11.2,-8.8 -8.0,-8.8 C -7.6,-12.8 -2.0,-14.4 1.2,-12.0 C 2.8,-15.2 8.4,-14.8 9.6,-11.2 C 12.4,-10.8 13.2,-6.4 10.8,-4.0 C 12.4,-2.4 11.6,0.8 8.4,0.8 L -10.0,0.8 C -13.2,0.8 -14.0,-0.8 -12.4,-2.4 Z",
  "M -18.1,-3.7 C -19.4,-8.7 -16.3,-13.6 -11.3,-13.6 C -10.7,-19.8 -2.0,-22.3 3.0,-18.6 C 5.4,-23.6 14.1,-22.9 16.0,-17.4 C 20.3,-16.7 21.6,-9.9 17.8,-6.2 C 20.3,-3.7 19.1,1.2 14.1,1.2 L -14.4,1.2 C -19.4,1.2 -20.6,-1.2 -18.1,-3.7 Z",
  "M -23.3,-4.9 C -25.0,-11.5 -20.9,-18.0 -14.3,-18.0 C -13.5,-26.2 -2.0,-29.5 4.6,-24.6 C 7.8,-31.2 19.3,-30.3 21.8,-23.0 C 27.5,-22.1 29.2,-13.1 24.2,-8.2 C 27.5,-4.9 25.9,1.6 19.3,1.6 L -18.4,1.6 C -25.0,1.6 -26.6,-1.6 -23.3,-4.9 Z",
  "M -28.0,-6.0 C -30.0,-14.0 -25.0,-22.0 -17.0,-22.0 C -16.0,-32.0 -2.0,-36.0 6.0,-30.0 C 10.0,-38.0 24.0,-37.0 27.0,-28.0 C 34.0,-27.0 36.0,-16.0 30.0,-10.0 C 34.0,-6.0 32.0,2.0 24.0,2.0 L -22.0,2.0 C -30.0,2.0 -32.0,-2.0 -28.0,-6.0 Z",
];

// 距離レバー: 山への接近で自動的に高さが上がる。距離0(山頂)で最大の高さに達し、
// 距離レバー1本で可動域全体（雲が最大の濃さになり、雨のヒントが出るところまで）に届く
// （2026-08-27: 高さレバー撤去にともない、旧EXPERIMENT_MAX_HEIGHTと同じ250へ拡大。design.md参照）
const MOUNTAIN_INFLUENCE_RADIUS = 120; // 山頂からこの距離より遠いと山の影響なし
const MOUNTAIN_MAX_HEIGHT = 250; // 山頂での高さ（距離レバーが到達できる高さの上限）

// 高さの表示は実単位ではなく0〜100の相対値にする（距離レバーで到達できる高さの最大値を100とする）
const HEIGHT_DISPLAY_SCALE = 100;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// 値(value)を「0からmaxまでを均等にstepCount段階に分けたとき、何段階目まで表示するか」に
// 変換する汎用ロジック。雲の段階的な曇り方（あふれ量に応じてfill-opacityを上げる）に
// 使っている。保証する性質は次の2つ:
// ・value > 0 なら必ず1段階目(index === 0)は表示される（あふれ始めた瞬間に何も見えない、を防ぐ）
// ・最後の段階(index === stepCount - 1)はvalue === maxでちょうど表示される
//   （しきい値をmaxより大きい範囲まで等分すると、最大値でも最後の段階に届かなくなるため）
function isStepVisible(value, max, stepCount, index) {
  if (value <= 0 || stepCount <= 0) return false;
  if (stepCount === 1) return true;
  const threshold = (max * index) / (stepCount - 1);
  return value >= threshold;
}

function saturationVaporAmount(temp) {
  const table = SATURATION_TABLE;
  if (temp <= table[0].temp) {
    const [a, b] = table;
    const slope = (b.value - a.value) / (b.temp - a.temp);
    return Math.max(MIN_CAPACITY, a.value + slope * (temp - a.temp));
  }
  if (temp >= table[table.length - 1].temp) {
    const a = table[table.length - 2];
    const b = table[table.length - 1];
    const slope = (b.value - a.value) / (b.temp - a.temp);
    return b.value + slope * (temp - b.temp);
  }
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (temp >= a.temp && temp <= b.temp) {
      const ratio = (temp - a.temp) / (b.temp - a.temp);
      return a.value + ratio * (b.value - a.value);
    }
  }
  return 0;
}

// あふれ量(heldVapor - capacity)が実際に到達しうる最大値。距離レバーの上限
// (距離0、山頂＝MOUNTAIN_MAX_HEIGHT)まで上昇したときの気温・飽和水蒸気量から求める。
// MIN_CAPACITYの下限に必ず到達するとは限らないため決め打ちにせず
// saturationVaporAmount()から逆算する。雲の段階数(CLOUD_STEPS)のしきい値の基準。
// 水蒸気の量スライダーで値が変わるたびに再計算が必要なため、定数ではなく関数にした
function computeMaxExcess(heldVapor) {
  return heldVapor - saturationVaporAmount(INITIAL_TEMP - LAPSE_RATE * MOUNTAIN_MAX_HEIGHT);
}
let currentMaxExcess = computeMaxExcess(currentHeldVapor);

// 値の比率(ratio)を、縦のトラック（上端trackTop・高さtrackHeight）上での
// 「その値を示す位置のy座標」に変換する。値が大きいほどトラック上端に近づく
// （水蒸気ゲージの塗り上端・点線の位置の両方をこれで求める。共通なのは
// 「値→y」という向きだけで、塗りは矩形のy/height、点線はy1/y2と使い方が
// 違うため、setAttributeまではこの関数の外側で行う）
function verticalFillTopY(ratio, trackTop, trackHeight) {
  return trackTop + trackHeight - clamp(ratio, 0, 1) * trackHeight;
}

function triangleUpPoints(cx, cy) {
  return `${cx},${cy - 6} ${cx - 6},${cy + 6} ${cx + 6},${cy + 6}`;
}

// 高さが上がった瞬間だけ、空気の塊の下から矢印がフワッと浮かぶ演出。
// #air-massはグループ（transformで位置を持つ）になり、cx/cy属性を持たなく
// なったため、位置はDOMから読み戻さず、現在のcurrentDistanceから
// xForDistance/terrainYで直接計算する（この2関数・currentDistanceは
// ファイル後半で定義されるが、実際に呼ばれるのはドラッグ操作時＝
// 初期化がすべて終わった後なので問題ない）
function pulseLiftArrows() {
  const cx = xForDistance(currentDistance);
  const cy = terrainY(currentDistance);
  liftArrows.forEach((arrow, index) => {
    const [dx, dy] = LIFT_ARROW_OFFSETS[index];
    arrow.setAttribute("points", triangleUpPoints(cx + dx, cy + dy));
    arrow.classList.remove("pulse");
    requestAnimationFrame(() => arrow.classList.add("pulse"));
  });
}

let previousHeight = 0;
// 雲が今見えているかどうか。お題モードで「雲ができた瞬間」を検知するために
// updateGauges()の外から参照する（maybeRevealQuizAnswer()参照）
let lastCloudVisible = false;

// 雲ができた瞬間の演出。マップ上に一行を数秒だけ出し、雲を軽く弾ませる。
// あふれが0→0より大きくなった瞬間だけ呼ぶ（既に雲が出ている間の増減では呼ばない）
const CLOUD_FLASH_DURATION = 2500; // ms
let cloudFlashTimer = null;

function flashCloudMoment() {
  cloudFlashEl.setAttribute("opacity", "1");
  if (cloudFlashTimer) clearTimeout(cloudFlashTimer);
  cloudFlashTimer = setTimeout(() => {
    cloudFlashEl.setAttribute("opacity", "0");
    cloudFlashTimer = null;
  }, CLOUD_FLASH_DURATION);

  // 雲を軽く弾ませる（上昇エフェクトと同じ「クラスを外して次フレームで付け直す」
  // 方式でアニメーションを再生し直す）
  airMassCloud.classList.remove("pop");
  requestAnimationFrame(() => airMassCloud.classList.add("pop"));
}

function updateGauges(height) {
  const temp = INITIAL_TEMP - height * LAPSE_RATE;
  const capacity = saturationVaporAmount(temp);

  if (height > previousHeight + 0.5) {
    pulseLiftArrows();
  }
  previousHeight = height;

  // 距離レバーが到達できる高さの上限(MOUNTAIN_MAX_HEIGHT)がそのまま高さの実際の
  // 可動域でもあるため、表示の分母は常にこれでよい
  heightValueEl.textContent = Math.round((height / MOUNTAIN_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE);
  // 気温は整数で出す。0.1℃刻みは初見には「読むべき精度」に見えてしまうが、
  // 実際には「上げると冷える」が伝わればよい途中経過（変化ログでは前後の差が
  // 分かるよう小数1桁のまま残す）
  tempValueEl.textContent = Math.round(temp);

  // 気温の横帯（情報パネル内、従属表示）
  const tempRatio = clamp((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN), 0, 1);
  tempStripFill.setAttribute("width", tempRatio * TEMP_STRIP_WIDTH);

  // 水蒸気ゲージ（反転済み）: 塗り＝水蒸気の量（currentHeldVapor。高さを変えても
  // 動かないが、水蒸気の量スライダーで段階的に変えられる）。ゲージ横の
  // ラベル＋数値表示（#held-vapor-value）は renderVaporLevelControl() が更新する
  const heldTopY = verticalFillTopY(currentHeldVapor / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporFill.setAttribute("y", heldTopY);
  vaporFill.setAttribute("height", VAPOR_TRACK_TOP + VAPOR_TRACK_HEIGHT - heldTopY);

  // 線＝飽和水蒸気量。気温が下がるほどcapacityが減り、線(y)はトラック下端へ降りてくる
  const capLineY = verticalFillTopY(capacity / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporCapLine.setAttribute("y1", capLineY);
  vaporCapLine.setAttribute("y2", capLineY);
  vaporCapLabel.setAttribute("y", capLineY + 3);

  // 「もう入らない領域」= 上限の線より上。気温が下がるほどcapLineYが下へ動くので、
  // この斜線が上から広がっていく＝入る場所が減ることが数字なしで分かる
  vaporNoRoom.setAttribute("y", VAPOR_TRACK_TOP);
  vaporNoRoom.setAttribute("height", Math.max(0, capLineY - VAPOR_TRACK_TOP));

  // あふれ帯: 線が塗りの上端より下に来た分（＝水蒸気の量のうち抱えきれない部分）を
  // 白抜き＋輪郭線で示す。○が白く曇る雲の表現と同じ視覚言語にすることで、
  // 「白い＝あふれた分＝雲になるもの」という一貫性を作る（design.md参照）
  const excess = Math.max(0, currentHeldVapor - capacity);
  const excessBandHeight = Math.max(0, capLineY - heldTopY);
  vaporExcessBand.setAttribute("y", heldTopY);
  vaporExcessBand.setAttribute("height", excessBandHeight);
  excessValueEl.textContent = excess.toFixed(1);
  // 水滴が0のときは見出しごと隠す（「0.0 g/m³」は情報を持たないうえ、初見に
  // 「読むべき数字」を1つ増やしてしまう）。雲ができた瞬間に現れること自体が合図になる
  excessReadoutEl.setAttribute("opacity", isNearZero(excess) ? "0" : "1");

  // 距離レバー（マップ外、横向き）の見た目は、つまみ位置 u（leverRatioFromDistance）
  // をそのまま使う。0=遠い(左端), 1=山頂(右端)。先頭 APPROACH_LEVER_RATIO(15%) は
  // 接近区間で高さ0のまま（design.md「『高さ』の定義」参照）
  const distanceRatio = leverRatioFromDistance(currentDistance);
  distanceLeverFill.setAttribute("width", distanceRatio * LEVER_TRACK_WIDTH);
  distanceLeverHandle.setAttribute("cx", LEVER_TRACK_X + distanceRatio * LEVER_TRACK_WIDTH);

  // 雲: ○(air-mass-base)自体は常にそのまま残し、あふれ量に応じて○の上に
  // 雲(air-mass-cloud)が現れ、段階的に大きく育っていく。理科的にも、空気塊が
  // 消えて雲になるわけではなく、その中の水蒸気の一部が水滴になって雲を作る
  // ため（design.md参照）。あふれ量0のときは雲を非表示のままにする
  let visibleStepCount = 0;
  for (let i = 0; i < CLOUD_STEPS; i++) {
    if (isStepVisible(excess, currentMaxExcess, CLOUD_STEPS, i)) visibleStepCount += 1;
  }
  if (visibleStepCount > 0) {
    airMassCloud.setAttribute("d", CLOUD_PATHS[visibleStepCount - 1]);
  }
  airMassCloud.setAttribute("opacity", visibleStepCount > 0 ? 1 : 0);

  // 雲ができた瞬間（あふれが0→0より大きくなった瞬間）だけ演出する。
  // 既にあふれている状態での増減や、雲が消える向きでは出さない
  const cloudVisible = visibleStepCount > 0;
  if (cloudVisible && !lastCloudVisible) {
    flashCloudMoment();
  }
  lastCloudVisible = cloudVisible;
}

const CHANGE_LOG_MIN_HEIGHT_DELTA = 3; // これ未満の高さ変化はログに残さない
const CHANGE_LOG_STEP_DELAY = 350; // ms（CLAUDE.mdの0.3〜0.4秒間隔）
const CHANGE_LOG_MAX_ENTRIES = 40;

function isNearZero(value) {
  return value <= 0.05;
}

// あふれ量の前後比較から、雲の発生/消滅、またはあふれ量の増減・据え置きを1行にする。
// buildHeightChangeLog（高さの変化）とbuildVaporLevelChangeLog（水蒸気の量の変化）の
// 両方から呼ばれる共通ロジック。雲の発生/消滅と「あふれ」は同じ事象を2回言わない
// （コップ撤去にともない統合。design.md「端の小道具：汗をかくコップ」参照）。
// しきい値をまたぐ瞬間は雲の発生/消滅だけを報告し、またがない間の増減・据え置きだけを
// あふれ量で報告する
function excessTransitionLines(beforeExcess, afterExcess) {
  if (isNearZero(beforeExcess) && !isNearZero(afterExcess)) return [MESSAGES.logCloudStart];
  if (!isNearZero(beforeExcess) && isNearZero(afterExcess)) return [MESSAGES.logCloudEnd];
  if (afterExcess > beforeExcess) return [MESSAGES.logExcessMore];
  if (afterExcess < beforeExcess) return [MESSAGES.logExcessLess];
  if (isNearZero(afterExcess)) return [MESSAGES.logExcessStillRoom];
  return [];
}

// ドラッグ前後の高さから、気温→飽和水蒸気量→結露、という因果の連鎖をテキスト化する
function buildHeightChangeLog(beforeHeight, afterHeight) {
  if (Math.abs(afterHeight - beforeHeight) < CHANGE_LOG_MIN_HEIGHT_DELTA) {
    return null;
  }

  const beforeTemp = INITIAL_TEMP - beforeHeight * LAPSE_RATE;
  const afterTemp = INITIAL_TEMP - afterHeight * LAPSE_RATE;
  const beforeCapacity = saturationVaporAmount(beforeTemp);
  const afterCapacity = saturationVaporAmount(afterTemp);
  const beforeExcess = Math.max(0, currentHeldVapor - beforeCapacity);
  const afterExcess = Math.max(0, currentHeldVapor - afterCapacity);
  const rising = afterHeight > beforeHeight;

  const lines = [rising ? MESSAGES.logLifted : MESSAGES.logLowered];

  // 「なぜ上げると冷えるのか」の中間過程（気圧が下がる→膨張する）を1段はさむ。
  // 段階表示のキューにそのまま乗るので、全体の所要時間が+0.35秒になる
  lines.push(rising ? MESSAGES.logExpand : MESSAGES.logCompress);

  lines.push(
    rising
      ? MESSAGES.logTempDrop(beforeTemp.toFixed(1), afterTemp.toFixed(1))
      : MESSAGES.logTempRise(beforeTemp.toFixed(1), afterTemp.toFixed(1))
  );
  lines.push(
    rising
      ? MESSAGES.logCapacityDrop(beforeCapacity.toFixed(1), afterCapacity.toFixed(1))
      : MESSAGES.logCapacityRise(beforeCapacity.toFixed(1), afterCapacity.toFixed(1))
  );

  lines.push(...excessTransitionLines(beforeExcess, afterExcess));

  // あふれ量が最大に達した瞬間だけ、雨との関係を一言添える（「雲ができる=必ず雨」という
  // 誤った因果を避けるため、雨を降らせる演出そのものは追加しない。条件付きの一文のみ）
  const wasAtMaxExcess = beforeExcess >= currentMaxExcess;
  const isAtMaxExcess = afterExcess >= currentMaxExcess;
  if (isAtMaxExcess && !wasAtMaxExcess) {
    lines.push(MESSAGES.logRainHint);
  }

  return lines;
}

// 水蒸気の量スライダーの前後で、その場の高さ(currentHeight)におけるあふれ量の変化を
// テキスト化する。高さは変えていないので気温・抱えられる量（飽和水蒸気量）は不変
function buildVaporLevelChangeLog(beforeIndex, afterIndex) {
  const beforeLevel = VAPOR_LEVELS[beforeIndex];
  const afterLevel = VAPOR_LEVELS[afterIndex];
  const capacity = saturationVaporAmount(INITIAL_TEMP - currentHeight * LAPSE_RATE);
  const beforeExcess = Math.max(0, beforeLevel.value - capacity);
  const afterExcess = Math.max(0, afterLevel.value - capacity);

  const lines = [
    MESSAGES.logVaporLevelChanged(
      beforeLevel.label,
      afterLevel.label,
      beforeLevel.value.toFixed(1),
      afterLevel.value.toFixed(1)
    ),
  ];
  lines.push(...excessTransitionLines(beforeExcess, afterExcess));

  const wasAtMaxExcess = beforeExcess >= computeMaxExcess(beforeLevel.value);
  const isAtMaxExcess = afterExcess >= computeMaxExcess(afterLevel.value);
  if (isAtMaxExcess && !wasAtMaxExcess) {
    lines.push(MESSAGES.logRainHint);
  }

  return lines;
}

function appendLogLine(text) {
  const li = document.createElement("li");
  li.textContent = text;
  changeLogList.appendChild(li);
  while (changeLogList.children.length > CHANGE_LOG_MAX_ENTRIES) {
    changeLogList.removeChild(changeLogList.firstChild);
  }
  changeLogList.scrollTop = changeLogList.scrollHeight;
}

// 短時間に何度も操作されても因果チェーン同士が混ざらないよう、1つずつ順番に表示するキュー
const logQueue = [];
let logQueueRunning = false;

function runLogQueue() {
  if (logQueue.length === 0) {
    logQueueRunning = false;
    return;
  }
  logQueueRunning = true;
  const lines = logQueue.shift();
  let index = 0;
  function showNext() {
    if (index < lines.length) {
      appendLogLine(lines[index]);
      index += 1;
      setTimeout(showNext, CHANGE_LOG_STEP_DELAY);
    } else {
      runLogQueue();
    }
  }
  showNext();
}

function appendLogCascade(lines) {
  logQueue.push(lines);
  if (!logQueueRunning) {
    runLogQueue();
  }
}

function logHeightChange(beforeHeight, afterHeight) {
  const lines = buildHeightChangeLog(beforeHeight, afterHeight);
  if (lines) {
    appendLogCascade(lines);
  }
}

function logVaporLevelChange(beforeIndex, afterIndex) {
  appendLogCascade(buildVaporLevelChangeLog(beforeIndex, afterIndex));
}

// 山の輪郭の点データ（SVG側の図形をそのまま使う）。山は1つの前提（design.md参照）
const MOUNTAIN_POINTS = document
  .querySelector(".mountains polygon")
  .getAttribute("points")
  .trim()
  .split(/\s+/)
  .map((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return { x, y };
  });
const MOUNTAIN_PEAK = MOUNTAIN_POINTS.reduce((peak, p) => (p.y < peak.y ? p : peak), MOUNTAIN_POINTS[0]);

// ○の見た目の起点（距離レバーが最大＝山から最も遠い状態）。index.html側の
// data-far-x/data-far-yをそのまま使う（#air-massはグループになりcx/cy属性を
// 持たないため、位置の初期値はdata属性で持たせている）
const FAR_POINT = {
  x: parseFloat(airMass.dataset.farX),
  y: parseFloat(airMass.dataset.farY),
};

// FAR_POINTに近い側の裾（山頂ではない頂点のうち近い方）。○がどちら側から
// 近づいてくるかを表す
const MOUNTAIN_FOOT = MOUNTAIN_POINTS.filter((p) => p !== MOUNTAIN_PEAK).reduce((closest, p) => {
  const d = Math.hypot(p.x - FAR_POINT.x, p.y - FAR_POINT.y);
  const dClosest = Math.hypot(closest.x - FAR_POINT.x, closest.y - FAR_POINT.y);
  return d < dClosest ? p : closest;
});

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 斜面（MOUNTAIN_FOOT→MOUNTAIN_PEAK）のうち、y = FAR_POINT.y となる点。
// ○が水平に流れてきて、初めて斜面にぶつかる高さの地点として使う
const APPROACH_POINT = {
  x: lerp(MOUNTAIN_FOOT.x, MOUNTAIN_PEAK.x, (FAR_POINT.y - MOUNTAIN_FOOT.y) / (MOUNTAIN_PEAK.y - MOUNTAIN_FOOT.y)),
  y: FAR_POINT.y,
};

// 全体の移動距離のうち「水平に流れてくる区間」が占める割合。○の軌道（見た目）を
// 2段階に分ける境目で、見た目の速さが区間の境目で急変しないよう距離の比で区切る
const APPROACH_DISTANCE = Math.hypot(APPROACH_POINT.x - FAR_POINT.x, APPROACH_POINT.y - FAR_POINT.y);
const CLIMB_DISTANCE = Math.hypot(MOUNTAIN_PEAK.x - APPROACH_POINT.x, MOUNTAIN_PEAK.y - APPROACH_POINT.y);
const APPROACH_RATIO = APPROACH_DISTANCE / (APPROACH_DISTANCE + CLIMB_DISTANCE);

// 「高さ」の定義（2026-08-31変更。design.md「主役：空気塊を持ち上げる操作」参照）
// -------------------------------------------------------------------------
// 旧: 高さ = 山への接近度そのもの。○が地面を水平に移動している間も高さが増えていた
//     ため、「高さ20なのに地面を這っている」「高さ10と25が同じy座標」という、
//     言葉と見た目の矛盾が起きていた（実ユーザーの指摘）。
// 新: **接近フェーズは高さ0のまま。斜面に入ってから高さが増える。**
//     これで「高さ20」と言われたら実際に地面から20だけ上がった位置にいる。
//
// そのために「レバー位置 u」と「○の軌道パラメータ t」を分離する:
//   u = 1 - distance/半径 ∈ [0,1]（0=遠い, 1=山頂）。レバーのつまみの位置そのもの
//   t = ○の軌道上の位置 ∈ [0,1]。t <= APPROACH_RATIO が接近区間
// u を APPROACH_LEVER_RATIO で区切り、
//   u <= 0.15 → 接近（高さ0）。この 15% ぶんの軌道に t の 0〜APPROACH_RATIO を割り当てる
//   u >  0.15 → 斜面（高さ 0→MAX）。残り 85% に t の APPROACH_RATIO〜1 を割り当てる
// 幾何の APPROACH_RATIO（42%）をそのままレバーの区切りに使うと可動域の 42% が
// 「動かしても何も起きない」区間になるため、レバー側だけ 15% に圧縮している。
// ○の見た目の軌道自体は圧縮の前後で変わらない（同じ2段階の経路をたどる）。
const APPROACH_LEVER_RATIO = 0.15;

// レバーのつまみ位置（0=遠い, 1=山頂）
function leverRatioFromDistance(distance) {
  return 1 - clamp(distance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1);
}

// レバー位置 u → ○の軌道パラメータ t（接近区間をレバーの先頭 15% に圧縮する）
function pathTFromLeverRatio(u) {
  return u <= APPROACH_LEVER_RATIO
    ? APPROACH_RATIO * (u / APPROACH_LEVER_RATIO)
    : APPROACH_RATIO + (1 - APPROACH_RATIO) * ((u - APPROACH_LEVER_RATIO) / (1 - APPROACH_LEVER_RATIO));
}

// 高さ。接近区間（u <= 0.15）では 0 のまま＝まだ上昇していないので気温もゲージも
// 動かない。これは「山にぶつかって初めて押し上げられる」という教科書の地形性上昇
// そのものなので、レバーの先頭 15% が無反応なのは仕様（design.md参照）
function heightFromDistance(distance) {
  const u = leverRatioFromDistance(distance);
  if (u <= APPROACH_LEVER_RATIO) return 0;
  return MOUNTAIN_MAX_HEIGHT * ((u - APPROACH_LEVER_RATIO) / (1 - APPROACH_LEVER_RATIO));
}

// heightFromDistance の逆。お題モードのタイプB・Cが、目標の高さから距離レバーの
// 位置を逆算して自動再生するために使う。
// 注意: 高さ0 は u∈[0, 0.15] の全体に対応するので逆関数は一意に決まらない。
// ここでは **高さ0 = 山のふもと（u = 0.15）** と定義する。こうすると自動再生を
// 高さ0から始めたときに○がふもとから素直に登り出す（far から始めると最初の1
// フレームで○が 102px ワープする）。自由モードの初期位置は従来どおり far
// （currentDistance = MOUNTAIN_INFLUENCE_RADIUS）で、そちらは別に持っている
function distanceForHeight(height) {
  const clampedHeight = clamp(height, 0, MOUNTAIN_MAX_HEIGHT);
  const u = APPROACH_LEVER_RATIO + (1 - APPROACH_LEVER_RATIO) * (clampedHeight / MOUNTAIN_MAX_HEIGHT);
  return MOUNTAIN_INFLUENCE_RADIUS * (1 - u);
}

// ○のx座標（距離レバーだけで決まる）。現実の地形性上昇と同じく、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、の2段階のx軌道を使う
// （斜め一直線に山頂へ向かうと、風に流されて山に登るという現象として不自然に見えるため）
function xForDistance(distance) {
  const t = pathTFromLeverRatio(leverRatioFromDistance(distance));
  return t <= APPROACH_RATIO
    ? lerp(FAR_POINT.x, APPROACH_POINT.x, t / APPROACH_RATIO)
    : lerp(APPROACH_POINT.x, MOUNTAIN_PEAK.x, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO));
}

// 距離レバーだけで決まる「地形に沿ったy座標」。xForDistanceと同じtを使い、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、という同じ2段階の
// 軌道をyにも描かせる（xとyを別々のtから計算すると、斜面をなぞらずに斜め一直線で
// 山頂へ向かう不自然な動きになってしまうため、xと必ず同じtを使う）。
// 高さの定義変更（2026-08-31）以降、斜面区間では y が表示高さに正比例する
// （高さ0→y=250, 高さ100→y=120＝山頂）。タイプCの比較線はこれをそのまま使う
function terrainY(distance) {
  const t = pathTFromLeverRatio(leverRatioFromDistance(distance));
  return t <= APPROACH_RATIO
    ? lerp(FAR_POINT.y, APPROACH_POINT.y, t / APPROACH_RATIO)
    : lerp(APPROACH_POINT.y, MOUNTAIN_PEAK.y, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO));
}

// ○の見た目の位置。x・yとも距離レバーだけで決まる（terrainYが地形に沿った軌道を
// 描くため、○が山の内部にめり込むことは構造上起こらない）。#air-massはグループ
// なので、cx/cyではなくtransform(translate)で位置を持たせる
function positionAirMass(distance) {
  const x = xForDistance(distance);
  const y = terrainY(distance);
  airMass.setAttribute("transform", `translate(${x},${y})`);
}

let currentHeight = 0;
let currentDistance = MOUNTAIN_INFLUENCE_RADIUS; // 山までの距離（0=山頂、MOUNTAIN_INFLUENCE_RADIUS=影響なし）

function toSvgPoint(svgEl, clientX, clientY) {
  const point = svgEl.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(svgEl.getScreenCTM().inverse());
}

// レバーの配線（pointerのキャプチャ／解放、○のdraggingクラスの付け外し）だけを
// まとめる。ドラッグ中に何の値をどう変えるかは呼び出し側のonStart/onMove/onEndに委ねる。
// 距離レバーは横向き（design.md「設計の経緯（2026-08-27）」レイアウト変更参照）なので
// x座標を渡す
function bindLeverDrag(leverEl, { onStart, onMove, onEnd }) {
  leverEl.addEventListener("pointerdown", (event) => {
    leverEl.setPointerCapture(event.pointerId);
    const svgPoint = toSvgPoint(leverEl, event.clientX, event.clientY);
    onStart(svgPoint.x);
    airMass.classList.add("dragging");
  });
  leverEl.addEventListener("pointermove", (event) => {
    const svgPoint = toSvgPoint(leverEl, event.clientX, event.clientY);
    onMove(svgPoint.x);
  });
  function end(event) {
    if (leverEl.hasPointerCapture(event.pointerId)) {
      leverEl.releasePointerCapture(event.pointerId);
    }
    onEnd();
    airMass.classList.remove("dragging");
  }
  leverEl.addEventListener("pointerup", end);
  leverEl.addEventListener("pointercancel", end);
}

// 距離レバー: 「山までの距離」を操作する。右に動かすほど距離が縮む＝山に近づく
// （○が右へ動くのと同じ向きにして、指の動きと見た目の動きを一致させる）。
// 距離が変わるたびに、山への接近で自動的に決まる高さ(heightFromDistance)へ
// currentHeightを同期させる
let distanceDragStart = null;
bindLeverDrag(distanceLever, {
  onStart: (svgX) => {
    if (distanceLocked) return;
    cancelQuizAnim(); // お題タイプAの出題時の滑走がまだ続いていたら、手で触った時点で止める
    distanceDragStart = { svgX, value: currentDistance, heightBefore: currentHeight };
  },
  onMove: (svgX) => {
    if (distanceLocked) return;
    if (!distanceDragStart) return;
    const deltaX = svgX - distanceDragStart.svgX;
    const deltaDistance = deltaX * (MOUNTAIN_INFLUENCE_RADIUS / LEVER_TRACK_WIDTH);
    currentDistance = clamp(distanceDragStart.value - deltaDistance, 0, MOUNTAIN_INFLUENCE_RADIUS);
    currentHeight = heightFromDistance(currentDistance);
    positionAirMass(currentDistance);
    updateGauges(currentHeight);
    maybeRevealQuizAnswer();
  },
  onEnd: () => {
    if (distanceDragStart) {
      logHeightChange(distanceDragStart.heightBefore, currentHeight);
    }
    distanceDragStart = null;
  },
});

// 水蒸気の量スライダー（マップ外、横向き、距離レバーの直下）の見た目を更新する
function renderVaporLevelControl() {
  const ratio = vaporLevelIndex / (VAPOR_LEVELS.length - 1);
  const x = LEVER_TRACK_X + ratio * LEVER_TRACK_WIDTH;
  vaporLevelFill.setAttribute("width", ratio * LEVER_TRACK_WIDTH);
  vaporLevelHandle.setAttribute("cx", x);
  const level = VAPOR_LEVELS[vaporLevelIndex];
  // スライダー直下の読み上げは段階のラベルだけ（数値はゲージ横に一本化＝
  // 同じ数字を2回描かない。案1。index.htmlのコメント参照）
  vaporLevelLabelEl.textContent = level.label;
  // マップ内のゲージ横は「ラベル＋数値」でまとめて出す。「やや多い＝9.4」の
  // 対応がここで読み取れる（お題モードで予想の根拠になる）
  heldVaporValueEl.textContent = MESSAGES.gaugeHeldVapor(level.label, level.value.toFixed(1));
}

// svgX（横向きスライダーのローカルx座標）から、最も近い段階のインデックスを求める。
// 4段階の離散スライダーなので、距離レバーのような連続値ではなく、常にどれか1つの
// 段階にスナップする
function nearestVaporLevelIndex(svgX) {
  const ratio = clamp((svgX - LEVER_TRACK_X) / LEVER_TRACK_WIDTH, 0, 1);
  return Math.round(ratio * (VAPOR_LEVELS.length - 1));
}

// force: お題モードが問題ごとに水蒸気の量を強制的に切り替えるために使う
// （目的の段階が現在値とたまたま同じでも、確実にrender/updateGaugesさせる）
function setVaporLevel(index, force) {
  const clamped = clamp(index, 0, VAPOR_LEVELS.length - 1);
  if (!force && clamped === vaporLevelIndex) return;
  vaporLevelIndex = clamped;
  currentHeldVapor = VAPOR_LEVELS[vaporLevelIndex].value;
  currentMaxExcess = computeMaxExcess(currentHeldVapor);
  renderVaporLevelControl();
  updateGauges(currentHeight);
}

// 水蒸気の量スライダー: 触れた位置（pointerdown時も含む）に応じて最も近い段階へ
// 即座に切り替わる。高さは変えない。お題モード中は操作不可（quizActive、
// design.md「お題モード」参照。CSS側でもpointer-events:noneにしているが、
// 念のためJS側でも二重にガードする）
let vaporLevelIndexBeforeDrag = null;
bindLeverDrag(vaporLevelLever, {
  onStart: (svgX) => {
    if (quizActive) return;
    vaporLevelIndexBeforeDrag = vaporLevelIndex;
    setVaporLevel(nearestVaporLevelIndex(svgX));
  },
  onMove: (svgX) => {
    if (quizActive) return;
    setVaporLevel(nearestVaporLevelIndex(svgX));
  },
  onEnd: () => {
    if (quizActive) return;
    if (vaporLevelIndexBeforeDrag !== null && vaporLevelIndexBeforeDrag !== vaporLevelIndex) {
      logVaporLevelChange(vaporLevelIndexBeforeDrag, vaporLevelIndex);
    }
    vaporLevelIndexBeforeDrag = null;
  },
});

// お題モード ---------------------------------------------------------------
// 「スライダーを動かすだけ」という弟さんの反応を受けて追加。予想してから
// 確かめる形式にすることで、レバー操作に理由と結果を与える。タイトル画面は
// 作らず、常時表示の「お題に挑戦」ボタンから始める（design.md「お題モード」参照）

function setVaporLevelLocked(locked) {
  vaporLevelPanel.classList.toggle("levers-locked", locked);
}

// お題が出た直後（予想前）は距離レバーも動かせないようにし、先に動かして
// 確かめてから予想する、という抜け道を防ぐ。予想を選んだ時点でロック解除する
function setDistanceLeverLocked(locked) {
  distanceLeverPanel.classList.toggle("levers-locked", locked);
  distanceLocked = locked;
}

function quizChoiceLabel(index) {
  return MESSAGES.quizChoiceLabel(index, QUIZ_CHOICES[index]);
}

function currentQuizQuestion() {
  return quizQuestions[quizQuestionIndex];
}

function isLastQuizQuestion() {
  return quizQuestionIndex === quizQuestions.length - 1;
}

// 出題中の問題タイプに応じた選択肢ラベルの配列
function quizChoiceLabels(q) {
  if (q.type === "A") return QUIZ_CHOICES.map((value, index) => MESSAGES.quizChoiceLabel(index, value));
  if (q.type === "B") return [MESSAGES.quizChoiceCanForm, MESSAGES.quizChoiceCannotForm];
  return [MESSAGES.quizChoiceA, MESSAGES.quizChoiceB];
}

// 選択肢ボタンの描画とヒント／「確かめる」ボタンの出し分けのみを行う（正解発表は
// revealQuizAnswer*）。phaseに応じてボタンの選択状態・disabledを切り替える
function renderQuizQuestion() {
  const q = currentQuizQuestion();
  quizProgressEl.textContent = MESSAGES.quizProgress(quizQuestionIndex + 1, quizQuestions.length);

  if (q.type === "A") {
    const lv = VAPOR_LEVELS[q.vaporLevelIndex];
    quizQuestionEl.textContent = MESSAGES.quizQuestion(lv.label, lv.value.toFixed(1));
  } else if (q.type === "B") {
    const lv = VAPOR_LEVELS[q.vaporLevelIndex];
    const heightWord = QUIZ_TYPE_B_HEIGHT_LABELS[QUIZ_TYPE_B_HEIGHTS.indexOf(q.targetHeight)];
    quizQuestionEl.textContent = MESSAGES.quizQuestionB(lv.label, lv.value.toFixed(1), q.targetHeight, heightWord);
  } else {
    const a = VAPOR_LEVELS[q.aIndex];
    const b = VAPOR_LEVELS[q.bIndex];
    quizQuestionEl.textContent = MESSAGES.quizQuestionC(a.label, a.value.toFixed(1), b.label, b.value.toFixed(1));
  }

  const choosing = quizPhase === "choosing";
  quizChoicesEl.innerHTML = quizChoiceLabels(q)
    .map((label, index) => {
      const selected = quizSelectedChoice === index;
      return `<button type="button" class="quiz-choice-button${selected ? " selected" : ""}" data-index="${index}" ${
        choosing ? "" : "disabled"
      }>${label}</button>`;
    })
    .join("");

  // タイプA は距離レバーを手で動かして確かめる（「確かめる」ボタンは出さない）。
  // タイプB・C は「確かめる」ボタンで自動再生する。予想を選ぶ前もボタンは出すが
  // 無効表示にして「まだ押せない」ことを見た目で示す（選択済みの二択ボタン＝濃紺塗り
  // とは別の淡い見た目にする。実ユーザーの「押せるように見える／色が同じ」への対応）
  const isVerifyType = q.type === "B" || q.type === "C";
  const showVerify = isVerifyType && quizPhase !== "revealed";
  quizVerifyButton.hidden = !showVerify;
  quizVerifyButton.disabled = quizPhase !== "checking";
  if (showVerify) quizVerifyButton.textContent = MESSAGES.quizVerifyButtonLabel;

  quizHintEl.textContent =
    quizPhase === "checking" ? (q.type === "A" ? MESSAGES.quizCheckingHint : MESSAGES.quizVerifyHint) : "";
  quizRevealEl.hidden = true;
}

function selectQuizChoice(index) {
  if (quizPhase !== "choosing") return;
  quizSelectedChoice = index;
  quizPhase = "checking";
  const q = currentQuizQuestion();
  // タイプA だけ距離レバーを解放する。B・C は自動再生なので距離レバーはロックのまま
  if (q.type === "A") setDistanceLeverLocked(false);
  renderQuizQuestion();
  if (q.type === "A") maybeRevealQuizAnswer();
}

quizChoicesEl.addEventListener("click", (event) => {
  const button = event.target.closest(".quiz-choice-button");
  if (!button) return;
  selectQuizChoice(Number(button.dataset.index));
});

quizVerifyButton.addEventListener("click", () => {
  const q = currentQuizQuestion();
  if (q.type === "B") runQuizVerifyB();
  else if (q.type === "C") runQuizVerifyC();
});

// 距離レバーをドラッグするたびに呼ばれ、タイプA で「予想を選択済み・まだ答え合わせ
// していない」状態で雲が現れた瞬間だけ答え合わせを表示する（B・C は自動再生側で
// 判定するのでここでは扱わない）
function maybeRevealQuizAnswer() {
  const q = quizQuestions[quizQuestionIndex];
  if (quizActive && q && q.type === "A" && quizPhase === "checking" && lastCloudVisible) {
    revealQuizAnswer();
  }
}

// --- 自動再生（タイプB・C の「確かめる」） -------------------------------------
// 目標の高さまで、距離レバーを手で動かすのと同じ経路で自動的に上げる。毎フレーム
// positionAirMass + updateGauges を呼ぶだけなので、雲の出現・「ここで雲ができた！」
// フラッシュ・雲の弾み・ゲージの斜線などの既存の仕組みがそのまま働く。
// recordOnset:true のときは、雲が最初に見えたフレームの高さ(onsetHeight)を記録する
// （タイプCで「どの高さで雲になったか」を実測から得るため）。
const QUIZ_ANIM_B_MS = 1100; // タイプB: 0→目標高さ
const QUIZ_ANIM_C_MS = 1500; // タイプC: 0→表示高さ95相当（雲ができる高さで通り過ぎる）
const QUIZ_ANIM_C_PAUSE_MS = 900; // タイプC: A の結果を見せてから B を始めるまでの間
const QUIZ_ANIM_C_TOP = (95 / HEIGHT_DISPLAY_SCALE) * MOUNTAIN_MAX_HEIGHT;

let quizAnimFrame = null;
let quizAnimTimer = null;
let quizGlideFrame = null; // 出題時の「遠方→ふもと」水平滑走（下記 glideAirMassToFoot）

function cancelQuizAnim() {
  if (quizAnimFrame !== null) {
    cancelAnimationFrame(quizAnimFrame);
    quizAnimFrame = null;
  }
  if (quizGlideFrame !== null) {
    cancelAnimationFrame(quizGlideFrame);
    quizGlideFrame = null;
  }
  if (quizAnimTimer !== null) {
    clearTimeout(quizAnimTimer);
    quizAnimTimer = null;
  }
  airMass.classList.remove("dragging");
}

// お題出題時、○を遠方(far)からふもと(高さ0の位置)まで**高さ0のまま水平に**滑らせる。
// 「空気が山に向かって流れてきた」という毎問の導入で、開発者が気に入っていた水平移動
// の見た目を残すため（2026-08-31の「高さ0=ふもと」化で消えていた）。
// 高さは0のままなので heightFromDistance が接近区間で0を返す＝この間 気温・ゲージ・
// 雲・変化ログは動かない（updateGauges(0) は静止画。レバーのつまみ位置だけ○に同期）。
// 「確かめる」を押す頃には滑走は終わっているので、自動再生（animateHeightTo）の
// 所要時間は増えない。滑走中に押された場合は runQuizVerify* 冒頭で cancelQuizAnim +
// ふもとにスナップして受け止める
const QUIZ_GLIDE_MS = 700;

function glideAirMassToFoot() {
  cancelQuizAnim();
  const fromDist = currentDistance; // 呼び出し側が遠方(MOUNTAIN_INFLUENCE_RADIUS)に置いている前提
  const toDist = distanceForHeight(0);
  const startTime = performance.now();
  currentHeight = 0;
  airMass.classList.add("dragging"); // トランジションを切って毎フレーム1:1で動かす
  function tick(now) {
    const t = Math.min(1, (now - startTime) / QUIZ_GLIDE_MS);
    currentDistance = fromDist + (toDist - fromDist) * t;
    positionAirMass(currentDistance);
    updateGauges(0); // 高さ0固定＝静止だが、レバーのつまみを○に同期させる
    if (t >= 1) {
      airMass.classList.remove("dragging");
      quizGlideFrame = null;
      return;
    }
    quizGlideFrame = requestAnimationFrame(tick);
  }
  quizGlideFrame = requestAnimationFrame(tick);
}

function animateHeightTo(from, to, duration, { recordOnset = false, onDone } = {}) {
  cancelQuizAnim();
  const startTime = performance.now();
  let onsetHeight = null;
  airMass.classList.add("dragging"); // トランジションを切って毎フレーム1:1で動かす
  function tick(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const height = from + (to - from) * t; // 等速（レバーを一定の速さで動かすのと同じ）
    currentHeight = height;
    currentDistance = distanceForHeight(height);
    positionAirMass(currentDistance);
    updateGauges(currentHeight);
    if (recordOnset && onsetHeight === null && lastCloudVisible) {
      onsetHeight = currentHeight;
    }
    if (t >= 1) {
      airMass.classList.remove("dragging");
      quizAnimFrame = null;
      if (onDone) onDone({ endHeight: currentHeight, onsetHeight, cloud: lastCloudVisible });
      return;
    }
    quizAnimFrame = requestAnimationFrame(tick);
  }
  quizAnimFrame = requestAnimationFrame(tick);
}

// タイプC の比較線（雲になった高さに水平の破線を残す）。線が下にある方＝低い高さで
// 雲になった方（学習目標⑤を数字なしで伝える）。
// 高さの定義変更（2026-08-31）前は、terrainY が接近区間で y=250 のまま平坦だったため
// 低い高さ同士だと線が重なってしまい、表示高さ比例の専用スケール（QUIZ_CMP_Y_TOP=128）
// を別に持っていた。定義変更後は terrainY 自体が表示高さに正比例する（高さ0→250、
// 高さ100→120＝山頂）ので、**○の実際の位置をそのまま線の高さに使える**。
// 例外がひとつ消え、「線＝○が実際にいた高さ」になった
function quizCmpLineY(internalHeight) {
  return terrainY(distanceForHeight(internalHeight));
}

function drawQuizCmpLine(lineEl, labelEl, internalHeight) {
  const y = quizCmpLineY(internalHeight);
  lineEl.setAttribute("y1", y);
  lineEl.setAttribute("y2", y);
  // ラベルは線の左端に寄り添わせる（+4 で線の高さにほぼ揃う）
  labelEl.setAttribute("y", y + 4);
}

// タイプC の自動再生中、いまA・Bどちらを上げているかを表示（先にAが上がることを
// 分かりやすくする）
function showQuizCmpNow(which) {
  quizCmpNowEl.textContent = MESSAGES.quizCmpNowPlaying(which);
  quizCmpNowEl.setAttribute("opacity", "1");
}

function resetQuizCmpLines() {
  quizCmpLinesEl.setAttribute("opacity", "0");
  quizCmpLineB.setAttribute("opacity", "0");
  quizCmpLabelB.setAttribute("opacity", "0");
  quizCmpNowEl.setAttribute("opacity", "0");
}

// お題の「高さの目安」。渡された表示高さ(0-100)の配列それぞれについて、○の通り道の
// どこに当たるかを 小さな目印（circle）＋数字（text）で示す。位置は xForDistance /
// terrainY で○の実際の軌道の上に置くので、○がドラッグ／自動再生で動くとその目印を
// 通っていく（タイプBでは自動再生が目標高さちょうどで止まるので、目印が「ゴール
// ライン」になり○がそこにピタリと合う）。
//  タイプA → QUIZ_CHOICES の4つ（10/25/50/75）
//  タイプB → 目標高さ1つ
//  タイプC → なし（空配列を渡すと消える）
// 高さの定義変更（2026-08-31）以降、目印は斜面の上に、表示高さに正比例して並ぶ。
// 数字は**目印の左（空の側）**に置く: 目印は斜面の上に乗るので、真上に置くと山
// （濃紺）と重なって読みにくい。左に逃がすと必ず空の上に来る。タイプCの比較線とは
// 形（小さなリング）と位置（斜めの通り道の上）で区別できる
function renderQuizHeightGuide(values) {
  quizHeightGuideEl.textContent = ""; // 前問ぶんをクリア
  const svgNs = "http://www.w3.org/2000/svg";
  for (const value of values) {
    const distance = distanceForHeight((value / HEIGHT_DISPLAY_SCALE) * MOUNTAIN_MAX_HEIGHT);
    const mx = xForDistance(distance);
    const my = terrainY(distance);

    const mark = document.createElementNS(svgNs, "circle");
    mark.setAttribute("class", "quiz-height-mark");
    mark.setAttribute("cx", mx);
    mark.setAttribute("cy", my);
    mark.setAttribute("r", "3.2");

    const num = document.createElementNS(svgNs, "text");
    num.setAttribute("class", "quiz-height-num");
    num.setAttribute("x", mx - 7);
    num.setAttribute("y", my + 3); // 目印の高さに揃える（font 9pxの視覚中心）
    num.setAttribute("text-anchor", "end");
    num.textContent = value;

    quizHeightGuideEl.appendChild(mark);
    quizHeightGuideEl.appendChild(num);
  }
  quizHeightGuideEl.setAttribute("opacity", values.length > 0 ? "1" : "0");
}

function runQuizVerifyB() {
  const q = currentQuizQuestion();
  cancelQuizAnim(); // 出題時の滑走がまだ続いていたら止める
  quizVerifyButton.hidden = true;
  quizVerifyButton.disabled = true;
  quizHintEl.textContent = "";
  // ふもとにスナップしてから上昇（滑走中に「確かめる」を押された場合の受け止め）
  currentHeight = 0;
  currentDistance = distanceForHeight(0);
  positionAirMass(currentDistance);
  const targetInternal = (q.targetHeight / HEIGHT_DISPLAY_SCALE) * MOUNTAIN_MAX_HEIGHT;
  animateHeightTo(0, targetInternal, QUIZ_ANIM_B_MS, {
    recordOnset: true,
    onDone: (result) => {
      // 変化ログはアニメ終了時に1回だけ（毎フレーム呼ぶとログが溢れる）
      logHeightChange(0, targetInternal);
      // 目標より手前で雲ができていたら、実際にできた表示高さを解説に使う
      const onsetDisplayHeight =
        result.onsetHeight !== null
          ? Math.round((result.onsetHeight / MOUNTAIN_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE)
          : null;
      revealQuizAnswerB(onsetDisplayHeight);
    },
  });
}

function runQuizVerifyC() {
  const q = currentQuizQuestion();
  cancelQuizAnim(); // 出題時の滑走がまだ続いていたら止める
  quizVerifyButton.hidden = true;
  quizVerifyButton.disabled = true;
  quizHintEl.textContent = "";
  resetQuizCmpLines();
  quizCmpLinesEl.setAttribute("opacity", "1");

  // A を再生（1問目=aIndex側）。「A を上げています」を先に出す
  showQuizCmpNow("A");
  setVaporLevel(q.aIndex, true);
  currentHeight = 0;
  currentDistance = distanceForHeight(0);
  positionAirMass(currentDistance);
  updateGauges(0);
  animateHeightTo(0, QUIZ_ANIM_C_TOP, QUIZ_ANIM_C_MS, {
    recordOnset: true,
    onDone: (aResult) => {
      const aOnset = aResult.onsetHeight !== null ? aResult.onsetHeight : aResult.endHeight;
      drawQuizCmpLine(quizCmpLineA, quizCmpLabelA, aOnset);
      logHeightChange(0, aOnset);
      // A の結果を少し見せてから、無言でリセットして B を再生（AとBの間の
      // リセットはログを出さない）
      quizAnimTimer = setTimeout(() => {
        quizAnimTimer = null;
        if (!quizActive) return;
        // 無言リセットは一瞬で（dragging クラスでトランジションを切る。○が
        // 表示95からゆっくり落ちて見えないように）
        airMass.classList.add("dragging");
        currentHeight = 0;
        currentDistance = distanceForHeight(0);
        setVaporLevel(q.bIndex, true); // これが updateGauges(0) を呼ぶ＝雲が消え lastCloudVisible=false
        positionAirMass(currentDistance);
        showQuizCmpNow("B"); // 表示を「B を上げています」に切り替え
        animateHeightTo(0, QUIZ_ANIM_C_TOP, QUIZ_ANIM_C_MS, {
          recordOnset: true,
          onDone: (bResult) => {
            const bOnset = bResult.onsetHeight !== null ? bResult.onsetHeight : bResult.endHeight;
            quizCmpNowEl.setAttribute("opacity", "0"); // 再生終了＝「○ を上げています」を消す
            quizCmpLineB.setAttribute("opacity", "1");
            quizCmpLabelB.setAttribute("opacity", "1");
            drawQuizCmpLine(quizCmpLineB, quizCmpLabelB, bOnset);
            logHeightChange(0, bOnset);
            revealQuizAnswerC(aOnset, bOnset);
          },
        });
      }, QUIZ_ANIM_C_PAUSE_MS);
    },
  });
}

function pushQuizResultAndFinish(result, revealText, guessLabel) {
  quizResults.push(result);
  quizYourGuessEl.textContent = MESSAGES.quizYourGuess(guessLabel);
  quizRevealTextEl.textContent = (result.matched ? `${MESSAGES.quizRevealMatched} ` : "") + revealText;
  quizNextButton.textContent = isLastQuizQuestion() ? MESSAGES.quizFinishButtonLabel : MESSAGES.quizNextButtonLabel;
  quizRevealEl.hidden = false;
}

function revealQuizAnswer() {
  quizPhase = "revealed";
  const question = currentQuizQuestion();
  const level = VAPOR_LEVELS[question.vaporLevelIndex];
  const measuredHeight = Math.round((currentHeight / MOUNTAIN_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE);
  // 選択肢は「◯◯くらい」という近似値なので、実測値に最も近い選択肢を「実際」とする。
  // 生徒に見せる数値（解説・まとめ表）は必ずこの選択肢の値に揃える（実測9でも10と表示）
  const nearestChoiceIndex = QUIZ_CHOICES.reduce(
    (best, value, index) =>
      Math.abs(value - measuredHeight) < Math.abs(QUIZ_CHOICES[best] - measuredHeight) ? index : best,
    0
  );
  const actualValue = QUIZ_CHOICES[nearestChoiceIndex];
  const guessValue = QUIZ_CHOICES[quizSelectedChoice];
  const matched = quizSelectedChoice === nearestChoiceIndex;
  pushQuizResultAndFinish(
    { type: "A", level, guessValue, actualValue, matched },
    MESSAGES.quizRevealText(actualValue, level.value.toFixed(1)),
    quizChoiceLabel(quizSelectedChoice)
  );
}

function revealQuizAnswerB(onsetDisplayHeight) {
  quizPhase = "revealed";
  const q = currentQuizQuestion();
  const lv = VAPOR_LEVELS[q.vaporLevelIndex];
  const canForm = lastCloudVisible; // 自動再生の結果として雲が出たか（ハードコードしない）
  const guessCanForm = quizSelectedChoice === 0;
  const matched = guessCanForm === canForm;
  pushQuizResultAndFinish(
    { type: "B", label: lv.label, value: lv.value, targetHeight: q.targetHeight, guess: guessCanForm, actual: canForm, matched },
    MESSAGES.quizRevealTextB(lv.label, lv.value.toFixed(1), q.targetHeight, canForm, onsetDisplayHeight),
    guessCanForm ? MESSAGES.quizChoiceCanForm : MESSAGES.quizChoiceCannotForm
  );
}

function revealQuizAnswerC(aOnset, bOnset) {
  quizPhase = "revealed";
  const q = currentQuizQuestion();
  const a = VAPOR_LEVELS[q.aIndex];
  const b = VAPOR_LEVELS[q.bIndex];
  // 自動再生で実際に雲になった高さ同士を比較（ハードコードしない）
  const winnerIsA = aOnset < bOnset;
  const actual = winnerIsA ? "A" : "B";
  const winnerLevel = winnerIsA ? a : b;
  const guess = quizSelectedChoice === 0 ? "A" : "B";
  const matched = guess === actual;
  pushQuizResultAndFinish(
    {
      type: "C",
      aLabel: a.label,
      aValue: a.value,
      bLabel: b.label,
      bValue: b.value,
      guess,
      actual,
      matched,
    },
    MESSAGES.quizRevealTextC(actual, winnerLevel.label),
    guess
  );
}

// 問題ごとに、水蒸気の量を強制的に切り替え、○を遠方に置いてから出題する。
// 既に雲が出ている状態から始まると「動かさなくても答え合わせが出る」ことに
// なってしまうため、必ず高さ0から始める。○は出題直後に遠方→ふもとへ水平に
// 滑る（glideAirMassToFoot。3タイプとも見た目の初期位置は遠方で揃う）
function startQuizQuestion() {
  cancelQuizAnim();
  resetQuizCmpLines();
  const q = currentQuizQuestion();
  // 高さの目安: タイプA=選択肢4つ / タイプB=目標高さ1つ / タイプC=なし
  renderQuizHeightGuide(q.type === "A" ? QUIZ_CHOICES : q.type === "B" ? [q.targetHeight] : []);
  // タイプC は最初に A 側の段階をゲージに出しておく（予想の手がかり）
  const initialLevelIndex = q.type === "C" ? q.aIndex : q.vaporLevelIndex;
  currentHeight = 0;
  currentDistance = MOUNTAIN_INFLUENCE_RADIUS; // 遠方から。この後 glide で高さ0のままふもとへ
  airMass.classList.add("dragging"); // 遠方への配置は一瞬で（トランジションを切る。glide が引き継ぐ）
  setVaporLevel(initialLevelIndex, true); // updateGauges(0) を呼ぶ
  positionAirMass(currentDistance);
  quizPhase = "choosing";
  quizSelectedChoice = null;
  setDistanceLeverLocked(true);
  renderQuizQuestion(); // 「確かめる」ボタンの表示・有効/無効はここで決まる（タイプA=非表示、B/C予想前=無効表示）
  glideAirMassToFoot(); // ○を遠方→ふもとへ 700ms（高さ0のまま。「空気が山に流れてきた」導入）
}

function startQuiz() {
  quizActive = true;
  quizQuestions = buildQuizQuestions();
  quizQuestionIndex = 0;
  quizResults = [];
  quizStartButton.hidden = true;
  quizPanel.hidden = false;
  quizSummaryEl.hidden = true;
  // お題中はスマホでサブタイトル・ツールバーを隠し、お題パネルを縦に圧縮する
  // （375pxでゲージ・距離レバー・水蒸気の量スライダーが1画面に収まらなくなるため。
  //  スタイルはstyle.cssの @media (max-width:700px) 側で body.quiz-mode を見て切り替える。
  //  PC表示は一切変えない）
  document.body.classList.add("quiz-mode");
  setVaporLevelLocked(true);
  startQuizQuestion();
}

function goToNextQuizStep() {
  if (quizQuestionIndex < quizQuestions.length - 1) {
    quizQuestionIndex += 1;
    startQuizQuestion();
  } else {
    showQuizSummary();
  }
}

// まとめ表: 予想と実際を出題順に並べる。「正解/不正解」は出さず、見比べれば
// どこがずれたか分かる形にする（design.md参照）。タイプが混在するため、1列目の
// 問題は書式をタイプごとに変え、狭い画面では短縮形に差し替える（q-full/q-short）
function quizSummaryRow(r) {
  let full;
  let short;
  let guess;
  let actual;
  if (r.type === "A") {
    full = MESSAGES.quizSummaryAirCell(r.level.label, r.level.value.toFixed(1));
    short = full;
    guess = r.guessValue;
    actual = r.actualValue;
  } else if (r.type === "B") {
    full = MESSAGES.quizSummaryCellB(r.label, r.value.toFixed(1), r.targetHeight);
    short = MESSAGES.quizSummaryCellBShort(r.label, r.targetHeight);
    guess = r.guess ? MESSAGES.quizChoiceCanForm : MESSAGES.quizChoiceCannotForm;
    actual = r.actual ? MESSAGES.quizChoiceCanForm : MESSAGES.quizChoiceCannotForm;
  } else {
    full = MESSAGES.quizSummaryCellC(r.aLabel, r.aValue.toFixed(1), r.bLabel, r.bValue.toFixed(1));
    short = MESSAGES.quizSummaryCellCShort(r.aLabel, r.bLabel);
    guess = r.guess;
    actual = r.actual;
  }
  return (
    `<tr><th scope="row"><span class="q-full">${full}</span><span class="q-short">${short}</span></th>` +
    `<td>${guess}</td><td>${actual}</td></tr>`
  );
}

function showQuizSummary() {
  cancelQuizAnim();
  resetQuizCmpLines();
  renderQuizHeightGuide([]);
  quizPanel.hidden = true;
  quizSummaryEl.hidden = false;
  quizSummaryTitleEl.textContent = MESSAGES.quizSummaryTitle;
  quizSummaryConclusionEl.textContent = MESSAGES.quizSummaryConclusion;
  quizSummaryResultsHeadingEl.textContent = MESSAGES.quizSummaryResultsHeading;
  const bodyRows = quizResults.map(quizSummaryRow).join("");
  quizSummaryTableWrap.innerHTML =
    `<table class="quiz-summary-table"><thead><tr>` +
    `<th scope="col">${MESSAGES.quizSummaryHeadQuestion}</th>` +
    `<th scope="col">${MESSAGES.quizSummaryHeadGuess}</th>` +
    `<th scope="col">${MESSAGES.quizSummaryHeadActual}</th>` +
    `</tr></thead><tbody>${bodyRows}</tbody></table>`;
  quizSummaryTermEl.textContent = MESSAGES.quizSummaryTerm;
}

function exitQuiz() {
  cancelQuizAnim();
  resetQuizCmpLines();
  renderQuizHeightGuide([]);
  quizVerifyButton.hidden = true;
  quizActive = false;
  quizStartButton.hidden = false;
  quizPanel.hidden = true;
  quizSummaryEl.hidden = true;
  // サブタイトル・ツールバーを元通り表示に戻す
  document.body.classList.remove("quiz-mode");
  setVaporLevelLocked(false);
  setDistanceLeverLocked(false);
}

quizStartButton.addEventListener("click", startQuiz);
quizExitButton.addEventListener("click", exitQuiz);
quizNextButton.addEventListener("click", goToNextQuizStep);
quizRestartButton.addEventListener("click", startQuiz);
quizSummaryExitButton.addEventListener("click", exitQuiz);

quizStartButton.textContent = MESSAGES.quizStartButtonLabel;
quizExitButton.textContent = MESSAGES.quizExitButtonLabel;
quizSummaryExitButton.textContent = MESSAGES.quizExitButtonLabel;
quizRestartButton.textContent = MESSAGES.quizRestartButtonLabel;

function renderLegend() {
  legendEl.innerHTML = `
    <p class="legend-title">${MESSAGES.legendTitle}</p>
    <ul>
      <li>${MESSAGES.legendAirMass}</li>
      <li>${MESSAGES.legendMountain}</li>
      <li>${MESSAGES.legendDistanceLever}</li>
      <li>${MESSAGES.legendVaporLevel}</li>
      <li>${MESSAGES.legendVaporGauge}</li>
    </ul>
  `;
}

renderLegend();

// キャプション・aria-labelは固定文言なので初期化時に一度だけ設定する
distanceLeverCaptionEl.textContent = MESSAGES.leverCaptionDistance;
distanceLever.setAttribute("aria-label", MESSAGES.leverAriaDistance);
vaporLevelCaptionEl.textContent = MESSAGES.leverCaptionVapor;
vaporLevelLever.setAttribute("aria-label", MESSAGES.leverAriaVapor);
cloudFlashMainEl.textContent = MESSAGES.cloudFlash;
cloudFlashSubEl.textContent = MESSAGES.cloudFlashSub;
// 高さの目安はお題の問題ごとに renderQuizHeightGuide(values) で作り直す（init不要）

positionAirMass(currentDistance);
renderVaporLevelControl();
updateGauges(currentHeight);

// チュートリアル（初回起動時のみ、今のシーンに吹き出しを重ねるだけで別画面には遷移しない）
const TUTORIAL_STORAGE_KEY = "weather-app-tutorial-seen";

// target が null のステップ（アプリの目的の説明など、画面上に対応する要素がない話）は
// 吹き出しを画面中央に出す。目的→背景の理科→操作→変化ログ、の順で誘導する
const TUTORIAL_STEPS = [
  { target: null, text: MESSAGES.tutorialStep1 },
  { target: mapEl, text: MESSAGES.tutorialStep2 },
  { target: distanceLever, text: MESSAGES.tutorialStep3 },
  { target: changeLogEl, text: MESSAGES.tutorialStep4 },
];

let tutorialStepIndex = 0;
let tutorialHighlightedEl = null;
tutorialSkipButton.textContent = MESSAGES.tutorialSkip;

function positionTutorialBubble(target) {
  const bubbleWidth = tutorialBubble.offsetWidth;
  const bubbleHeight = tutorialBubble.offsetHeight;

  // 対応する要素がないステップは画面中央に出す（狭い画面でもはみ出さないよう
  // clampは下限12pxだけかける）
  if (!target) {
    tutorialBubble.style.left = `${clamp((window.innerWidth - bubbleWidth) / 2, 12, window.innerWidth - bubbleWidth - 12)}px`;
    tutorialBubble.style.top = `${clamp((window.innerHeight - bubbleHeight) / 2, 12, window.innerHeight - bubbleHeight - 12)}px`;
    return;
  }

  const rect = target.getBoundingClientRect();
  let left = clamp(rect.left, 12, window.innerWidth - bubbleWidth - 12);
  let top = rect.bottom + 12;
  if (top + bubbleHeight > window.innerHeight - 12) {
    top = rect.top - bubbleHeight - 12; // 下に入らなければ上に出す
  }
  top = clamp(top, 12, window.innerHeight - bubbleHeight - 12);

  tutorialBubble.style.left = `${left}px`;
  tutorialBubble.style.top = `${top}px`;
}

function showTutorialStep(index) {
  if (tutorialHighlightedEl) {
    tutorialHighlightedEl.classList.remove("tutorial-highlight");
    tutorialHighlightedEl = null;
  }
  const step = TUTORIAL_STEPS[index];
  if (step.target) {
    tutorialHighlightedEl = step.target;
    tutorialHighlightedEl.classList.add("tutorial-highlight");
  }
  tutorialTextEl.textContent = step.text;
  tutorialStepLabelEl.textContent = MESSAGES.tutorialStepLabel(index + 1, TUTORIAL_STEPS.length);
  tutorialNextButton.textContent =
    index === TUTORIAL_STEPS.length - 1 ? MESSAGES.tutorialFinish : MESSAGES.tutorialNext;
  positionTutorialBubble(step.target);
}

function endTutorial() {
  if (tutorialHighlightedEl) {
    tutorialHighlightedEl.classList.remove("tutorial-highlight");
  }
  tutorialOverlay.hidden = true;
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
  } catch (error) {
    // localStorageが使えない環境でも致命的にならないよう無視する
  }
}

function startTutorial() {
  tutorialStepIndex = 0;
  tutorialOverlay.hidden = false;
  showTutorialStep(tutorialStepIndex);
}

tutorialNextButton.addEventListener("click", () => {
  tutorialStepIndex += 1;
  if (tutorialStepIndex >= TUTORIAL_STEPS.length) {
    endTutorial();
  } else {
    showTutorialStep(tutorialStepIndex);
  }
});

tutorialSkipButton.addEventListener("click", endTutorial);
tutorialReplayButton.addEventListener("click", startTutorial);
tutorialReplayButton.textContent = MESSAGES.tutorialReplay;

window.addEventListener("resize", () => {
  if (!tutorialOverlay.hidden) {
    positionTutorialBubble(TUTORIAL_STEPS[tutorialStepIndex].target);
  }
});

let tutorialAlreadySeen = false;
try {
  tutorialAlreadySeen = localStorage.getItem(TUTORIAL_STORAGE_KEY) === "1";
} catch (error) {
  tutorialAlreadySeen = false;
}
if (!tutorialAlreadySeen) {
  startTutorial();
}
