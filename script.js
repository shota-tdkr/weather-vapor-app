const airMass = document.getElementById("air-mass");
const thermometerFill = document.getElementById("thermometer-fill");
const capacityFill = document.getElementById("capacity-fill");
const heldMarker = document.getElementById("held-marker");
const tempValueEl = document.getElementById("temp-value");
const heldValueEl = document.getElementById("held-value");
const capacityValueEl = document.getElementById("capacity-value");
const heightValueEl = document.getElementById("height-value");
const legendEl = document.getElementById("legend");
const distanceLever = document.getElementById("distance-lever");
const distanceLeverFill = document.getElementById("distance-lever-fill");
const distanceLeverHandle = document.getElementById("distance-lever-handle");
const distanceLeverCaptionEl = document.getElementById("distance-lever-caption");
const heightLever = document.getElementById("height-lever");
const heightLeverFill = document.getElementById("height-lever-fill");
const heightLeverHandle = document.getElementById("height-lever-handle");
const heightLeverCaptionEl = document.getElementById("height-lever-caption");
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
  // 「モード」という抽象的な言葉自体をやめた。
  //
  // 2026-08-26: モード切り替え方式を廃止し、「距離レバー」「高さレバー」の2本を
  // 常時同時表示する方式に変更（design.md参照）。距離レバーを動かすと高さレバーの
  // つまみも連動して動き、高さレバーだけを動かしても距離レバーは動かない。
  // ○自体は直接ドラッグできず、レバー操作の結果として位置・高さが自動で決まる
  leverCaptionDistance: "距離レバー（山までの距離を操作）",
  leverCaptionHeight: "高さレバー（高さを操作）",
  leverAriaDistance: "距離レバー（山までの距離を操作します）",
  leverAriaHeight: "高さレバー（高さを直接操作します）",
  // 以下、常時表示の補足用の凡例（初回起動時の正式なチュートリアルとは別物）
  legendTitle: "記号の説明",
  legendAirMass: "○ = 空気の塊。レバー操作にあわせて位置と高さが自動で変わります（直接ドラッグはできません）。",
  legendMountain: "▲ = 山。距離レバーで○を近づけるほど、高さも自動で上がります。",
  legendDistanceLever: "距離レバー: 上げるほど山に近づき、高さも自動で上がります（高さレバーのつまみも連動して動きます）。",
  legendHeightLever: "高さレバー: ○の高さを直接操作します。距離レバーとは独立していて、距離には影響しません。",
  legendCloud: "○が白く曇る = 空気塊自体が、抱えきれなくなった水蒸気の量に応じて白くなります（雲ができる様子）。",
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
  // 雲（空気塊自体が白く曇る演出）用の変化ログ。コップの水滴と違い、あふれた
  // その場（空気塊）で起きる現象なので、コップより先に表示する
  logCloudStart: "→ 水蒸気を抱えきれなくなり、雲ができました",
  logCloudEnd: "→ 水蒸気の量が抱えられる量を下回り、雲が消えました",
  // あふれ量が最大に達したときだけの一言。「雲ができる=雨が降る」という誤った
  // 因果を避けるため、雨を降らせる演出は追加せず、条件付きの説明に留める
  logRainHint: "→ さらに条件が重なると、雲の粒が成長して雨になります",
  // チュートリアル（初回起動時のみ、吹き出しガイド）
  tutorialStepLabel: (current, total) => `${current} / ${total}`,
  tutorialStep1: "距離レバーを動かして、空気の塊（○）を山（▲）に近づけてみよう",
  tutorialStep2: "隣の高さレバーを動かすと、高さだけを直接操作できます",
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
// 高さ0時点で「保有水蒸気量が飽和水蒸気量に対して明確に余裕がある」状態から始め、
// レバーを動かすうちに余裕→あふれ、の両方が画面に現れるようにする。
// HELD_VAPOR=9.4は教科書の対応表の「10℃の飽和水蒸気量」と同じ値（＝露点10℃相当）を
// 採用しており、INITIAL_TEMP=15℃・湿度約73%という不自然でない組み合わせになる
const INITIAL_TEMP = 15;
const HELD_VAPOR = 9.4;
const MIN_CAPACITY = 0.1; // saturationVaporAmount()が返す最小値（低温側の外挿がマイナスにならないための下限）

