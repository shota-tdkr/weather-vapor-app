const map = document.getElementById("map");
const airMass = document.getElementById("air-mass");
const thermometerFill = document.getElementById("thermometer-fill");
const capacityFill = document.getElementById("capacity-fill");
const heldMarker = document.getElementById("held-marker");
const tempValueEl = document.getElementById("temp-value");
const heldValueEl = document.getElementById("held-value");
const capacityValueEl = document.getElementById("capacity-value");

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

const GROUND_CY = 220; // 空気塊の初期位置（高さ0とみなす基準線）
const LAPSE_RATE = 0.08; // ℃ / SVG座標1単位あたりの上昇による気温低下
const INITIAL_TEMP = 5;
const HELD_VAPOR = 6.8;

const TEMP_MIN = -15;
const TEMP_MAX = 35;
const VAPOR_MAX = 32;
const GAUGE_TRACK_TOP = 20;
const GAUGE_TRACK_HEIGHT = 210;

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

function updateGauges(cy) {
  const height = Math.max(0, GROUND_CY - cy);
  const temp = INITIAL_TEMP - height * LAPSE_RATE;
  const capacity = saturationVaporAmount(temp);

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

let dragOffset = null;

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
});

airMass.addEventListener("pointermove", (event) => {
  if (!dragOffset) return;
  const svgPoint = toSvgPoint(event.clientX, event.clientY);
  const cy = svgPoint.y - dragOffset.dy;
  airMass.setAttribute("cx", svgPoint.x - dragOffset.dx);
  airMass.setAttribute("cy", cy);
  updateGauges(cy);
});

function endDrag(event) {
  if (airMass.hasPointerCapture(event.pointerId)) {
    airMass.releasePointerCapture(event.pointerId);
  }
  dragOffset = null;
}

airMass.addEventListener("pointerup", endDrag);
airMass.addEventListener("pointercancel", endDrag);

updateGauges(parseFloat(airMass.getAttribute("cy")));
