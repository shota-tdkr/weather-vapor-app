const airMass = document.getElementById("air-mass");
const thermometerFill = document.getElementById("thermometer-fill");
const capacityFill = document.getElementById("capacity-fill");
const heldMarker = document.getElementById("held-marker");
const tempValueEl = document.getElementById("temp-value");
const heldValueEl = document.getElementById("held-value");
const capacityValueEl = document.getElementById("capacity-value");
const modeToggleButton = document.getElementById("mode-toggle");
const modeLabelEl = document.getElementById("mode-label");
const heightValueEl = document.getElementById("height-value");
const legendEl = document.getElementById("legend");
const heightLever = document.getElementById("height-lever");
const leverFill = document.getElementById("lever-fill");
const leverHandle = document.getElementById("lever-handle");
const leverCaptionEl = document.getElementById("lever-caption");
const droplets = Array.from(document.querySelectorAll(".droplet"));
const liftArrows = Array.from(document.querySelectorAll(".lift-arrow"));
const LIFT_ARROW_OFFSETS = [
  [0, 34],
  [-14, 42],
  [14, 42],
];
const changeLogList = document.getElementById("change-log-list");
const changeLogEl = document.getElementById("change-log");
const tutorialOverlay = document.getElementById("tutorial-overlay");
const tutorialBubble = document.getElementById("tutorial-bubble");
const tutorialStepLabelEl = document.getElementById("tutorial-step-label");
const tutorialTextEl = document.getElementById("tutorial-text");
const tutorialNextButton = document.getElementById("tutorial-next");
const tutorialSkipButton = document.getElementById("tutorial-skip");
const tutorialReplayButton = document.getElementById("tutorial-replay");
const cupTipButton = document.getElementById("cup-tip-button");
const cupTipText = document.getElementById("cup-tip-text");

