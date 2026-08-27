const airMass = document.getElementById("air-mass");
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
  leverCaptionDistance: "距離レバー（左＝遠い　右＝山に近い）",
  leverAriaDistance: "距離レバー（山までの距離を操作します）",
  // 以下、常時表示の補足用の凡例（初回起動時の正式なチュートリアルとは別物）
  legendTitle: "記号の説明",
  legendAirMass: "○ = 空気の塊。レバー操作にあわせて位置と高さが自動で変わります（直接ドラッグはできません）。",
  legendMountain: "▲ = 山。距離レバーで○を近づけるほど、高さも自動で上がります。",
  legendDistanceLever: "マップ下の横向きのレバー: 右へ動かすほど山に近づき、高さも自動で上がります。",
  legendVaporGauge:
    "マップ内の水蒸気ゲージ: 塗り＝保有水蒸気量（固定）、点線＝飽和水蒸気量（気温が下がると降りてきます）。点線が塗りより下に来た分を、白抜き＋輪郭線で「あふれ」として示します。",
  legendCloud: "○が白く曇る = あふれた水蒸気の量に応じて、空気塊自体が白くなります（雲ができる様子）。",
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
  // あふれ量が最大に達したときだけの一言。「雲ができる=雨が降る」という誤った
  // 因果を避けるため、雨を降らせる演出は追加せず、条件付きの説明に留める
  logRainHint: "→ さらに条件が重なると、雲の粒が成長して雨になります",
  // チュートリアル（初回起動時のみ、吹き出しガイド）
  tutorialStepLabel: (current, total) => `${current} / ${total}`,
  tutorialStep1: "距離レバーを動かして、空気の塊（○）を山（▲）に近づけてみよう",
  tutorialStep2: "下の変化ログに、なぜそうなったかが表示されます",
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

// 雲の段階数。旧実装ではコップの水滴8個の並びと1:1対応させていたが、コップ撤去後も
// 変化ログのしきい値との対応を変えないため、同じ段階数を独立した定数として残す
const CLOUD_STEPS = 8;

// 距離レバー: 山への接近で自動的に高さが上がる。距離0(山頂)で最大の高さに達し、
// 距離レバー1本で可動域全体（水滴8個・雨のヒントまで）に届く
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

