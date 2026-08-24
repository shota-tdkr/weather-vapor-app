const map = document.getElementById("map");
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
const droplets = Array.from(document.querySelectorAll(".droplet"));
const liftArrows = Array.from(document.querySelectorAll(".lift-arrow"));
const LIFT_ARROW_OFFSETS = [
  [0, 34],
  [-14, 42],
  [14, 42],
];

const MESSAGES = {
  // 「実験モード」という言葉が伝わらなかった非同期テストのフィードバックを受けて、
  // 「モード」という抽象的な言葉をやめ、押した後に何ができるかを直接言うラベルにしている
  modeNormal: "○は地図で動かせます",
  modeExperiment: "○は高さだけ動かせます",
  switchToExperiment: "高さだけ動かせるようにする",
  switchToNormal: "地図で動かせるようにする",
  // 以下、デバッグ・テスト用の凡例（正式なチュートリアルはCLAUDE.mdの別機能として後日実装）
  legendTitle: "記号の説明（デバッグ用）",
  legendAirMass: "○ = 空気の塊。「地図で動かせる」状態のときは、地図上をドラッグして動かせます。",
  legendMountain: "▲ = 山。○を近づけると自動で高さが上がります（地図で動かせるときのみ）。",
  legendNormalMode: "○が地図で動くとき: 自由にドラッグできます。山に近づくと自動で高さが上がります。",
  legendExperimentMode: "○が高さだけ動くとき: ○は固定されたまま、右の「高さレバー」をドラッグすると、山に関係なく高さだけを操作できます。",
  legendCup: "コップの水滴 = 保有水蒸気量が飽和水蒸気量を超えた分。あふれた量が多いほど、水滴が増えます。",
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

function saturationVaporAmount(temp) {
  const table = SATURATION_TABLE;
  if (temp <= table[0].temp) {
    const [a, b] = table;
    const slope = (b.value - a.value) / (b.temp - a.temp);
    return Math.max(0.1, a.value + slope * (temp - a.temp));
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

  const leverRatio = clamp(height / EXPERIMENT_MAX_HEIGHT, 0, 1);
  setGaugeFill(leverFill, leverRatio);
  leverHandle.setAttribute("cy", GAUGE_TRACK_TOP + GAUGE_TRACK_HEIGHT - leverRatio * GAUGE_TRACK_HEIGHT);

  // 保有水蒸気量が飽和水蒸気量を超えた分だけ、コップの水滴を1つずつ増やす
  const excess = Math.max(0, HELD_VAPOR - capacity);
  droplets.forEach((droplet, index) => {
    const threshold = (HELD_VAPOR * (index + 1)) / droplets.length;
    droplet.classList.toggle("visible", excess >= threshold);
  });
}

// 山の頂点（yが最小の点）を「山の位置」として使う（SVG側の図形がそのままデータになる）
const MOUNTAIN_CENTERS = Array.from(document.querySelectorAll(".mountains polygon")).map((polygon) => {
  const points = polygon
    .getAttribute("points")
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number));
  return points.reduce((peak, [x, y]) => (y < peak.y ? { x, y } : peak), { x: points[0][0], y: Infinity });
});

function heightFromMountainProximity(x, y) {
  let nearest = Infinity;
  for (const mountain of MOUNTAIN_CENTERS) {
    const distance = Math.hypot(x - mountain.x, y - mountain.y);
    if (distance < nearest) nearest = distance;
  }
  if (nearest >= MOUNTAIN_INFLUENCE_RADIUS) return 0;
  return MOUNTAIN_MAX_HEIGHT * (1 - nearest / MOUNTAIN_INFLUENCE_RADIUS);
}

let mode = "normal"; // "normal" | "experiment"
let currentHeight = 0;
let dragOffset = null;
let leverDragStart = null;

function setMode(nextMode) {
  mode = nextMode;
  const isExperiment = mode === "experiment";
  modeLabelEl.textContent = isExperiment ? MESSAGES.modeExperiment : MESSAGES.modeNormal;
  modeToggleButton.textContent = isExperiment ? MESSAGES.switchToNormal : MESSAGES.switchToExperiment;
  airMass.classList.toggle("disabled", isExperiment);
  leverHandle.classList.toggle("disabled", !isExperiment);
  if (!isExperiment) {
    // 通常モードに戻った瞬間、現在位置（実験モード中は動いていない）から高さを自動で再計算する
    const cx = parseFloat(airMass.getAttribute("cx"));
    const cy = parseFloat(airMass.getAttribute("cy"));
    currentHeight = heightFromMountainProximity(cx, cy);
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

// 通常モード: ○を地図上でドラッグ。山への近さで高さが自動で決まる
airMass.addEventListener("pointerdown", (event) => {
  if (mode !== "normal") return;
  airMass.setPointerCapture(event.pointerId);
  const svgPoint = toSvgPoint(map, event.clientX, event.clientY);
  dragOffset = {
    dx: svgPoint.x - parseFloat(airMass.getAttribute("cx")),
    dy: svgPoint.y - parseFloat(airMass.getAttribute("cy")),
  };
});

airMass.addEventListener("pointermove", (event) => {
  if (!dragOffset) return;
  const svgPoint = toSvgPoint(map, event.clientX, event.clientY);
  const cx = svgPoint.x - dragOffset.dx;
  const cy = svgPoint.y - dragOffset.dy;
  airMass.setAttribute("cx", cx);
  airMass.setAttribute("cy", cy);
  currentHeight = heightFromMountainProximity(cx, cy);
  updateGauges(currentHeight);
});

function endDrag(event) {
  if (airMass.hasPointerCapture(event.pointerId)) {
    airMass.releasePointerCapture(event.pointerId);
  }
  dragOffset = null;
}

airMass.addEventListener("pointerup", endDrag);
airMass.addEventListener("pointercancel", endDrag);

// 実験モード: ○は動かさず、高さレバーのドラッグだけが高さを変える
heightLever.addEventListener("pointerdown", (event) => {
  if (mode !== "experiment") return;
  heightLever.setPointerCapture(event.pointerId);
  const svgPoint = toSvgPoint(heightLever, event.clientX, event.clientY);
  leverDragStart = { svgY: svgPoint.y, height: currentHeight };
});

heightLever.addEventListener("pointermove", (event) => {
  if (!leverDragStart) return;
  const svgPoint = toSvgPoint(heightLever, event.clientX, event.clientY);
  const deltaY = leverDragStart.svgY - svgPoint.y; // 上に動かすほど高さが増える
  const deltaHeight = deltaY * (EXPERIMENT_MAX_HEIGHT / GAUGE_TRACK_HEIGHT);
  currentHeight = clamp(leverDragStart.height + deltaHeight, 0, EXPERIMENT_MAX_HEIGHT);
  updateGauges(currentHeight);
});

function endLeverDrag(event) {
  if (heightLever.hasPointerCapture(event.pointerId)) {
    heightLever.releasePointerCapture(event.pointerId);
  }
  leverDragStart = null;
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