const MESSAGES = {
  // 「実験モード」という言葉が伝わらなかった非同期テストのフィードバックを受けて、
  // 「モード」という抽象的な言葉をやめ、押した後に何ができるかを直接言うラベルにしている
  //
  // 2026-08-25: ○の自由な2Dドラッグを廃止し、通常モードも高さ操作モードと同じ
  // レバーUIを共用する方式に変更。レバーが操作する対象が「山までの距離」か
  // 「高さ」かの違いだけが残るようにした（design.md参照）。○自体は直接
  // ドラッグできず、レバー操作の結果として位置・高さが自動で決まる
  modeNormal: "レバーで「山までの距離」を操作できます",
  modeExperiment: "レバーで「高さ」を直接操作できます",
  switchToExperiment: "高さを直接操作できるようにする",
  switchToNormal: "山までの距離を操作できるようにする",
  leverCaptionDistance: "距離レバー（山までの距離を操作）",
  leverCaptionHeight: "高さレバー（高さを操作）",
  leverAriaDistance: "距離レバー（山までの距離を操作します）",
  leverAriaHeight: "高さレバー（高さを直接操作します）",
  // 以下、常時表示の補足用の凡例（初回起動時の正式なチュートリアルとは別物）
  legendTitle: "記号の説明",
  legendAirMass: "○ = 空気の塊。レバー操作にあわせて位置と高さが自動で変わります（直接ドラッグはできません）。",
  legendMountain: "▲ = 山。「山までの距離」を操作しているとき、○が近づくほど自動で高さが上がります。",
  legendNormalMode: "「山までの距離」を操作するとき: レバーを上げるほど山に近づき、高さも自動で上がります。",
  legendExperimentMode: "「高さ」を操作するとき: ○は横には動かず真上に浮かびます。山に関係なく高さだけを直接操作できます。",
  legendCup: "コップの水滴 = 保有水蒸気量が飽和水蒸気量を超えた分。あふれた量が多いほど、水滴が増えます。",
  // コップ横の「？」アイコン（Tips）。実生活との接続を一言で示す
  cupTip:
    "夏に冷たい飲み物を入れたコップの外側が濡れるのと同じ現象です。空気中の水蒸気が、冷たいものに触れて水滴になっています。",
  cupTipButtonLabel: "豆知識を見る",
  // 変化ログ（因果を段階表示するテキスト）。数値を埋め込むため関数にしているが、
  // 文言はすべてここに集約する（コード中に日本語を散らさない）
  changeLogTitle: "変化ログ",
  logLifted: "空気の塊を持ち上げました",
  logLowered: "空気の塊を下ろしました",
  logTempDrop: (from, to) => `→ 気温が${from}℃から${to}℃に下がりました`,
  logTempRise: (from, to) => `→ 気温が${from}℃から${to}℃に上がりました`,
  logCapacityDrop: (from, to) => `→ 抱えられる水蒸気の量が${from}g/m³から${to}g/m³に減りました`,
  logCapacityRise: (from, to) => `→ 抱えられる水蒸気の量が${from}g/m³から${to}g/m³に増えました`,
  // 「高さを操作しただけでコップが濡れるのは因果が飛躍している」という指摘を受け、
  // コップの水滴だと明示する文言にしている（コップの水滴は空気塊の状態をそのまま映しているため）
  logCondensationStart: "→ 水蒸気を抱えきれなくなり、コップに水滴が現れました",
  logCondensationEnd: "→ 水蒸気の量が抱えられる量を下回り、コップの水滴が消えました",
  logCondensationMore: "→ 抱えきれない水蒸気の量が増え、コップの水滴が増えました",
  logCondensationLess: "→ 抱えきれない水蒸気の量が減り、コップの水滴も減りました",
  logCondensationStillRoom: "→ まだ水蒸気を抱えられるので、コップに水滴はついていません",
  // チュートリアル（初回起動時のみ、吹き出しガイド）
  tutorialStepLabel: (current, total) => `${current} / ${total}`,
  tutorialStep1: "右のレバーを動かして、空気の塊（○）を山（▲）に近づけてみよう",
  tutorialStep2: "このボタンを押すと、レバーで「高さ」を直接操作できるようになります",
  tutorialStep3: "下の変化ログに、なぜそうなったかが表示されます",
  tutorialNext: "次へ",
  tutorialFinish: "はじめる",
  tutorialSkip: "スキップ",
  tutorialReplay: "使い方を見る",
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
const INITIAL_TEMP = 5;
const HELD_VAPOR = 6.8;
const MIN_CAPACITY = 0.1; // saturationVaporAmount()が返す最小値（低温側の外挿がマイナスにならないための下限）
// あふれ量(HELD_VAPOR - capacity)が実際に到達しうる最大値。capacityの下限がMIN_CAPACITYのため、
// あふれ量の上限もHELD_VAPORとMIN_CAPACITYの差で頭打ちになる（水滴の個数のしきい値はこれを基準にする）
const MAX_EXCESS = HELD_VAPOR - MIN_CAPACITY;

const TEMP_MIN = -15;
const TEMP_MAX = 35;
const VAPOR_MAX = 32;
const GAUGE_TRACK_TOP = 20;
const GAUGE_TRACK_HEIGHT = 210;

// 通常モード: 山への接近で自動的に高さが上がる
const MOUNTAIN_INFLUENCE_RADIUS = 120; // 山頂からこの距離より遠いと山の影響なし
const MOUNTAIN_MAX_HEIGHT = 120; // 山頂での高さ

// 実験モード: 縦ドラッグの移動量がそのまま高さになる
const EXPERIMENT_MAX_HEIGHT = 250;

// 高さの表示は実単位ではなく0〜100の相対値にする（実験モードの最大高さを100とする）
const HEIGHT_DISPLAY_SCALE = 100;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// 値(value)を「0からmaxまでを均等にstepCount段階に分けたとき、何段階目まで表示するか」に
// 変換する汎用ロジック。コップの水滴のように「あふれ量に応じて複数の見た目を段階的に見せる」
// 演出はこの先も増える見込み（design.md想定の雲の演出など）なので、水滴専用にせず独立した
// 関数にしている。保証する性質は次の2つ:
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

function setGaugeFill(rect, ratio) {
  const height = clamp(ratio, 0, 1) * GAUGE_TRACK_HEIGHT;
  rect.setAttribute("y", GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - height);
  rect.setAttribute("height", height);
}

function triangleUpPoints(cx, cy) {
  return `${cx},${cy - 6} ${cx - 6},${cy + 6} ${cx + 6},${cy + 6}`;
}

// 高さが上がった瞬間だけ、空気の塊の下から矢印がフワッと浮かぶ演出
function pulseLiftArrows() {
  const cx = parseFloat(airMass.getAttribute("cx"));
  const cy = parseFloat(airMass.getAttribute("cy"));
  liftArrows.forEach((arrow, index) => {
    const [dx, dy] = LIFT_ARROW_OFFSETS[index];
    arrow.setAttribute("points", triangleUpPoints(cx + dx, cy + dy));
    arrow.classList.remove("pulse");
    requestAnimationFrame(() => arrow.classList.add("pulse"));
  });
}

let previousHeight = 0;

function updateGauges(height) {
  const temp = INITIAL_TEMP - height * LAPSE_RATE;
  const capacity = saturationVaporAmount(temp);

  if (height > previousHeight + 0.5) {
    pulseLiftArrows();
  }
  previousHeight = height;

  // 高さ表示の分母は、そのモードで実際に到達できる最大高さに合わせる
  // （常にEXPERIMENT_MAX_HEIGHTを基準にすると、通常モードでは山頂にいても48までしか
  // 表示上進まず、「/ 100」という分母に到達できなくなる）
  const heightDisplayMax = mode === "experiment" ? EXPERIMENT_MAX_HEIGHT : MOUNTAIN_MAX_HEIGHT;
  heightValueEl.textContent = Math.round((height / heightDisplayMax) * HEIGHT_DISPLAY_SCALE);
  tempValueEl.textContent = temp.toFixed(1);
  heldValueEl.textContent = HELD_VAPOR.toFixed(1);
  capacityValueEl.textContent = capacity.toFixed(1);

  setGaugeFill(thermometerFill, (temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN));
  setGaugeFill(capacityFill, capacity / VAPOR_MAX);

  const heldY =
    GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - (HELD_VAPOR / VAPOR_MAX) * GAUGE_TRACK_HEIGHT;
  heldMarker.setAttribute("y1", heldY);
  heldMarker.setAttribute("y2", heldY);

  // レバーの見た目は、モードによらず常にEXPERIMENT_MAX_HEIGHT（到達しうる高さの絶対上限）を
  // 基準に正規化する。通常モードの最大高さ(120)を基準にすると、モード切替の瞬間に
  // 同じ高さのままレバーの位置だけが動いてしまう（高さが変わっていないのに操作した
  // ように見えるジャンプになる）ため、両モード共通の基準にしてジャンプを起こさない
  const leverRatio = clamp(height / EXPERIMENT_MAX_HEIGHT, 0, 1);
  setGaugeFill(leverFill, leverRatio);
  leverHandle.setAttribute("cy", GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - leverRatio * GAUGE_TRACK_HEIGHT);

  // 保有水蒸気量が飽和水蒸気量を超えた分だけ、コップの水滴を1つずつ増やす。
  // 段階の割り当てはisStepVisible()に委譲する（あふれ量が0より大きければ必ず1個目が
  // 見える／最後の水滴もMAX_EXCESS＝実際に到達しうるあふれ量の上限でちょうど出る、を保証）
  // TODO(季節スライダー実装時): design.mdの想定では、コップは「今持ち上げている空気塊」ではなく
  // 「季節で決まる周囲の気温・水蒸気量」に反応する独立した小道具。季節スライダーができたら、
  // ここのHELD_VAPOR/capacityを季節ベースの値に差し替える（コップ表面温度8℃との比較に切り替える）
  const excess = Math.max(0, HELD_VAPOR - capacity);
  droplets.forEach((droplet, index) => {
    droplet.classList.toggle("visible", isStepVisible(excess, MAX_EXCESS, droplets.length, index));
  });
}

const CHANGE_LOG_MIN_HEIGHT_DELTA = 3; // これ未満の高さ変化はログに残さない
const CHANGE_LOG_STEP_DELAY = 350; // ms（CLAUDE.mdの0.3〜0.4秒間隔）
const CHANGE_LOG_MAX_ENTRIES = 40;

function isNearZero(value) {
  return value <= 0.05;
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
  const beforeExcess = Math.max(0, HELD_VAPOR - beforeCapacity);
  const afterExcess = Math.max(0, HELD_VAPOR - afterCapacity);
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

  if (isNearZero(beforeExcess) && !isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCondensationStart);
  } else if (!isNearZero(beforeExcess) && isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCondensationEnd);
  } else if (afterExcess > beforeExcess) {
    lines.push(MESSAGES.logCondensationMore);
  } else if (afterExcess < beforeExcess) {
    lines.push(MESSAGES.logCondensationLess);
  } else if (isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCondensationStillRoom);
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

