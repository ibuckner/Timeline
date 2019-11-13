function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function variance(values, valueof) {
  let count = 0;
  let delta;
  let mean = 0;
  let sum = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  }
  if (count > 1) return sum / (count - 1);
}

function deviation(values, valueof) {
  const v = variance(values, valueof);
  return v ? Math.sqrt(v) : v;
}

function max(values, valueof) {
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  }
  return max;
}

function min(values, valueof) {
  let min;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  }
  return min;
}

// Based on https://github.com/mourner/quickselect
// ISC license, Copyright 2018 Vladimir Agafonkin.
function quickselect(array, k, left = 0, right = array.length - 1, compare = ascending) {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(array, k, newLeft, newRight, compare);
    }

    const t = array[k];
    let i = left;
    let j = right;

    swap(array, left, k);
    if (compare(array[right], t) > 0) swap(array, left, right);

    while (i < j) {
      swap(array, i, j), ++i, --j;
      while (compare(array[i], t) < 0) ++i;
      while (compare(array[j], t) > 0) --j;
    }

    if (compare(array[left], t) === 0) swap(array, left, j);
    else ++j, swap(array, j, right);

    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
  return array;
}

function swap(array, i, j) {
  const t = array[i];
  array[i] = array[j];
  array[j] = t;
}

function* numbers(values, valueof) {
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        yield value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        yield value;
      }
    }
  }
}

