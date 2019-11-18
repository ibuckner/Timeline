(function () {
  'use strict';

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

  function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  }

  class Point {
      constructor() {
      }
      static random() {
          const result = {
              time: 0,
              wait: randomInt(1, 60)
          };
          return result;
      }
  }

  class Category {
      constructor() {
      }
      data() {
          return this;
      }
      draw() {
          return this;
      }
      static random(exclude) {
          const temp = [];
          Category._categories.forEach(c => {
              if (!exclude.includes(c.name)) {
                  temp.push(c);
              }
          });
          const categoryCount = temp.length;
          const index = randomInt(1, categoryCount) - 1;
          const category = temp[index];
          return category;
      }
  }
  Category._categories = [
      {
          name: "Late Arrival (LAT)",
          foreColor: "rgb(248, 80, 108)",
          backColor: "rgb(248, 156, 171, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Cancelled (CAN)",
          foreColor: "rgb(228, 146, 39)",
          backColor: "rgba(221, 170, 103, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Waiting Height & Weight (WHW)",
          foreColor: "rgb(41, 113, 247)",
          backColor: "rgba(100, 149, 237, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "In consultation (ICO)",
          foreColor: "rgb(81, 66, 167)",
          backColor: "rgba(123, 104, 238, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "In blood room (IBR)",
          foreColor: "rgb(247, 65, 44)",
          backColor: "rgba(250, 128, 114, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Did not attend (DNA)",
          foreColor: "rgb(143, 63, 248)",
          backColor: "rgba(139, 107, 180, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Identified by kiosk (KIO)",
          foreColor: "rgb(17, 141, 59)",
          backColor: "rgba(17, 141, 59, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Waiting for consulation (WCO)",
          foreColor: "rgb(224, 148, 5)",
          backColor: "rgba(245, 181, 61, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Waiting for blood (WB)",
          foreColor: "rgb(20, 105, 105)",
          backColor: "rgba(20, 105, 105, 0.75)",
          points: [],
          start: 0,
          end: 2300
      },
      {
          name: "Completed (COM)",
          foreColor: "rgb(116, 170, 7)",
          backColor: "rgba(154, 205, 50, 0.75)",
          points: [],
          start: 0,
          end: 2300
      }
  ];

  class DemoData {
      constructor(start, options) {
          this.data = [];
          this.maximumPoints = 25;
          this._seqId = start;
          if (options) {
              if (options.maximumPoints !== undefined) {
                  this.maximumPoints = options.maximumPoints;
              }
          }
      }
      addRandomSequence() {
          const sequence = {
              id: this._seqId++,
              start: 0,
              end: 2300,
              categories: []
          };
          const categoryCount = randomInt(1, 5);
          const used = [];
          for (let n = 1; n <= categoryCount; n++) {
              const category = Category.random(used);
              used.push(category.name);
              const pointCount = randomInt(5, this.maximumPoints);
              for (let n = 1; n <= pointCount; n++) {
                  category.points.push(Point.random());
              }
              sequence.categories.push(category);
          }
          this.data.push(sequence);
          return this;
      }
      recalc() {
          this.data.forEach(s => {
              const w = Math.floor(100 / (s.categories.length === 0 ? 1 : s.categories.length));
              let waits = [];
              s.categories.forEach((c) => {
                  c.parent = s;
                  c.avgWidth = w;
                  c.maxWait = 1;
                  c.points.sort((a, b) => ascending(a.wait, b.wait));
                  c.stat = {};
                  if (c.stat) {
                      c.stat.median = median(c.points, d => d.wait);
                      c.stat.q25 = quantile(c.points, 0.25, d => d.wait);
                      c.stat.q50 = quantile(c.points, 0.5, d => d.wait);
                      c.stat.q75 = quantile(c.points, 0.75, d => d.wait);
                      c.stat.std = deviation(c.points, d => d.wait);
                  }
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
          return this;
      }
  }

  function numberToTime(value) {
      let t = ("0" + value.toString()).slice(-4);
      return t.slice(0, 2) + ":" + t.slice(-2);
  }

  class Legend {
      constructor(container) {
          this._legendMap = new Map();
          this.element = document.createElement("div");
          this.element.classList.add("legend", "hidden");
          container.appendChild(this.element);
          this.btnClose = document.createElement("div");
          this.btnClose.classList.add("close-legend");
          this.btnClose.textContent = "close";
          this.btnClose.addEventListener("click", () => this.toggle);
          this.element.appendChild(this.btnClose);
          this.title = document.createElement("h3");
          this.title.textContent = "Categories";
          this.element.appendChild(this.title);
          this.items = document.createElement("div");
          this.items.classList.add("legend-items");
          this.element.appendChild(this.items);
      }
      get visible() {
          return !this.element.classList.contains("hidden");
      }
      addItem(label, foreColor, backColor) {
          const li = document.createElement("div");
          li.classList.add("legend-item");
          li.style.backgroundColor = backColor;
          li.style.borderColor = foreColor;
          li.textContent = label;
          this.items.appendChild(li);
      }
      hide() {
          this.element.classList.add("hidden");
          window.dispatchEvent(new CustomEvent("legend-hidden"));
      }
      populate(sequences) {
          sequences.forEach((s) => {
              s.categories.forEach((c) => {
                  if (!this._legendMap.has(c.name)) {
                      this.addItem(c.name, c.foreColor, c.backColor);
                      this._legendMap.set(c.name, true);
                  }
              });
          });
      }
      show() {
          this.element.classList.remove("hidden");
          window.dispatchEvent(new CustomEvent("legend-visible"));
      }
      toggle() {
          this.visible ? this.hide() : this.show();
      }
  }

  class Sequence {
      constructor() {
          this._data = [];
      }
      data(d) {
          this._data = d;
          return this;
      }
      draw(container) {
          let totalTimes = 0;
          this._data.forEach(s => totalTimes += s.end - s.start);
          this._data.forEach(s => {
              s.relHeight = (s.end - s.start) / totalTimes;
              s.el = document.createElement("div");
              s.el.classList.add("sequence", "hidden");
              s.el.style.height = `${s.relHeight * 100}%`;
              container.appendChild(s.el);
              s.categories.forEach(c => {
                  const cat = new Category();
                  cat.data()
                      .draw();
              });
          });
          return this;
      }
  }

  var _a, _b, _c;
  const demo = new DemoData(1);
  demo.addRandomSequence()
      .addRandomSequence()
      .addRandomSequence()
      .addRandomSequence()
      .addRandomSequence()
      .recalc();
  const container = document.querySelector(".container");
  const legend = new Legend(container);
  legend.populate(demo.data);
  const timeline = document.querySelector(".timeline");
  const sequence = new Sequence();
  sequence
      .data(demo.data)
      .draw(timeline);
  let activePoint;
  const objExplorer = document.querySelector(".object");
  const btnViewLegend = document.getElementById("btnShowLegend");
  const btnUpdateTimeline = document.getElementById("btnUpdateTimeline");
  let resizeTimer;
  function timelineclickHandler(_) {
      togglePointSelection(activePoint);
      activePoint = undefined;
      toggleObjectExplorer();
      if (legend.visible) {
          legend.hide();
      }
  }
  window.addEventListener("legend-visible", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.add("hidden"); });
  window.addEventListener("legend-hidden", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden"); });
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
  function toggleObjectExplorer(feature) {
      var _a, _b, _c, _d, _e;
      if (objExplorer) {
          if (feature) {
              objExplorer.classList.remove("hidden");
              const heading = (_a = objExplorer) === null || _a === void 0 ? void 0 : _a.querySelector("h3");
              if (feature.points) {
                  if (heading) {
                      heading.textContent = `${feature.name}`;
                  }
                  const content = objExplorer.querySelector(".content");
                  if (content && feature.parent) {
                      content.innerHTML = `<div>The opening times are ${numberToTime((_b = feature.parent) === null || _b === void 0 ? void 0 : _b.start)} to ${numberToTime((_c = feature.parent) === null || _c === void 0 ? void 0 : _c.end)}</div>`;
                  }
              }
              else {
                  const category = feature.parent;
                  if (category) {
                      if (heading) {
                          heading.textContent = `Appointment for ${category.name}`;
                      }
                      const content = objExplorer.querySelector(".content");
                      if (content && category.parent) {
                          content.innerHTML = `<div>The opening times are ${numberToTime((_d = category.parent) === null || _d === void 0 ? void 0 : _d.start)} to ${numberToTime((_e = category.parent) === null || _e === void 0 ? void 0 : _e.end)}</div>`;
                          content.innerHTML += `<div>The appointment was scheduled at ${numberToTime(feature.time)} and the point waited approx. ${feature.wait} minute${feature.wait > 1 ? "s" : ""}.</div>`;
                      }
                  }
              }
          }
          else {
              objExplorer.classList.add("hidden");
          }
      }
  }
  function updateTimelineClickHandler(e) {
      const btn = e.target;
      btn.classList.add("hidden");
      setTimeout(() => btn.classList.remove("hidden"), 2000);
  }
  function updatePoints() {
      if (resizeTimer) {
          clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
      }, 350);
  }
  (_a = timeline) === null || _a === void 0 ? void 0 : _a.addEventListener("click", timelineclickHandler);
  (_b = btnViewLegend) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => legend.toggle());
  (_c = btnUpdateTimeline) === null || _c === void 0 ? void 0 : _c.addEventListener("click", updateTimelineClickHandler);
  window.addEventListener("resize", updatePoints);

}());