// 通常モードでの○の見た目の起点（=山から最も遠い状態）。index.html側の初期配置をそのまま使う
const FAR_POINT = {
  x: parseFloat(airMass.getAttribute("cx")),
  y: parseFloat(airMass.getAttribute("cy")),
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

// 通常モード用の○の見た目の位置。現実の地形性上昇と同じく、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、の2段階で表現する
// （斜め一直線に山頂へ向かうと、風に流されて山に登るという現象として不自然に見えるため）
function positionAirMassForDistance(distance) {
  const t = 1 - clamp(distance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1); // 0=遠い, 1=山頂
  const point =
    t <= APPROACH_RATIO
      ? {
          x: lerp(FAR_POINT.x, APPROACH_POINT.x, t / APPROACH_RATIO),
          y: lerp(FAR_POINT.y, APPROACH_POINT.y, t / APPROACH_RATIO),
        }
      : {
          x: lerp(APPROACH_POINT.x, MOUNTAIN_PEAK.x, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO)),
          y: lerp(APPROACH_POINT.y, MOUNTAIN_PEAK.y, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO)),
        };
  airMass.setAttribute("cx", point.x);
  airMass.setAttribute("cy", point.y);
}

// 高さ操作モードで最大まで上げたときの○のy座標（画面上端寄り）
const HEIGHT_MODE_TOP_Y = 40;

