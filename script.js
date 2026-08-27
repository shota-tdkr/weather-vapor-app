const airMass = document.getElementById("air-mass");
const airMassCloud = document.getElementById("air-mass-cloud");
const tempValueEl = document.getElementById("temp-value");
const tempStripFill = document.getElementById("temp-strip-fill");
const heightValueEl = document.getElementById("height-value");
const vaporFill = document.getElementById("vapor-fill");
const vaporExcessBand = document.getElementById("vapor-excess-band");
const vaporCapLine = document.getElementById("vapor-cap-line");
const vaporCapLabel = document.getElementById("vapor-cap-label");
const excessValueEl = document.getElementById("excess-value");
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
const vaporLevelValueEl = document.getElementById("vapor-level-value");
const liftArrows = Array.from(document.querySelectorAll(".lift-arrow"));
const LIFT_ARROW_OFFSETS = [
  [0, 34],
  [-14, 42],
  [14, 42],
];
const changeLogList = document.getElementById("change-log-list");
const changeLogEl = document.getElementById("change-log");
const mapEl = document.getElementById("map");
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
const quizRevealEl = document.getElementById("quiz-reveal");
const quizYourGuessEl = document.getElementById("quiz-your-guess");
const quizRevealTextEl = document.getElementById("quiz-reveal-text");
const quizNextButton = document.getElementById("quiz-next-button");
const quizSummaryEl = document.getElementById("quiz-summary");
const quizSummaryTitleEl = document.getElementById("quiz-summary-title");
const quizSummaryListEl = document.getElementById("quiz-summary-list");
const quizSummaryConclusionEl = document.getElementById("quiz-summary-conclusion");
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
  legendMountain: "▲ = 山。距離レバーで○を近づけるほど、高さも自動で上がります。",
  legendDistanceLever: "マップ下の横向きのレバー: 右へ動かすほど山に近づき、高さも自動で上がります。",
  legendVaporLevel:
    "マップ下のもう1本のレバー: 水蒸気の量を4段階（少ない/やや少ない/やや多い/多い）で切り替えます。水蒸気の量が多いほど、低い高さで雲ができます。",
  legendVaporGauge:
    "マップ内の水蒸気ゲージ: 塗り＝水蒸気の量（高さを変えても変わりません。下のレバーで切り替えられます）、点線＝飽和水蒸気量（気温が下がると降りてきます）。点線が塗りより下に来た分を、白抜き＋輪郭線で「あふれ」として示します。",
  // 「○が白く曇る＝雲ができる様子」という凡例は2026-08-27に削除した。○自体を
  // もくもくした雲の形に変化させる表現に変えたことで、注釈なしで雲だと伝わる
  // ようになったため（design.md参照）
  // 変化ログ（因果を段階表示するテキスト）。数値を埋め込むため関数にしているが、
  // 文言はすべてここに集約する（コード中に日本語を散らさない）
  changeLogTitle: "変化ログ",
  logLifted: "空気の塊を持ち上げました",
  logLowered: "空気の塊を下ろしました",
  logTempDrop: (from, to) => `→ 気温が${from}℃から${to}℃に下がりました`,
  logTempRise: (from, to) => `→ 気温が${from}℃から${to}℃に上がりました`,
  logCapacityDrop: (from, to) => `→ 抱えられる水蒸気の量が${from}g/m³から${to}g/m³に減りました`,
  logCapacityRise: (from, to) => `→ 抱えられる水蒸気の量が${from}g/m³から${to}g/m³に増えました`,
  // コップ撤去にともない、あふれ量の増減も「雲」の言葉だけで語る（同じ事象を
  // 2つの表現で2回言わない。design.md「端の小道具：汗をかくコップ」参照）
  logExcessMore: "→ あふれた水蒸気の量が増えました",
  logExcessLess: "→ あふれた水蒸気の量が減りました",
  logExcessStillRoom: "→ まだ水蒸気を抱えられるので、あふれていません",
  logCloudStart: "→ 水蒸気を抱えきれなくなり、雲ができました",
  logCloudEnd: "→ 水蒸気の量が抱えられる量を下回り、雲が消えました",
  // 水蒸気の量スライダーを切り替えたときの変化ログ。高さは変えていないので、
  // 気温・抱えられる量（飽和水蒸気量）は変化しない。変わるのは水蒸気の量自体と、
  // それに応じたあふれ量だけ
  logVaporLevelChanged: (beforeLabel, afterLabel, beforeValue, afterValue) =>
    `水蒸気の量を「${beforeLabel}」(${beforeValue}g/m³)から「${afterLabel}」(${afterValue}g/m³)に変えました`,
  // あふれ量が最大に達したときだけの一言。「雲ができる=雨が降る」という誤った
  // 因果を避けるため、雨を降らせる演出は追加せず、条件付きの説明に留める
  logRainHint: "→ さらに条件が重なると、雲の粒が成長して雨になります",
  // チュートリアル（初回起動時のみ、吹き出しガイド）。前提知識（飽和水蒸気量）
  // のない人が「なんで雲が急に出てきたの?」となるため、身近な結露を導入にして
  // 「空気は冷えると水をかかえきれなくなる」を式を使わずに先に伝える
  // （design.md「チュートリアル」参照）
  tutorialStepLabel: (current, total) => `${current} / ${total}`,
  tutorialStep1:
    "冷たいコップの外側につく水のつぶは、まわりの空気が冷やされて、かかえきれない水分がしずくになったものだよ。",
  tutorialStep2:
    "同じことが空の上でも起きているよ。持ち上げられた空気は冷えて、かかえきれない水分がつぶになる。これが雲だよ。",
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
  quizQuestion: "この空気は、どのくらい上げると雲ができるだろう？",
  quizChoiceLabel: (index, value) => `${["①", "②", "③", "④"][index]}${value}くらい`,
  quizCheckingHint: "距離レバーを動かして、実際に確かめてみよう",
  quizYourGuess: (label) => `あなたの予想: ${label}`,
  quizRevealMatched: "予想どおりでした！",
  quizRevealText: (actual, heldVapor) =>
    `実際は${actual}くらいでした。この空気は水蒸気を${heldVapor}g/m³ふくんでいるので、${actual}まで上げると抱えきれなくなります。`,
  quizNextButtonLabel: "次の問題へ",
  quizFinishButtonLabel: "まとめを見る",
  quizSummaryTitle: "4問終わりました",
  quizSummaryRow: (label, value, actual) => `水蒸気の量が${label}（${value} g/m³）→ ${actual}くらいで雲ができた`,
  quizSummaryConclusion:
    "同じ山でも、空気にふくまれる水蒸気の量が違うと、雲ができる高さが変わりましたね。",
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