function quantile(values, p, valueof) {
  values = Float64Array.from(numbers(values, valueof));
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return min(values);
  if (p >= 1) return max(values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = max(quickselect(values, i0).subarray(0, i0 + 1)),
      value1 = min(values.subarray(i0 + 1));
  return value0 + (value1 - value0) * (i - i0);
}

function median(values, valueof) {
  return quantile(values, 0.5, valueof);
}

var _a, _b, _c;
const data = [
    {
        id: 1,
        start: 1000,
        end: 1400,
        categories: [
            {
                name: "Late Arrival (LAT)",
                foreColor: "rgb(248, 80, 108)",
                backColor: "rgb(248, 156, 171, 0.75)",
                points: [
                    { id: 1, time: 1000, wait: 6 },
                    { id: 2, time: 1100, wait: 55 },
                    { id: 3, time: 1200, wait: 1 },
                    { id: 4, time: 1300, wait: 3 },
                    { id: 5, time: 1400, wait: 7 },
                    { id: 6, time: 1130, wait: 3 },
                    { id: 7, time: 1230, wait: 13 },
                    { id: 8, time: 1030, wait: 10 },
                    { id: 9, time: 1045, wait: 9 }
                ]
            },
            {
                name: "Cancelled (CAN)",
                foreColor: "rgb(228, 146, 39)",
                backColor: "rgba(221, 170, 103, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 3 },
                    { id: 3, time: 1220, wait: 11 }
                ]
            },
            {
                name: "Waiting Height & Weight (WHW)",
                foreColor: "rgb(41, 113, 247)",
                backColor: "rgba(100, 149, 237, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 9 },
                    { id: 3, time: 1220, wait: 10 }
                ]
            },
            {
                name: "In consultation (ICO)",
                foreColor: "rgb(81, 66, 167)",
                backColor: "rgba(123, 104, 238, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 20 },
                    { id: 2, time: 1210, wait: 7 },
                    { id: 3, time: 1220, wait: 3 }
                ]
            },
            {
                name: "In blood room (IBR)",
                foreColor: "rgb(247, 65, 44)",
                backColor: "rgba(250, 128, 114, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 3 },
                    { id: 2, time: 1210, wait: 4 },
                    { id: 3, time: 1220, wait: 5 }
                ]
            },
            {
                name: "Did not attend (DNA)",
                foreColor: "rgb(143, 63, 248)",
                backColor: "rgba(139, 107, 180, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 12 },
                    { id: 2, time: 1210, wait: 13 },
                    { id: 3, time: 1220, wait: 12 }
                ]
            },
            {
                name: "Identified by kiosk (KIO)",
                foreColor: "rgb(17, 141, 59)",
                backColor: "rgba(17, 141, 59, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 6 },
                    { id: 3, time: 1220, wait: 4 }
                ]
            },
            {
                name: "Waiting for consulation (WCO)",
                foreColor: "rgb(224, 148, 5)",
                backColor: "rgba(245, 181, 61, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 2 },
                    { id: 3, time: 1220, wait: 13 }
                ]
            },
            {
                name: "Waiting for blood (WB)",
                foreColor: "rgb(20, 105, 105)",
                backColor: "rgba(20, 105, 105, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 22 },
                    { id: 2, time: 1210, wait: 13 },
                    { id: 3, time: 1220, wait: 35 }
                ]
            },
            {
                name: "Completed (COM)",
                foreColor: "rgb(116, 170, 7)",
                backColor: "rgba(154, 205, 50, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 11 },
                    { id: 2, time: 1210, wait: 15 },
                    { id: 3, time: 1220, wait: 18 }
                ]
            }
        ]
    },
    {
        id: 2,
        start: 800,
        end: 2000,
        categories: [
            {
                name: "Cancelled (CAN)",
                foreColor: "rgb(228, 146, 39)",
                backColor: "rgba(221, 170, 103, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 3 },
                    { id: 3, time: 1220, wait: 11 }
                ]
            },
            {
                name: "In consultation (ICO)",
                foreColor: "rgb(81, 66, 167)",
                backColor: "rgba(123, 104, 238, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 20 },
                    { id: 2, time: 1210, wait: 7 },
                    { id: 3, time: 1220, wait: 3 }
                ]
            },
            {
                name: "Identified by kiosk (KIO)",
                foreColor: "rgb(17, 141, 59)",
                backColor: "rgba(17, 141, 59, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 6 },
                    { id: 3, time: 1220, wait: 4 }
                ]
            },
            {
                name: "Waiting for consulation (WCO)",
                foreColor: "rgb(224, 148, 5)",
                backColor: "rgba(245, 181, 61, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 2 },
                    { id: 3, time: 1220, wait: 13 }
                ]
            },
            {
                name: "Completed (COM)",
                foreColor: "rgb(116, 170, 7)",
                backColor: "rgba(154, 205, 50, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 11 },
                    { id: 2, time: 1210, wait: 15 },
                    { id: 3, time: 1220, wait: 18 }
                ]
            }
        ]
    },
    {
        id: 3,
        start: 900,
        end: 1700,
        categories: [
            {
                name: "Cancelled (CAN)",
                foreColor: "rgb(228, 146, 39)",
                backColor: "rgba(221, 170, 103, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 3 },
                    { id: 3, time: 1220, wait: 11 }
                ]
            },
            {
                name: "Waiting Height & Weight (WHW)",
                foreColor: "rgb(41, 113, 247)",
                backColor: "rgba(100, 149, 237, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 9 },
                    { id: 3, time: 1220, wait: 10 }
                ]
            },
            {
                name: "Identified by kiosk (KIO)",
                foreColor: "rgb(17, 141, 59)",
                backColor: "rgba(17, 141, 59, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 6 },
                    { id: 3, time: 1220, wait: 4 }
                ]
            },
            {
                name: "Completed (COM)",
                foreColor: "rgb(116, 170, 7)",
                backColor: "rgba(154, 205, 50, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 11 },
                    { id: 2, time: 1210, wait: 15 },
                    { id: 3, time: 1220, wait: 18 }
                ]
            }
        ]
    },
    {
        id: 4,
        start: 1000,
        end: 1600,
        categories: [
            {
                name: "Late Arrival (LAT)",
                foreColor: "rgb(248, 80, 108)",
                backColor: "rgb(248, 156, 171, 0.75)",
                points: [
                    { id: 3, time: 1000, wait: 2 },
                    { id: 4, time: 1100, wait: 3 },
                    { id: 5, time: 1200, wait: 4 },
                    { id: 6, time: 1300, wait: 5 },
                    { id: 7, time: 1400, wait: 6 },
                    { id: 8, time: 1500, wait: 5 },
                    { id: 9, time: 1600, wait: 2 }
                ]
            },
            {
                name: "Waiting Height & Weight (WHW)",
                foreColor: "rgb(41, 113, 247)",
                backColor: "rgba(100, 149, 237, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 9 },
                    { id: 3, time: 1220, wait: 10 }
                ]
            },
            {
                name: "In consultation (ICO)",
                foreColor: "rgb(81, 66, 167)",
                backColor: "rgba(123, 104, 238, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 20 },
                    { id: 2, time: 1210, wait: 7 },
                    { id: 3, time: 1220, wait: 3 }
                ]
            },
            {
                name: "In blood room (IBR)",
                foreColor: "rgb(247, 65, 44)",
                backColor: "rgba(250, 128, 114, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 3 },
                    { id: 2, time: 1210, wait: 4 },
                    { id: 3, time: 1220, wait: 5 }
                ]
            },
            {
                name: "Waiting for consulation (WCO)",
                foreColor: "rgb(224, 148, 5)",
                backColor: "rgba(245, 181, 61, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 2 },
                    { id: 3, time: 1220, wait: 13 }
                ]
            }
        ]
    },
    {
        id: 5,
        start: 1400,
        end: 1500,
        categories: [
            {
                name: "Late Arrival (LAT)",
                foreColor: "rgb(248, 80, 108)",
                backColor: "rgb(248, 156, 171, 0.75)",
                points: [
                    { id: 7, time: 1400, wait: 6 },
                    { id: 8, time: 1500, wait: 5 }
                ]
            },
            {
                name: "Cancelled (CAN)",
                foreColor: "rgb(228, 146, 39)",
                backColor: "rgba(221, 170, 103, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 8 },
                    { id: 2, time: 1410, wait: 3 },
                    { id: 3, time: 1420, wait: 11 }
                ]
            },
            {
                name: "Waiting Height & Weight (WHW)",
                foreColor: "rgb(41, 113, 247)",
                backColor: "rgba(100, 149, 237, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 1 },
                    { id: 2, time: 1410, wait: 9 },
                    { id: 3, time: 1420, wait: 10 }
                ]
            },
            {
                name: "In consultation (ICO)",
                foreColor: "rgb(81, 66, 167)",
                backColor: "rgba(123, 104, 238, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 20 },
                    { id: 2, time: 1410, wait: 7 },
                    { id: 3, time: 1420, wait: 3 }
                ]
            },
            {
                name: "In blood room (IBR)",
                foreColor: "rgb(247, 65, 44)",
                backColor: "rgba(250, 128, 114, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 3 },
                    { id: 2, time: 1410, wait: 4 },
                    { id: 3, time: 1420, wait: 5 }
                ]
            },
            {
                name: "Did not attend (DNA)",
                foreColor: "rgb(143, 63, 248)",
                backColor: "rgba(139, 107, 180, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 12 },
                    { id: 2, time: 1410, wait: 13 },
                    { id: 3, time: 1420, wait: 12 }
                ]
            },
            {
                name: "Identified by kiosk (KIO)",
                foreColor: "rgb(17, 141, 59)",
                backColor: "rgba(17, 141, 59, 0.75)",
                points: [
                    { id: 1, time: 1400, wait: 8 },
                    { id: 2, time: 1410, wait: 6 },
                    { id: 3, time: 1420, wait: 4 }
                ]
            }
        ]
    },
    {
        id: 6,
        start: 900,
        end: 1800,
        categories: [
            {
                name: "Late Arrival (LAT)",
                foreColor: "rgb(248, 80, 108)",
                backColor: "rgb(248, 156, 171, 0.75)",
                points: [
                    { id: 1, time: 800, wait: 0 },
                    { id: 2, time: 900, wait: 1 },
                    { id: 3, time: 1000, wait: 2 },
                    { id: 4, time: 1100, wait: 3 },
                    { id: 5, time: 1200, wait: 4 },
                    { id: 6, time: 1300, wait: 5 },
                    { id: 7, time: 1400, wait: 6 },
                    { id: 8, time: 1500, wait: 5 },
                    { id: 9, time: 1600, wait: 2 },
                    { id: 10, time: 1700, wait: 0 }
                ]
            },
            {
                name: "Cancelled (CAN)",
                foreColor: "rgb(228, 146, 39)",
                backColor: "rgba(221, 170, 103, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 3 },
                    { id: 3, time: 1220, wait: 11 }
                ]
            },
            {
                name: "Waiting Height & Weight (WHW)",
                foreColor: "rgb(41, 113, 247)",
                backColor: "rgba(100, 149, 237, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 9 },
                    { id: 3, time: 1220, wait: 10 }
                ]
            },
            {
                name: "In consultation (ICO)",
                foreColor: "rgb(81, 66, 167)",
                backColor: "rgba(123, 104, 238, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 20 },
                    { id: 2, time: 1210, wait: 7 },
                    { id: 3, time: 1220, wait: 3 }
                ]
            },
            {
                name: "In blood room (IBR)",
                foreColor: "rgb(247, 65, 44)",
                backColor: "rgba(250, 128, 114, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 3 },
                    { id: 2, time: 1210, wait: 4 },
                    { id: 3, time: 1220, wait: 5 }
                ]
            },
            {
                name: "Did not attend (DNA)",
                foreColor: "rgb(143, 63, 248)",
                backColor: "rgba(139, 107, 180, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 12 },
                    { id: 2, time: 1210, wait: 13 },
                    { id: 3, time: 1220, wait: 12 }
                ]
            },
            {
                name: "Identified by kiosk (KIO)",
                foreColor: "rgb(17, 141, 59)",
                backColor: "rgba(17, 141, 59, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 8 },
                    { id: 2, time: 1210, wait: 6 },
                    { id: 3, time: 1220, wait: 4 }
                ]
            },
            {
                name: "Waiting for consulation (WCO)",
                foreColor: "rgb(224, 148, 5)",
                backColor: "rgba(245, 181, 61, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 1 },
                    { id: 2, time: 1210, wait: 2 },
                    { id: 3, time: 1220, wait: 13 }
                ]
            },
            {
                name: "Waiting for blood (WB)",
                foreColor: "rgb(20, 105, 105)",
                backColor: "rgba(20, 105, 105, 0.75)",
                points: [
                    { id: 1, time: 1200, wait: 22 },
                    { id: 2, time: 1210, wait: 13 },
                    { id: 3, time: 1220, wait: 35 }
                ]
            }
        ]
    }
];
let activePoint;
let activeEvent;
const objExplorer = document.querySelector(".object");
const timeline = document.querySelector(".timeline");
const legend = document.querySelector(".legend");
const legendItems = document.querySelector(".legend-items");
const viewLegendButton = document.querySelector(".show-legend");
const closeLegendButton = document.querySelector(".close-legend");
let resizeTimer;
function pointClickHandler(e, point) {
    e.stopPropagation();
    togglePointSelection(activePoint);
    activePoint = activePoint === point ? undefined : point;
    togglePointSelection(activePoint);
    toggleObjectExplorer(activePoint);
}
function eventClickHandler(e, category) {
    var _a;
    e.stopPropagation();
    togglePointSelection(activePoint);
    activePoint = undefined;
    activeEvent = activeEvent === category ? undefined : category;
    toggleObjectExplorer(activeEvent);
    if (!((_a = legend) === null || _a === void 0 ? void 0 : _a.classList.contains("hidden"))) {
        toggleLegendClickHandler();
    }
}
function timelineclickHandler(_) {
    var _a;
    togglePointSelection(activePoint);
    activePoint = undefined;
    toggleObjectExplorer();
    if (!((_a = legend) === null || _a === void 0 ? void 0 : _a.classList.contains("hidden"))) {
        toggleLegendClickHandler();
    }
}
function toggleLegendClickHandler() {
    var _a, _b, _c, _d;
    if ((_a = legend) === null || _a === void 0 ? void 0 : _a.classList.contains("hidden")) {
        legend.classList.remove("hidden");
        (_b = viewLegendButton) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
    }
    else {
        (_c = legend) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        (_d = viewLegendButton) === null || _d === void 0 ? void 0 : _d.classList.remove("hidden");
    }
}
function togglePointSelection(point) {
    var _a, _b;
    if (point) {
        if ((_a = point.el) === null || _a === void 0 ? void 0 : _a.classList.contains("highlight")) {
            point.el.classList.remove("highlight");
        }
        else {
            (_b = point.el) === null || _b === void 0 ? void 0 : _b.classList.add("highlight");
        }
    }
}
function toggleObjectExplorer(point) {
    var _a, _b, _c;
    if (objExplorer) {
        if (point) {
            objExplorer.classList.remove("hidden");
            const heading = (_a = objExplorer) === null || _a === void 0 ? void 0 : _a.querySelector("h3");
            const category = point.parent;
            if (category) {
                if (heading) {
                    heading.textContent = `point appointment for "${category.name}"`;
                }
                const content = objExplorer.querySelector(".content");
                if (content && category.parent) {
                    content.innerHTML = `<div>The opening times are ${numberToTime((_b = category.parent) === null || _b === void 0 ? void 0 : _b.start)} to ${numberToTime((_c = category.parent) === null || _c === void 0 ? void 0 : _c.end)}</div>`;
                    content.innerHTML += `<div>The appointment was scheduled at ${numberToTime(point.time)} and the point waited approx. ${point.wait} minute${point.wait > 1 ? "s" : ""}.</div>`;
                }
            }
        }
        else {
            objExplorer.classList.add("hidden");
        }
    }
}
function numberToTime(value) {
    let t = ("0" + value.toString()).slice(-4);
    return t.slice(0, 2) + ":" + t.slice(-2);
}
function addSequence(seq) {
    seq.el = document.createElement("div");
    seq.el.classList.add("sequence");
    if (seq.relHeight) {
        seq.el.style.height = `${seq.relHeight * 100}%`;
    }
    else {
        throw new Error("Sequence is missing relative height");
    }
    return seq.el;
}
function addLegendItem(category) {
    const li = document.createElement("div");
    li.classList.add("legend-item");
    li.style.backgroundColor = category.backColor;
    li.style.borderColor = category.foreColor;
    li.textContent = category.name;
    return li;
}
function addCategory(category, avgWait) {
    const c = document.createElement("div");
    c.classList.add("category");
    c.title = `${category.name}\nMax waiting time (min): ${category.maxWait}`;
    c.style.backgroundColor = category.backColor;
    c.style.borderColor = category.foreColor;
    if (category.avgWidth && category.maxWait && avgWait !== undefined) {
        c.style.flexBasis = `${category.avgWidth * (category.maxWait / avgWait)}%`;
    }
    else {
        throw new Error("Category is missing average width and maximum waiting times");
    }
    c.addEventListener("click", (e) => eventClickHandler(e, category));
    return c;
}
function addQuantiles(category) {
    var _a;
    const med = document.createElement("div");
    med.classList.add("median");
    med.textContent = "";
    med.style.backgroundColor = category.foreColor;
    med.style.borderColor = category.foreColor;
    med.title = `Median is ${category.median}`;
    (_a = category.el) === null || _a === void 0 ? void 0 : _a.appendChild(med);
    updateLinePointX(category);
}
function addPoint(point, category) {
    point.el = document.createElement("div");
    point.el.classList.add("pt");
    point.el.style.backgroundColor = category.foreColor;
    point.el.style.borderColor = category.foreColor;
    point.el.title = `Appointment time: ${numberToTime(point.time)}\nWaiting time (min): ${point.wait}`;
    updatePointXY(point, category);
    point.el.addEventListener("click", e => pointClickHandler(e, point));
    return point.el;
}
function updatePoints() {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
        data.forEach(s => {
            s.categories.forEach(c => {
                updateLinePointX(c);
                c.points.forEach(pt => updatePointXY(pt, c));
            });
        });
    }, 350);
}
function updateLinePointX(category) {
    if (category.el) {
        const box = category.el.getBoundingClientRect();
        const med = category.el.querySelector(".median");
        if (med) {
            if (category.median !== undefined && category.maxWait !== undefined) {
                med.style.transform = `translateX(${(box.width - 4) * (category.median / category.maxWait)}px)`;
            }
        }
    }
    else {
        throw new Error("Category is missing UI element");
    }
}
function updatePointXY(point, category) {
    if (category.el) {
        const box = category.el.getBoundingClientRect();
        if (point.el) {
            if (point.left !== undefined && point.top !== undefined) {
                point.el.style.transform = `translate(${(box.width - 7.5) * point.left}px, ${(box.height - 7.5) * point.top}px)`;
            }
            else {
                throw new Error("Point is missing top and left properties");
            }
        }
        else {
            throw new Error("Point is missing UI element");
        }
    }
    else {
        throw new Error("Category is missing UI element");
    }
}
function initData(seq) {
    const legend = new Map();
    const legendItems = document.querySelector(".legend-items");
    let totalTimes = 0;
    seq.forEach(s => {
        totalTimes += s.end - s.start;
        const w = Math.floor(100 / (s.categories.length === 0 ? 1 : s.categories.length));
        let waits = [];
        s.categories.forEach(c => {
            var _a;
            if (!legend.has(c.name)) {
                (_a = legendItems) === null || _a === void 0 ? void 0 : _a.appendChild(addLegendItem(c));
                legend.set(c.name, 1);
            }
            c.parent = s;
            c.avgWidth = w;
            c.maxWait = 1;
            c.points.sort((a, b) => ascending(a.wait, b.wait));
            c.median = median(c.points, d => d.wait);
            c.q25 = quantile(c.points, 0.25, d => d.wait);
            c.q50 = quantile(c.points, 0.5, d => d.wait);
            c.q75 = quantile(c.points, 0.75, d => d.wait);
            c.std = deviation(c.points, d => d.wait);
            c.points.forEach(pt => {
                if (c.maxWait !== undefined && pt.wait > c.maxWait) {
                    c.maxWait = pt.wait;
                }
                pt.top = (pt.time - s.start) / (s.end - s.start);
            });
            c.points.forEach(pt => {
                if (c.maxWait !== undefined) {
                    pt.left = pt.wait / c.maxWait;
                    pt.parent = c;
                }
            });
            waits.push(c.maxWait);
        });
        let sum = 0;
        waits.forEach(wt => sum += wt);
        s.avgWait = sum / waits.length;
    });
    seq.forEach(s => {
        var _a;
        s.relHeight = (s.end - s.start) / totalTimes;
        addSequence(s);
        if (s.el !== undefined) {
            (_a = timeline) === null || _a === void 0 ? void 0 : _a.appendChild(s.el);
            s.categories.forEach(c => {
                c.el = addCategory(c, s.avgWait);
                if (s.el !== undefined) {
                    s.el.appendChild(c.el);
                }
            });
        }
    });
    seq.forEach(s => {
        s.categories.forEach(c => {
            addQuantiles(c);
            c.points.forEach(pt => {
                pt.el = addPoint(pt, c);
                if (c.el !== undefined) {
                    c.el.appendChild(pt.el);
                }
            });
        });
    });
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            updatePoints();
        }
    });
    if (timeline) {
        resizeObserver.observe(timeline);
    }
}
initData(data);
(_a = timeline) === null || _a === void 0 ? void 0 : _a.addEventListener("click", timelineclickHandler);
(_b = viewLegendButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", toggleLegendClickHandler);
(_c = closeLegendButton) === null || _c === void 0 ? void 0 : _c.addEventListener("click", toggleLegendClickHandler);
window.addEventListener("resize", updatePoints);