const TEMP_MIN = -15;
const TEMP_MAX = 35;
const VAPOR_MAX = 32;
const GAUGE_TRACK_TOP = 20;
const GAUGE_TRACK_HEIGHT = 210;

// 距離レバー: 山への接近で自動的に高さが上がる
const MOUNTAIN_INFLUENCE_RADIUS = 120; // 山頂からこの距離より遠いと山の影響なし
const MOUNTAIN_MAX_HEIGHT = 120; // 山頂での高さ（距離レバーだけで到達できる高さの上限）

// 高さレバー: 縦ドラッグの移動量がそのまま高さになる。距離レバーより広い可動域を持ち、
// 山より高くまで直接持ち上げられる
const EXPERIMENT_MAX_HEIGHT = 250;

// 高さの表示は実単位ではなく0〜100の相対値にする（高さレバーの最大値を100とする）
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

// あふれ量(HELD_VAPOR - capacity)が実際に到達しうる最大値。高さレバーの上限
// (EXPERIMENT_MAX_HEIGHT、距離レバーより広い可動域)まで上昇したときの
// 気温・飽和水蒸気量から求める。MIN_CAPACITYの下限に必ず到達するとは限らないため
// （INITIAL_TEMP/HELD_VAPORの組み合わせ次第で最低気温が0℃を下回らないこともある）、
// 決め打ちにせずsaturationVaporAmount()から逆算する。水滴の個数のしきい値の基準
const MAX_EXCESS = HELD_VAPOR - saturationVaporAmount(INITIAL_TEMP - LAPSE_RATE * EXPERIMENT_MAX_HEIGHT);

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

  // 高さレバー自身の可動域(0〜EXPERIMENT_MAX_HEIGHT)がそのまま高さの実際の可動域
  // でもあるため、表示の分母は常にこれでよい（モード切り替え方式の廃止により、
  // 「通常モードでは分母に届かない」という問題自体がなくなった）
  heightValueEl.textContent = Math.round((height / EXPERIMENT_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE);
  tempValueEl.textContent = temp.toFixed(1);
  heldValueEl.textContent = HELD_VAPOR.toFixed(1);
  capacityValueEl.textContent = capacity.toFixed(1);

  setGaugeFill(thermometerFill, (temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN));
  setGaugeFill(capacityFill, capacity / VAPOR_MAX);

  const heldY =
    GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - (HELD_VAPOR / VAPOR_MAX) * GAUGE_TRACK_HEIGHT;
  heldMarker.setAttribute("y1", heldY);
  heldMarker.setAttribute("y2", heldY);

  // 高さレバーの見た目は、このレバー自身の可動域(EXPERIMENT_MAX_HEIGHT)を基準に正規化する
  const heightRatio = clamp(height / EXPERIMENT_MAX_HEIGHT, 0, 1);
  setGaugeFill(heightLeverFill, heightRatio);
  heightLeverHandle.setAttribute("cy", GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - heightRatio * GAUGE_TRACK_HEIGHT);

  // 距離レバーの見た目は、距離自身の可動域(0〜MOUNTAIN_INFLUENCE_RADIUS)を基準に正規化する
  // （距離が0＝山頂に近いほどレバーが上がるように、比率は反転させる）。distance/heightの
  // 2本のレバーがそれぞれ自分の可動域をそのまま使えるため、以前のように片方のモードで
  // レバーが端まで動かせない、ということが起きない
  const distanceRatio = 1 - clamp(currentDistance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1);
  setGaugeFill(distanceLeverFill, distanceRatio);
  distanceLeverHandle.setAttribute(
    "cy",
    GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - distanceRatio * GAUGE_TRACK_HEIGHT
  );

  // 保有水蒸気量が飽和水蒸気量を超えた分だけ、コップの水滴を1つずつ増やす。
  // 段階の割り当てはisStepVisible()に委譲する（あふれ量が0より大きければ必ず1個目が
  // 見える／最後の水滴もMAX_EXCESS＝実際に到達しうるあふれ量の上限でちょうど出る、を保証）
  // TODO(季節スライダー実装時): design.mdの想定では、コップは「今持ち上げている空気塊」ではなく
  // 「季節で決まる周囲の気温・水蒸気量」に反応する独立した小道具。季節スライダーができたら、
  // ここのHELD_VAPOR/capacityを季節ベースの値に差し替える（コップ表面温度8℃との比較に切り替える）
  const excess = Math.max(0, HELD_VAPOR - capacity);
  let visibleDropletCount = 0;
  droplets.forEach((droplet, index) => {
    const visible = isStepVisible(excess, MAX_EXCESS, droplets.length, index);
    droplet.classList.toggle("visible", visible);
    if (visible) visibleDropletCount += 1;
  });

  // 雲: 新しい図形を増やさず、○自体をあふれ量に応じて段階的に白く塗る（fill-opacityを
  // 上げる）。水滴と同じ「何段階目まで見えているか」を使うことで、コップの水滴が
  // 1つ増えるたびに○も1段階ずつ曇る、という対応関係になる
  airMass.setAttribute("fill-opacity", visibleDropletCount / droplets.length);
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

  // 雲（空気塊自体が曇る演出）は、あふれが起きたその場で直接起こる現象なので、
  // コップの水滴（間接的な言い換え）より先に表示する
  if (isNearZero(beforeExcess) && !isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCloudStart);
  } else if (!isNearZero(beforeExcess) && isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCloudEnd);
  }

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

  // あふれ量が最大に達した瞬間だけ、雨との関係を一言添える（「雲ができる=必ず雨」という
  // 誤った因果を避けるため、雨を降らせる演出そのものは追加しない。条件付きの一文のみ）
  const wasAtMaxExcess = beforeExcess >= MAX_EXCESS;
  const isAtMaxExcess = afterExcess >= MAX_EXCESS;
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