// あふれ量(HELD_VAPOR - capacity)が実際に到達しうる最大値。距離レバーの上限
// (距離0、山頂＝MOUNTAIN_MAX_HEIGHT)まで上昇したときの気温・飽和水蒸気量から求める。
// MIN_CAPACITYの下限に必ず到達するとは限らないため
// （INITIAL_TEMP/HELD_VAPORの組み合わせ次第で最低気温が0℃を下回らないこともある）、
// 決め打ちにせずsaturationVaporAmount()から逆算する。水滴の個数のしきい値の基準
const MAX_EXCESS = HELD_VAPOR - saturationVaporAmount(INITIAL_TEMP - LAPSE_RATE * MOUNTAIN_MAX_HEIGHT);

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

  // 距離レバーが到達できる高さの上限(MOUNTAIN_MAX_HEIGHT)がそのまま高さの実際の
  // 可動域でもあるため、表示の分母は常にこれでよい
  heightValueEl.textContent = Math.round((height / MOUNTAIN_MAX_HEIGHT) * HEIGHT_DISPLAY_SCALE);
  tempValueEl.textContent = temp.toFixed(1);

  // 気温の横帯（情報パネル内、従属表示）
  const tempRatio = clamp((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN), 0, 1);
  tempStripFill.setAttribute("width", tempRatio * TEMP_STRIP_WIDTH);

  // 水蒸気ゲージ（反転済み）: 塗り＝保有水蒸気量（HELD_VAPORが定数の間は見た目上
  // 動かないが、季節スライダー実装後にHELD_VAPORが可変になっても同じ式で動くよう、
  // 固定値扱いにせず毎回計算する）
  const heldTopY = verticalFillTopY(HELD_VAPOR / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporFill.setAttribute("y", heldTopY);
  vaporFill.setAttribute("height", VAPOR_TRACK_TOP + VAPOR_TRACK_HEIGHT - heldTopY);

  // 線＝飽和水蒸気量。気温が下がるほどcapacityが減り、線(y)はトラック下端へ降りてくる
  const capLineY = verticalFillTopY(capacity / VAPOR_MAX, VAPOR_TRACK_TOP, VAPOR_TRACK_HEIGHT);
  vaporCapLine.setAttribute("y1", capLineY);
  vaporCapLine.setAttribute("y2", capLineY);
  vaporCapLabel.setAttribute("y", capLineY + 3);

  // あふれ帯: 線が塗りの上端より下に来た分（＝保有量のうち抱えきれない部分）を
  // 白抜き＋輪郭線で示す。○が白く曇る雲の表現と同じ視覚言語にすることで、
  // 「白い＝あふれた分＝雲になるもの」という一貫性を作る（design.md参照）
  const excess = Math.max(0, HELD_VAPOR - capacity);
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

  // 雲: ○自体をあふれ量に応じて段階的に白く塗る（fill-opacityを上げる）。
  // TODO(季節スライダー実装時): 季節ごとの保有水蒸気量に応じてHELD_VAPORを
  // 差し替える（design.md「季節スライダー」参照）
  let visibleStepCount = 0;
  for (let i = 0; i < CLOUD_STEPS; i++) {
    if (isStepVisible(excess, MAX_EXCESS, CLOUD_STEPS, i)) visibleStepCount += 1;
  }
  airMass.setAttribute("fill-opacity", visibleStepCount / CLOUD_STEPS);
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

  // 雲の発生/消滅と「あふれ」は同じ事象を2回言わない（コップ撤去にともない統合。
  // design.md「端の小道具：汗をかくコップ」参照）。しきい値をまたぐ瞬間は雲の
  // 発生/消滅だけを報告し、またがない間の増減・据え置きだけをあふれ量で報告する
  if (isNearZero(beforeExcess) && !isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCloudStart);
  } else if (!isNearZero(beforeExcess) && isNearZero(afterExcess)) {
    lines.push(MESSAGES.logCloudEnd);
  } else if (afterExcess > beforeExcess) {
    lines.push(MESSAGES.logExcessMore);
  } else if (afterExcess < beforeExcess) {
    lines.push(MESSAGES.logExcessLess);
  } else if (isNearZero(afterExcess)) {
    lines.push(MESSAGES.logExcessStillRoom);
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
// 描くため、○が山の内部にめり込むことは構造上起こらない）
function positionAirMass(distance) {
  airMass.setAttribute("cx", xForDistance(distance));
  airMass.setAttribute("cy", terrainY(distance));
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
    distanceDragStart = { svgX, value: currentDistance, heightBefore: currentHeight };
  },
  onMove: (svgX) => {
    if (!distanceDragStart) return;
    const deltaX = svgX - distanceDragStart.svgX;
    const deltaDistance = deltaX * (MOUNTAIN_INFLUENCE_RADIUS / LEVER_TRACK_WIDTH);
    currentDistance = clamp(distanceDragStart.value - deltaDistance, 0, MOUNTAIN_INFLUENCE_RADIUS);
    currentHeight = heightFromDistance(currentDistance);
    positionAirMass(currentDistance);
    updateGauges(currentHeight);
  },
  onEnd: () => {
    if (distanceDragStart) {
      logHeightChange(distanceDragStart.heightBefore, currentHeight);
    }
    distanceDragStart = null;
  },
});

function renderLegend() {
  legendEl.innerHTML = `
    <p class="legend-title">${MESSAGES.legendTitle}</p>
    <ul>
      <li>${MESSAGES.legendAirMass}</li>
      <li>${MESSAGES.legendMountain}</li>
      <li>${MESSAGES.legendDistanceLever}</li>
      <li>${MESSAGES.legendVaporGauge}</li>
      <li>${MESSAGES.legendCloud}</li>
    </ul>
  `;
}

renderLegend();

// キャプション・aria-labelは固定文言なので初期化時に一度だけ設定する
distanceLeverCaptionEl.textContent = MESSAGES.leverCaptionDistance;
distanceLever.setAttribute("aria-label", MESSAGES.leverAriaDistance);

positionAirMass(currentDistance);
updateGauges(currentHeight);

// チュートリアル（初回起動時のみ、今のシーンに吹き出しを重ねるだけで別画面には遷移しない）
const TUTORIAL_STORAGE_KEY = "weather-app-tutorial-seen";

const TUTORIAL_STEPS = [
  { target: distanceLever, text: MESSAGES.tutorialStep1 },
  { target: changeLogEl, text: MESSAGES.tutorialStep2 },
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
