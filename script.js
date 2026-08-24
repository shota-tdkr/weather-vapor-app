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

const MESSAGES = {
  modeNormal: "通常モード",
  modeExperiment: "実験モード",
  switchToExperiment: "実験モードにする",
  switchToNormal: "通常モードにする",
  // 以下、デバッグ・テスト用の凡例（正式なチュートリアルはCLAUDE.mdの別機能として後日実装）
  legendTitle: "記号の説明（デバッグ用）",
  legendAirMass: "○ = 空気の塊。ドラッグして動かせます。",
  legendMountain: "▲ = 山。通常モードではここに近づくと自動で高さが上がります。",
  legendNormalMode: "通常モード: ○を自由にドラッグできます。山に近づくと自動で高さが上がります。",
  legendExperimentMode: "実験モード: ○は上下にしか動きません。山に関係なく、動かした分だけ高さが変わります。",
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
const MOUNTAIN_INFLUENCE_RADIUS = 70; // この距離より遠いと山の影響なし
const MOUNTAIN_MAX_HEIGHT = 120; // 山の真上での高さ

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

function updateGauges(height) {
  const temp = INITIAL_TEMP - height * LAPSE_RATE;
  const capacity = saturationVaporAmount(temp);

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
}

// 山の三角形記号の重心を「山の位置」として使う（SVG側の記号がそのままデータになる）
const MOUNTAIN_CENTERS = Array.from(document.querySelectorAll(".mountains polygon")).map((polygon) => {
  const points = polygon
    .getAttribute("points")
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number));
  const x = points.reduce((sum, [px]) => sum + px, 0) / points.length;
  const y = points.reduce((sum, [, py]) => sum + py, 0) / points.length;
  return { x, y };
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
let experimentBaseline = null;

function setMode(nextMode) {
  mode = nextMode;
  const isExperiment = mode === "experiment";
  modeLabelEl.textContent = isExperiment ? MESSAGES.modeExperiment : MESSAGES.modeNormal;
  modeToggleButton.textContent = isExperiment ? MESSAGES.switchToNormal : MESSAGES.switchToExperiment;
  experimentBaseline = null;
  if (!isExperiment) {
    // 通常モードに戻った瞬間、現在位置から高さを自動で再計算する
    const cx = parseFloat(airMass.getAttribute("cx"));
    const cy = parseFloat(airMass.getAttribute("cy"));
    currentHeight = heightFromMountainProximity(cx, cy);
    updateGauges(currentHeight);
  }
}

modeToggleButton.addEventListener("click", () => {
  setMode(mode === "normal" ? "experiment" : "normal");
});

function toSvgPoint(clientX, clientY) {
  const point = map.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(map.getScreenCTM().inverse());
}

airMass.addEventListener("pointerdown", (event) => {
  airMass.setPointerCapture(event.pointerId);
  const svgPoint = toSvgPoint(event.clientX, event.clientY);
  dragOffset = {
    dx: svgPoint.x - parseFloat(airMass.getAttribute("cx")),
    dy: svgPoint.y - parseFloat(airMass.getAttribute("cy")),
  };
  if (mode === "experiment") {
    experimentBaseline = {
      cy: parseFloat(airMass.getAttribute("cy")),
      height: currentHeight,
    };
  }
});

airMass.addEventListener("pointermove", (event) => {
  if (!dragOffset) return;
  const svgPoint = toSvgPoint(event.clientX, event.clientY);
  const cy = svgPoint.y - dragOffset.dy;

  if (mode === "experiment") {
    airMass.setAttribute("cy", cy);
    const deltaHeight = experimentBaseline.cy - cy;
    currentHeight = clamp(experimentBaseline.height + deltaHeight, 0, EXPERIMENT_MAX_HEIGHT);
  } else {
    const cx = svgPoint.x - dragOffset.dx;
    airMass.setAttribute("cx", cx);
    airMass.setAttribute("cy", cy);
    currentHeight = heightFromMountainProximity(cx, cy);
  }
  updateGauges(currentHeight);
});

function endDrag(event) {
  if (airMass.hasPointerCapture(event.pointerId)) {
    airMass.releasePointerCapture(event.pointerId);
  }
  dragOffset = null;
  experimentBaseline = null;
}

airMass.addEventListener("pointerup", endDrag);
airMass.addEventListener("pointercancel", endDrag);

function renderLegend() {
  legendEl.innerHTML = `
    <p class="legend-title">${MESSAGES.legendTitle}</p>
    <ul>
      <li>${MESSAGES.legendAirMass}</li>
      <li>${MESSAGES.legendMountain}</li>
      <li>${MESSAGES.legendNormalMode}</li>
      <li>${MESSAGES.legendExperimentMode}</li>
    </ul>
  `;
}

renderLegend();
setMode("normal");