// ○の見た目の起点（距離レバーが最大＝山から最も遠い状態）。index.html側の初期配置をそのまま使う
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

// ○のx座標（距離レバーだけで決まる）。現実の地形性上昇と同じく、
// ①水平に山へ近づく → ②斜面にぶつかってから斜面沿いに登る、の2段階のx軌道を使う
// （斜め一直線に山頂へ向かうと、風に流されて山に登るという現象として不自然に見えるため）
function xForDistance(distance) {
  const t = 1 - clamp(distance / MOUNTAIN_INFLUENCE_RADIUS, 0, 1); // 0=遠い, 1=山頂
  return t <= APPROACH_RATIO
    ? lerp(FAR_POINT.x, APPROACH_POINT.x, t / APPROACH_RATIO)
    : lerp(APPROACH_POINT.x, MOUNTAIN_PEAK.x, (t - APPROACH_RATIO) / (1 - APPROACH_RATIO));
}

// 高さレバーを最大まで上げたときの○のy座標（画面上端寄り）
const SKY_TOP_Y = 40;

// ○のy座標（高さレバーだけで決まる）。高さ0〜MOUNTAIN_MAX_HEIGHTは地面〜山頂の高さに、
// それ以上（山より高く持ち上げた分）は山頂〜上空にそれぞれ対応させる。距離レバーで
// 山頂まで近づいたとき（高さ=MOUNTAIN_MAX_HEIGHT）に、ちょうど山頂の高さと一致する
function yForHeight(height) {
  if (height <= MOUNTAIN_MAX_HEIGHT) {
    return lerp(FAR_POINT.y, MOUNTAIN_PEAK.y, height / MOUNTAIN_MAX_HEIGHT);
  }
  const t = (height - MOUNTAIN_MAX_HEIGHT) / (EXPERIMENT_MAX_HEIGHT - MOUNTAIN_MAX_HEIGHT);
  return lerp(MOUNTAIN_PEAK.y, SKY_TOP_Y, t);
}

// ○の見た目の位置は、距離レバー(x)と高さレバー(y)がそれぞれ独立に決める
function positionAirMass(distance, height) {
  airMass.setAttribute("cx", xForDistance(distance));
  airMass.setAttribute("cy", yForHeight(height));
}

let currentHeight = 0;
let currentDistance = MOUNTAIN_INFLUENCE_RADIUS; // 山までの距離（0=山頂、MOUNTAIN_INFLUENCE_RADIUS=影響なし）

function toSvgPoint(svgEl, clientX, clientY) {
  const point = svgEl.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(svgEl.getScreenCTM().inverse());
}