// お題モード: 水蒸気の量の4段階それぞれで1問ずつ、計4問。いきなり極端な値
// (少ない/多い)から始めず、標準的なもの(やや多い)から入ってばらつかせる順番
// にしている（design.md「お題モード」参照）。正解の高さはハードコードせず、
// 実際に雲ができた瞬間のcurrentHeightから毎回算出する（モデルの定数を
// 変更しても答えがズレない）
const QUIZ_QUESTIONS = [
  { vaporLevelIndex: 2 }, // やや多い(9.4) → 25くらい
  { vaporLevelIndex: 0 }, // 少ない(4.8) → 75くらい
  { vaporLevelIndex: 3 }, // 多い(11.6) → 9くらい
  { vaporLevelIndex: 1 }, // やや少ない(6.8) → 50くらい
];
const QUIZ_CHOICES = [10, 25, 50, 75];

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

// 水蒸気ゲージ（マップ内、<g transform>でオフセットするローカル座標系）のトラック寸法
const VAPOR_TRACK_TOP = 0;
const VAPOR_TRACK_HEIGHT = 210;

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
  tempValueEl.textContent = temp.toFixed(1);

  // 気温の横帯（情報パネル内、従属表示）
  const tempRatio = clamp((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN), 0, 1);
  tempStripFill.setAttribute("width", tempRatio * TEMP_STRIP_WIDTH);

  // 水蒸気ゲージ（反転済み）: 塗り＝水蒸気の量（currentHeldVapor。高さを変えても
  // 動かないが、水蒸気の量スライダーで段階的に変えられる）
  const heldTopY = verticalFillTopY(currentHeldVapor / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporFill.setAttribute("y", heldTopY);
  vaporFill.setAttribute("height", VAPOR_TRACK_TOP + VAPOR_TRACK_HEIGHT - heldTopY);

  // 線＝飽和水蒸気量。気温が下がるほどcapacityが減り、線(y)はトラック下端へ降りてくる
  const capLineY = verticalFillTopY(capacity / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporCapLine.setAttribute("y1", capLineY);
  vaporCapLine.setAttribute("y2", capLineY);
  vaporCapLabel.setAttribute("y", capLineY + 3);

  // あふれ帯: 線が塗りの上端より下に来た分（＝水蒸気の量のうち抱えきれない部分）を
  // 白抜き＋輪郭線で示す。○が白く曇る雲の表現と同じ視覚言語にすることで、
  // 「白い＝あふれた分＝雲になるもの」という一貫性を作る（design.md参照）
  const excess = Math.max(0, currentHeldVapor - capacity);
  const excessBandHeight = Math.max(0, capLineY - heldTopY);
  vaporExcessBand.setAttribute("y", heldTopY);
  vaporExcessBand.setAttribute("height", excessBandHeight);
  excessValueEl.textContent = excess.toFixed(1);

  // 距離レバー（マップ外、横向き）の見た目は、距離自身の可動域
  // (0〜MOUNTAIN_INFLUENCE_RADIUS)を基準に正規化する（距離が0＝山頂に近いほど
  // 右へ、比率は反転させる）
  const distanceRatio = 1 - clamp(currentDistance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1);
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
  lastCloudVisible = visibleStepCount > 0;
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

// 全体の移動距離のうち「水平に流れてくる区間」が占める割合。
// 見た目の速さが区間の境目で急変しないよう、距離の比で区切る
const APPROACH_DISTANCE = Math.hypot(APPROACH_POINT.x - FAR_POINT.x, APPROACH_POINT.y - FAR_POINT.y);
const CLIMB_DISTANCE = Math.hypot(MOUNTAIN_PEAK.x - APPROACH_POINT.x, MOUNTAIN_PEAK.y - APPROACH_POINT.y);
const APPROACH_RATIO = APPROACH_DISTANCE / (APPROACH_DISTANCE + CLIMB_DISTANCE);

function heightFromDistance(distance) {
  if (distance >= MOUNTAIN_INFLUENCE_RADIUS) return 0;
  return MOUNTAIN_MAX_HEIGHT * (1 - distance / MOUNTAIN_INFLUENCE_RADIUS);
}

// ○のx座標（距離レバーだけで決まる）。現実の地形性上昇と同じく、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、の2段階のx軌道を使う
// （斜め一直線に山頂へ向かうと、風に流されて山に登るという現象として不自然に見えるため）
function xForDistance(distance) {
  const t = 1 - clamp(distance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1); // 0=遠い, 1=山頂
  return t <= APPROACH_RATIO
    ? lerp(FAR_POINT.x, APPROACH_POINT.x, t / APPROACH_RATIO)
    : lerp(APPROACH_POINT.x, MOUNTAIN_PEAK.x, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO));
}

// 距離レバーだけで決まる「地形に沿ったy座標」。xForDistanceと同じtを使い、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、という同じ2段階の
// 軌道をyにも描かせる（xとyを別々のtから計算すると、斜面をなぞらずに斜め一直線で
// 山頂へ向かう不自然な動きになってしまうため、xと必ず同じtを使う）
function terrainY(distance) {
  const t = 1 - clamp(distance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1); // 0=遠い, 1=山頂
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
  vaporLevelLabelEl.textContent = level.label;
  vaporLevelValueEl.textContent = level.value.toFixed(1);
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

// 選択肢ボタンの描画とhinttextの更新のみを行う（正解発表はrenderQuizReveal）。
// phaseに応じてボタンの選択状態・disabledを切り替える
function renderQuizQuestion() {
  quizProgressEl.textContent = MESSAGES.quizProgress(quizQuestionIndex + 1, QUIZ_QUESTIONS.length);
  quizQuestionEl.textContent = MESSAGES.quizQuestion;
  quizChoicesEl.innerHTML = QUIZ_CHOICES.map((value, index) => {
    const selected = quizSelectedChoice === index;
    const disabled = quizPhase !== "choosing";
    return `<button type="button" class="quiz-choice-button${selected ? " selected" : ""}" data-index="${index}" ${disabled ? "disabled" : ""}>${quizChoiceLabel(index)}</button>`;
  }).join("");
  quizHintEl.textContent = quizPhase === "checking" ? MESSAGES.quizCheckingHint : "";
  quizRevealEl.hidden = true;
}

function selectQuizChoice(index) {
  if (quizPhase !== "choosing") return;
  quizSelectedChoice = index;
  quizPhase = "checking";
  setDistanceLeverLocked(false);
  renderQuizQuestion();
  maybeRevealQuizAnswer();
}

quizChoicesEl.addEventListener("click", (event) => {
  const button = event.target.closest(".quiz-choice-button");
  if (!button) return;
  selectQuizChoice(Number(button.dataset.index));
});

// 距離レバーをドラッグするたびに呼ばれ、「予想を選択済み・まだ答え合わせして
// いない」状態で雲が現れた瞬間だけ答え合わせを表示する
function maybeRevealQuizAnswer() {
  if (quizActive && quizPhase === "checking" && lastCloudVisible) {
    revealQuizAnswer();
  }
}

function revealQuizAnswer() {
  quizPhase = "revealed";
  const question = QUIZ_QUESTIONS[quizQuestionIndex];
  const level = VAPOR_LEVELS[question.vaporLevelIndex];
  const actualValue = Math.round((currentHeight / MOUNTAIN_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE);
  // 選択肢は「◯◯くらい」という近似値なので、実測値に最も近い選択肢を正解とみなす
  const nearestChoiceIndex = QUIZ_CHOICES.reduce(
    (best, value, index) =>
      Math.abs(value - actualValue) < Math.abs(QUIZ_CHOICES[best] - actualValue) ? index : best,
    0
  );
  const matched = quizSelectedChoice === nearestChoiceIndex;
  quizResults.push({ level, actualValue, matched });

  quizYourGuessEl.textContent = MESSAGES.quizYourGuess(quizChoiceLabel(quizSelectedChoice));
  quizRevealTextEl.textContent =
    (matched ? `${MESSAGES.quizRevealMatched} ` : "") + MESSAGES.quizRevealText(actualValue, level.value.toFixed(1));
  quizNextButton.textContent =
    quizQuestionIndex === QUIZ_QUESTIONS.length - 1 ? MESSAGES.quizFinishButtonLabel : MESSAGES.quizNextButtonLabel;
  quizRevealEl.hidden = false;
}

// 問題ごとに、水蒸気の量を強制的に切り替え、距離レバーを遠い(高さ0)に戻して
// から出題する。既に雲が出ている状態から始まると「動かさなくても答え合わせが
// 出る」ことになってしまうため、必ず高さ0から始める
function startQuizQuestion() {
  const question = QUIZ_QUESTIONS[quizQuestionIndex];
  setVaporLevel(question.vaporLevelIndex, true);
  currentDistance = MOUNTAIN_INFLUENCE_RADIUS;
  currentHeight = 0;
  positionAirMass(currentDistance);
  updateGauges(currentHeight);
  quizPhase = "choosing";
  quizSelectedChoice = null;
  setDistanceLeverLocked(true);
  renderQuizQuestion();
}

function startQuiz() {
  quizActive = true;
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
  if (quizQuestionIndex < QUIZ_QUESTIONS.length - 1) {
    quizQuestionIndex += 1;
    startQuizQuestion();
  } else {
    showQuizSummary();
  }
}

// 4段階で答えが違ったことに気づけるよう、水蒸気の量が少ない順に並べ替えて見せる
function showQuizSummary() {
  quizPanel.hidden = true;
  quizSummaryEl.hidden = false;
  quizSummaryTitleEl.textContent = MESSAGES.quizSummaryTitle;
  const sorted = [...quizResults].sort((a, b) => a.level.value - b.level.value);
  quizSummaryListEl.innerHTML = sorted
    .map((result) => `<li>${MESSAGES.quizSummaryRow(result.level.label, result.level.value.toFixed(1), result.actualValue)}</li>`)
    .join("");
  quizSummaryConclusionEl.textContent = MESSAGES.quizSummaryConclusion;
}

function exitQuiz() {
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

positionAirMass(currentDistance);
renderVaporLevelControl();
updateGauges(currentHeight);

// チュートリアル（初回起動時のみ、今のシーンに吹き出しを重ねるだけで別画面には遷移しない）
const TUTORIAL_STORAGE_KEY = "weather-app-tutorial-seen";

// target が null のステップ（コップの導入など、画面上に対応する要素がない話）は
// 吹き出しを画面中央に出す。導入2ステップ→操作→変化ログ、の順で上から下へ誘導する
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