// 高さ操作モード用の○の見た目の位置。x座標はFAR_POINTのまま固定し、
// 高さに応じて真上に浮かぶだけにする（山に近づくように見せると、
// 「①山の影響」と「②高さそのものの影響」を切り分けるという狙いが崩れるため）
function positionAirMassForHeight(height) {
  const ratio = clamp(height / EXPERIMENT_MAX_HEIGHT, 0, 1);
  airMass.setAttribute("cx", FAR_POINT.x);
  airMass.setAttribute("cy", lerp(FAR_POINT.y, HEIGHT_MODE_TOP_Y, ratio));
}

let mode = "normal"; // "normal" | "experiment"
let currentHeight = 0;
let currentDistance = MOUNTAIN_INFLUENCE_RADIUS; // 通常モード: 山までの距離（0=山頂、MOUNTAIN_INFLUENCE_RADIUS=影響なし）
let leverDragStart = null;

function setMode(nextMode) {
  mode = nextMode;
  const isExperiment = mode === "experiment";
  modeLabelEl.textContent = isExperiment ? MESSAGES.modeExperiment : MESSAGES.modeNormal;
  modeToggleButton.textContent = isExperiment ? MESSAGES.switchToNormal : MESSAGES.switchToExperiment;
  leverCaptionEl.textContent = isExperiment ? MESSAGES.leverCaptionHeight : MESSAGES.leverCaptionDistance;
  heightLever.setAttribute("aria-label", isExperiment ? MESSAGES.leverAriaHeight : MESSAGES.leverAriaDistance);
  if (isExperiment) {
    // 高さ操作モードに切り替えた瞬間、今の高さに合わせて見た目を再計算する。
    // 高さ表示の分母がモードごとに違うため、ここでも数値表示を更新しないと
    // 次に操作するまで通常モード基準の古い数値が残ってしまう
    positionAirMassForHeight(currentHeight);
    updateGauges(currentHeight);
  } else {
    // 通常モードに戻った瞬間、現在の距離から高さと見た目を再計算する。
    // ○の位置は瞬時にジャンプするので、水滴のフェード（0.3秒）だけが
    // 取り残されて「離れているのに水滴が残っている」ように見えないよう、
    // この更新だけはトランジションなしで即座に反映する
    currentHeight = heightFromDistance(currentDistance);
    positionAirMassForDistance(currentDistance);
    updateGauges(currentHeight);
  }
}

modeToggleButton.addEventListener("click", () => {
  setMode(mode === "normal" ? "experiment" : "normal");
});

function toSvgPoint(svgEl, clientX, clientY) {
  const point = svgEl.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(svgEl.getScreenCTM().inverse());
}