// レバー共通の配線（pointerのキャプチャ／解放、○のdraggingクラスの付け外し）だけを
// まとめる。ドラッグ中に何の値をどう変えるかはレバーごとに違うため、呼び出し側の
// onStart/onMove/onEndに委ねる（2本のレバーで同じ配線を重複させないための共通化）
function bindLeverDrag(leverEl, { onStart, onMove, onEnd }) {
  leverEl.addEventListener("pointerdown", (event) => {
    leverEl.setPointerCapture(event.pointerId);
    const svgPoint = toSvgPoint(leverEl, event.clientX, event.clientY);
    onStart(svgPoint.y);
    airMass.classList.add("dragging");
  });
  leverEl.addEventListener("pointermove", (event) => {
    const svgPoint = toSvgPoint(leverEl, event.clientX, event.clientY);
    onMove(svgPoint.y);
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

// 距離レバー: 「山までの距離」を操作する。上に動かすほど距離が縮む＝山に近づく。
// 距離が変わるたびに、山への接近で自動的に決まる高さ(heightFromDistance)へ
// currentHeightを同期させる。これにより高さレバーのつまみも連動して動く
let distanceDragStart = null;
bindLeverDrag(distanceLever, {
  onStart: (svgY) => {
    distanceDragStart = { svgY, value: currentDistance, heightBefore: currentHeight };
  },
  onMove: (svgY) => {
    if (!distanceDragStart) return;
    const deltaY = distanceDragStart.svgY - svgY;
    const deltaDistance = deltaY * (MOUNTAIN_INFLUENCE_RADIUS / GAUGE_TRACK_HEIGHT);
    currentDistance = clamp(distanceDragStart.value - deltaDistance, 0, MOUNTAIN_INFLUENCE_RADIUS);
    currentHeight = heightFromDistance(currentDistance);
    positionAirMass(currentDistance, currentHeight);
    updateGauges(currentHeight);
  },
  onEnd: () => {
    if (distanceDragStart) {
      logHeightChange(distanceDragStart.heightBefore, currentHeight);
    }
    distanceDragStart = null;
  },
});

// 高さレバー: 高さを直接操作する。距離レバーとは独立していて、currentDistanceは変えない
let heightDragStart = null;
bindLeverDrag(heightLever, {
  onStart: (svgY) => {
    heightDragStart = { svgY, value: currentHeight, heightBefore: currentHeight };
  },
  onMove: (svgY) => {
    if (!heightDragStart) return;
    const deltaY = heightDragStart.svgY - svgY;
    const deltaHeight = deltaY * (EXPERIMENT_MAX_HEIGHT / GAUGE_TRACK_HEIGHT);
    currentHeight = clamp(heightDragStart.value + deltaHeight, 0, EXPERIMENT_MAX_HEIGHT);
    positionAirMass(currentDistance, currentHeight);
    updateGauges(currentHeight);
  },
  onEnd: () => {
    if (heightDragStart) {
      logHeightChange(heightDragStart.heightBefore, currentHeight);
    }
    heightDragStart = null;
  },
});

function renderLegend() {
  legendEl.innerHTML = `
    <p class="legend-title">${MESSAGES.legendTitle}</p>
    <ul>
      <li>${MESSAGES.legendAirMass}</li>
      <li>${MESSAGES.legendMountain}</li>
      <li>${MESSAGES.legendDistanceLever}</li>
      <li>${MESSAGES.legendHeightLever}</li>
      <li>${MESSAGES.legendCloud}</li>
      <li>${MESSAGES.legendCup}</li>
    </ul>
  `;
}

renderLegend();

// キャプション・aria-labelは固定文言なので初期化時に一度だけ設定する
distanceLeverCaptionEl.textContent = MESSAGES.leverCaptionDistance;
distanceLever.setAttribute("aria-label", MESSAGES.leverAriaDistance);
heightLeverCaptionEl.textContent = MESSAGES.leverCaptionHeight;
heightLever.setAttribute("aria-label", MESSAGES.leverAriaHeight);

positionAirMass(currentDistance, currentHeight);
updateGauges(currentHeight);

// チュートリアル（初回起動時のみ、今のシーンに吹き出しを重ねるだけで別画面には遷移しない）
const TUTORIAL_STORAGE_KEY = "weather-app-tutorial-seen";

const TUTORIAL_STEPS = [
  { target: distanceLever, text: MESSAGES.tutorialStep1 },
  { target: heightLever, text: MESSAGES.tutorialStep2 },
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