// レバーは両モード共通のUI。通常モードでは「山までの距離」、高さ操作モードでは
// 「高さ」を操作する。○自体は直接ドラッグしない（レバー操作の結果として自動で動く）
heightLever.addEventListener("pointerdown", (event) => {
  heightLever.setPointerCapture(event.pointerId);
  const svgPoint = toSvgPoint(heightLever, event.clientX, event.clientY);
  leverDragStart = {
    svgY: svgPoint.y,
    value: mode === "experiment" ? currentHeight : currentDistance,
    heightBefore: currentHeight,
  };
  // ドラッグ中は○の位置を指に瞬時に追従させたいので、トランジションを止める
  // （モード切り替え時のジャンプだけをなめらかにするためのトランジションのため）
  airMass.classList.add("dragging");
});

heightLever.addEventListener("pointermove", (event) => {
  if (!leverDragStart) return;
  const svgPoint = toSvgPoint(heightLever, event.clientX, event.clientY);
  const deltaY = leverDragStart.svgY - svgPoint.y; // 上に動かすほど「より持ち上げる/より近づく」

  if (mode === "experiment") {
    const deltaHeight = deltaY * (EXPERIMENT_MAX_HEIGHT / GAUGE_TRACK_HEIGHT);
    currentHeight = clamp(leverDragStart.value + deltaHeight, 0, EXPERIMENT_MAX_HEIGHT);
    positionAirMassForHeight(currentHeight);
  } else {
    // 通常モード: レバーは「山までの距離」。上に動かすほど距離が縮む＝山に近づく
    const deltaDistance = deltaY * (MOUNTAIN_INFLUENCE_RADIUS / GAUGE_TRACK_HEIGHT);
    currentDistance = clamp(leverDragStart.value - deltaDistance, 0, MOUNTAIN_INFLUENCE_RADIUS);
    currentHeight = heightFromDistance(currentDistance);
    positionAirMassForDistance(currentDistance);
  }
  updateGauges(currentHeight);
});

function endLeverDrag(event) {
  if (heightLever.hasPointerCapture(event.pointerId)) {
    heightLever.releasePointerCapture(event.pointerId);
  }
  if (leverDragStart) {
    logHeightChange(leverDragStart.heightBefore, currentHeight);
  }
  leverDragStart = null;
  airMass.classList.remove("dragging");
}

heightLever.addEventListener("pointerup", endLeverDrag);
heightLever.addEventListener("pointercancel", endLeverDrag);

function renderLegend() {
  legendEl.innerHTML = `
    <p class="legend-title">${MESSAGES.legendTitle}</p>
    <ul>
      <li>${MESSAGES.legendAirMass}</li>
      <li>${MESSAGES.legendMountain}</li>
      <li>${MESSAGES.legendNormalMode}</li>
      <li>${MESSAGES.legendExperimentMode}</li>
      <li>${MESSAGES.legendCup}</li>
    </ul>
  `;
}

renderLegend();
setMode("normal");

// チュートリアル（初回起動時のみ、今のシーンに吹き出しを重ねるだけで別画面には遷移しない）
const TUTORIAL_STORAGE_KEY = "weather-app-tutorial-seen";

const TUTORIAL_STEPS = [
  { target: heightLever, text: MESSAGES.tutorialStep1 },
  { target: modeToggleButton, text: MESSAGES.tutorialStep2 },
  { target: changeLogEl, text: MESSAGES.tutorialStep3 },
];

let tutorialStepIndex = 0;
let tutorialHighlightedEl = null;
tutorialSkipButton.textContent = MESSAGES.tutorialSkip;

function positionTutorialBubble(target) {
  const rect = target.getBoundingClientRect();
  const bubbleWidth = tutorialBubble.offsetWidth;
  const bubbleHeight = tutorialBubble.offsetHeight;

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
  }
  const step = TUTORIAL_STEPS[index];
  tutorialHighlightedEl = step.target;
  tutorialHighlightedEl.classList.add("tutorial-highlight");
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

// コップ横の「？」（Tips）: タップで実生活接続の一言を開閉する
cupTipText.textContent = MESSAGES.cupTip;
cupTipButton.setAttribute("aria-label", MESSAGES.cupTipButtonLabel);
cupTipButton.addEventListener("click", () => {
  const nowHidden = !cupTipText.hidden;
  cupTipText.hidden = nowHidden;
  cupTipButton.setAttribute("aria-expanded", String(!nowHidden));
});

window.addEventListener("resize", () => {
  if (!tutorialOverlay.hidden && tutorialHighlightedEl) {
    positionTutorialBubble(tutorialHighlightedEl);
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
