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
      const r = Math.floor(Math.random() * (max - min + 1) + min);
      return r > max
          ? max
          : r < min
              ? min
              : r;
  }
  function randomTimeInt(min, max, round) {
      let r = Math.floor(Math.random() * (max - min + 1) + min);
      let hh = Math.floor(r / 100), mm = r % 100;
      if (mm > 59) {
          mm = 100 - mm;
          ++hh;
      }
      mm = roundNearest(mm, round);
      if (mm > 59) {
          mm = 0;
      }
      if (hh > 23) {
          hh = 0;
      }
      r = hh * 100 + mm;
      return r > max
          ? max
          : r < min
              ? min
              : r;
  }
  function roundNearest(value, round) {
      round = Math.abs(Math.trunc(round));
      if (round === 0) {
          round = 1;
      }
      return Math.round(value / round) * round;
  }

  /**
   * For demo use
   */
  class DemoData {
      /**
       * Initialise generator
       * @param start - id index to begin at
       */
      constructor(options) {
          this._activeCategories = new Map();
          this._categories = [
              {
                  name: "Late Arrival (LAT)",
                  foreColor: "rgb(248, 80, 108)",
                  backColor: "rgb(248, 156, 171, 0.5)"
              },
              {
                  name: "Cancelled (CAN)",
                  foreColor: "rgb(228, 146, 39)",
                  backColor: "rgba(221, 170, 103, 0.5)"
              },
              {
                  name: "Waiting Height & Weight (WHW)",
                  foreColor: "rgb(41, 113, 247)",
                  backColor: "rgba(100, 149, 237, 0.5)"
              },
              {
                  name: "In consultation (ICO)",
                  foreColor: "rgb(81, 66, 167)",
                  backColor: "rgba(123, 104, 238, 0.5)"
              },
              {
                  name: "In blood room (IBR)",
                  foreColor: "rgb(247, 65, 44)",
                  backColor: "rgba(250, 128, 114, 0.5)"
              },
              {
                  name: "Did not attend (DNA)",
                  foreColor: "rgb(143, 63, 248)",
                  backColor: "rgba(139, 107, 180, 0.5)"
              },
              {
                  name: "Identified by kiosk (KIO)",
                  foreColor: "rgb(17, 141, 59)",
                  backColor: "rgba(17, 141, 59, 0.5)"
              },
              {
                  name: "Waiting for consulation (WCO)",
                  foreColor: "rgb(224, 148, 5)",
                  backColor: "rgba(245, 181, 61, 0.5)"
              },
              {
                  name: "Waiting for blood (WB)",
                  foreColor: "rgb(20, 105, 105)",
                  backColor: "rgba(20, 105, 105, 0.5)"
              },
              {
                  name: "Completed (COM)",
                  foreColor: "rgb(116, 170, 7)",
                  backColor: "rgba(154, 205, 50, 0.5)"
              }
          ];
          this.data = [];
          this.maximumPoints = 25;
          this.maximumTime = 0;
          if (options) {
              if (options.maximumPoints !== undefined) {
                  this.maximumPoints = options.maximumPoints;
              }
          }
      }
      get categories() {
          return Array.from(this._activeCategories.values());
      }
      addRandomCategory(exclude) {
          let i = randomInt(0, this._categories.length - 1);
          let search = true;
          while (search) {
              if (exclude.length === 0 || !exclude.includes(this._categories[i].name)) {
                  search = false;
              }
              else {
                  i = randomInt(0, this._categories.length - 1);
              }
          }
          this._categories[i].points = [];
          let result = {};
          const c = this._categories[i];
          Object.assign(result, c);
          this._activeCategories.set(c.name, {
              backColor: c.backColor,
              foreColor: c.foreColor,
              name: c.name
          });
          return result;
      }
      addRandomSequence() {
          let sequence = {
              id: this.data.length + 1,
              start: randomTimeInt(800, 1000, 30),
              end: randomTimeInt(1700, 2000, 30),
              categories: []
          };
          let categoryCount = randomInt(1, 5);
          let used = [];
          for (let n = 1; n <= categoryCount; n++) {
              let category = this.addRandomCategory(used);
              used.push(category.name);
              let pointCount = randomInt(5, this.maximumPoints);
              category.start = randomTimeInt(sequence.start, sequence.start + 200, 30);
              if (category.start < sequence.start) {
                  throw Error("A category cannot start earlier than its sequence");
              }
              category.end = randomTimeInt(sequence.end - 200, sequence.end, 30);
              if (category.end > sequence.end) {
                  throw Error("A category cannot end later than its sequence");
              }
              for (let n = 1; n <= pointCount; n++) {
                  const pt = {
                      id: category.points.length + 1,
                      time: randomTimeInt(category.start, category.end, 10),
                      wait: randomInt(0, 60)
                  };
                  if (pt.time < category.start || pt.time > category.end) {
                      throw Error("A point cannot start earlier or end later than its category");
                  }
                  category.points.push(pt);
              }
              category.id = sequence.categories.length + 1;
              sequence.categories.push(category);
          }
          this.data.push(sequence);
          this.maximumTime = 0;
          this.data.forEach(s => this.maximumTime += s.end - s.start);
          return this;
      }
      recalc() {
          this.maximumTime = 0;
          this.data.forEach(s => this.maximumTime += s.end - s.start);
          this.data.forEach(s => {
              let waits = [];
              s.categories.forEach((c) => {
                  c.parent = s;
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
                  });
                  c.points.forEach(pt => {
                      if (c.maxWait !== undefined) {
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

  var SlicerModifier;
  (function (SlicerModifier) {
      SlicerModifier[SlicerModifier["NO_KEY"] = 0] = "NO_KEY";
      SlicerModifier[SlicerModifier["CTRL_KEY"] = 1] = "CTRL_KEY";
      SlicerModifier[SlicerModifier["SHIFT_KEY"] = 2] = "SHIFT_KEY";
  })(SlicerModifier || (SlicerModifier = {}));
  class Slicer {
      constructor(list) {
          this._ = new Map();
          this.selected = 0;
          if (list) {
              this.data = list;
          }
      }
      get data() {
          return this._;
      }
      set data(list) {
          if (Array.isArray(list)) {
              list.forEach((item) => {
                  if (!this._.has(item)) {
                      this._.set(item, { filtered: false, selected: false });
                  }
              });
          }
      }
      clear() {
          this._.forEach((_, key) => {
              this._.set(key, { filtered: false, selected: false });
          });
          this.selected = 0;
          this.lastSelection = undefined;
          return this;
      }
      toggle(item, modifier = SlicerModifier.NO_KEY) {
          if (modifier === SlicerModifier.SHIFT_KEY) {
              return this.toggleRange(item);
          }
          else if (modifier === SlicerModifier.CTRL_KEY) {
              return this.toggleCumulative(item);
          }
          else {
              return this.toggleSingle(item);
          }
      }
      toggleCumulative(key) {
          const state = this._.get(key);
          if (state) {
              state.selected = !state.selected;
              if (state.selected) {
                  ++this.selected;
              }
              else {
                  --this.selected;
              }
              this._.set(key, state);
          }
          if (this.selected < 1) {
              this.clear();
          }
          else {
              this._.forEach((value, key) => {
                  value.filtered = !value.selected;
                  this._.set(key, value);
              });
              this.lastSelection = key;
          }
          return this;
      }
      toggleRange(item) {
          if (item === this.lastSelection) {
              this.clear();
          }
          else {
              let state = 0;
              this.selected = 0;
              this._.forEach((value, key) => {
                  if (state === 1) {
                      if (item === key || this.lastSelection === key) {
                          state = -1;
                      }
                      value = { filtered: false, selected: true };
                      ++this.selected;
                  }
                  else if (state === 0) {
                      if (item === key || this.lastSelection === key) {
                          state = 1;
                          value = { filtered: false, selected: true };
                          ++this.selected;
                      }
                      else {
                          value = { filtered: true, selected: false };
                      }
                  }
                  else {
                      value = { filtered: true, selected: false };
                  }
                  this._.set(key, value);
              });
              this.lastSelection = item;
              if (this.selected === 0) {
                  this._.forEach((value, key) => {
                      value = { filtered: true, selected: false };
                      this._.set(key, value);
                  });
              }
          }
          return this;
      }
      toggleSingle(item) {
          const state = this._.get(item);
          if (state) {
              if (state.selected) {
                  this.clear();
              }
              else {
                  this._.forEach((value, key) => {
                      if (item === key) {
                          value.selected = !value.selected;
                          value.filtered = !value.selected;
                      }
                      else {
                          value = { filtered: true, selected: false };
                      }
                      this._.set(key, value);
                  });
                  this.selected = 1;
                  this.lastSelection = item;
              }
          }
          return this;
      }
  }

  /**
   * DOM helper for selecting a node
   * @param container - this can be a DOM node or standard CSS selector string
   */
  function select(container) {
      let el;
      if (typeof container === "string") {
          el = document.getElementById(container);
          if (el === null) {
              el = document.querySelector(container);
          }
          if (el === null) {
              throw new Error("Failed to resolve parent container");
          }
      }
      else {
          el = container;
      }
      return el;
  }

  class Control {
      constructor(selector) {
          this.element = select(selector);
      }
      get visible() {
          return !this.element.classList.contains("hidden");
      }
      set visible(state) {
          state
              ? this.element.classList.remove("hidden")
              : this.element.classList.add("hidden");
      }
      hide() {
          this.visible = false;
          return this;
      }
      /**
       * Responds to indirect events
       * @param eventName - DOM event name
       * @param cb - function to call
       */
      indirect(eventName, cb) {
          window.addEventListener(eventName, (event) => cb.call(this, event));
          return this;
      }
      /**
       * Responds to direct events
       * @param eventName - DOM event name
       * @param cb - function to call
       */
      direct(eventName, cb) {
          this.element.addEventListener(eventName, (event) => cb.call(this, event));
          return this;
      }
      show() {
          this.visible = true;
          return this;
      }
      toggle() {
          this.visible ? this.hide() : this.show();
          return this;
      }
  }

  class Legend extends Control {
      constructor(selector) {
          super(selector);
          this.filterOn = false;
          this._ = [];
          this._slicer = new Slicer();
          this.element = document.createElement("div");
          this.element.classList.add("legend", "hidden");
          select(selector).appendChild(this.element);
          const menu = document.createElement("div");
          menu.classList.add("menu-legend");
          this.element.appendChild(menu);
          this.btnFilter = document.createElement("div");
          this.btnFilter.classList.add("filter-legend", "menu-item", "hidden");
          this.btnFilter.textContent = "clear filter";
          this.btnFilter.addEventListener("click", () => this.clear());
          menu.appendChild(this.btnFilter);
          this.btnClose = document.createElement("div");
          this.btnClose.classList.add("close-legend", "menu-item");
          this.btnClose.textContent = "close";
          this.btnClose.addEventListener("click", () => this.toggle());
          menu.appendChild(this.btnClose);
          this.title = document.createElement("h3");
          this.title.textContent = "Categories";
          this.element.appendChild(this.title);
          const items = document.createElement("div");
          items.classList.add("legend-items");
          this.element.appendChild(items);
      }
      /**
       * Clear any filtered legend items
       */
      clear() {
          this._slicer.clear();
          Array.from(this.element.querySelectorAll(".filtered"))
              .forEach(el => el.classList.remove("filtered"));
          this.btnFilter.classList.add("hidden");
          window.dispatchEvent(new CustomEvent("legend-filter-clear", { detail: [] }));
          return this;
      }
      /**
       * Populates the legend with categories
       * @param data - list of sequences
       */
      data(data) {
          this._ = data;
          this._slicer.data = this._.map(d => d.name);
          return this;
      }
      /**
       * Draws the legend items
       */
      draw() {
          this._.forEach((item) => {
              if (document.querySelector(`[data-label="${item.name}"]`) === null) {
                  const el = this._addItem(item.name, item.foreColor, item.backColor);
                  if (this.filterOn) {
                      el.classList.add("filtered");
                  }
              }
          });
          return this;
      }
      /**
       * Handles the click event on legend items
       */
      handleClick(e) {
          const key = e.target.dataset.label || "";
          const m = e.ctrlKey ? SlicerModifier.CTRL_KEY : e.shiftKey ? SlicerModifier.SHIFT_KEY : SlicerModifier.NO_KEY;
          this._slicer.toggle(key, m);
          this.state();
      }
      hide() {
          super.hide();
          window.dispatchEvent(new CustomEvent("legend-hidden"));
          return this;
      }
      show() {
          super.show();
          window.dispatchEvent(new CustomEvent("legend-visible"));
          return this;
      }
      state() {
          this.filterOn = this._slicer.selected === 0 ? false : true;
          this.filterOn
              ? this.btnFilter.classList.remove("hidden")
              : this.btnFilter.classList.add("hidden");
          const filters = [];
          this._slicer.data.forEach((state, key) => {
              const el = document.querySelector(`[data-label="${key}"]`);
              if (el) {
                  if (state.filtered) {
                      el.classList.add("filtered");
                  }
                  else {
                      el.classList.remove("filtered");
                  }
              }
              if (state.selected) {
                  filters.push(key);
              }
          });
          const eventName = this.filterOn ? "legend-filter" : "legend-filter-clear";
          window.dispatchEvent(new CustomEvent(eventName, { detail: filters }));
          return this;
      }
      toggle() {
          super.toggle();
          return this;
      }
      _addItem(label, foreColor, backColor) {
          const li = document.createElement("div");
          li.classList.add("legend-item");
          li.style.backgroundColor = backColor;
          li.style.borderColor = foreColor;
          li.textContent = label;
          li.dataset.label = label;
          li.addEventListener("click", e => this.handleClick(e));
          this.element.querySelector(".legend-items")
              .appendChild(li);
          return li;
      }
  }
  function createLegend(container) {
      return new Legend(container);
  }

  /**
   * Returns number as hh:mm string
   * @param value - number should conform to hhmm expectations
   */
  function numberToTime(value) {
      let t = ("0" + value.toString()).slice(-4);
      return t.slice(0, 2) + ":" + t.slice(-2);
  }

  /**
   * Container for holding inspector window-related actions and events
   */
  class Inspector extends Control {
      constructor(selector) {
          super(selector);
          this.element = document.createElement("div");
          this.element.classList.add("objExplorer", "inspector", "hidden");
          select(selector).appendChild(this.element);
          const badge = document.createElement("div");
          badge.classList.add("badge");
          this.element.appendChild(badge);
          const wrapper = document.createElement("div");
          wrapper.classList.add("wrapper");
          this.element.appendChild(wrapper);
          const menu = document.createElement("div");
          menu.classList.add("menu-inspector");
          wrapper.appendChild(menu);
          this.btnClose = document.createElement("div");
          this.btnClose.classList.add("close-inspector", "menu-item");
          this.btnClose.textContent = "close";
          this.btnClose.addEventListener("click", () => this.toggle());
          menu.appendChild(this.btnClose);
          const content = document.createElement("div");
          content.classList.add("content");
          wrapper.appendChild(content);
      }
      /**
       * Draws the inspector content
       */
      draw(d) {
          const badge = this.element.querySelector(".badge");
          const content = this.element.querySelector(".content");
          let message = "Nothing selected";
          if (d !== undefined) {
              if (d.time !== undefined) {
                  message = `These appointments are categorised as <b>${d.parent.name}</b>.<br>You selected a booking scheduled for ${numberToTime(d.time)}. The waiting time until seen was ${d.wait} minutes.`;
                  badge.style.backgroundColor = d.el.style.borderColor;
              }
              else if (d.maxWait !== undefined) {
                  message = `<b>${d.name}</b><br>The opening times are ${numberToTime(d.start)} to ${numberToTime(d.end)}<br>
        The longest waiting time was ${d.maxWait} miuntes. The median is ${d.stat.median} minutes.`;
                  badge.style.backgroundColor = d.el.style.backgroundColor;
              }
              else if (d.avgWait !== undefined) {
                  message = `This activity starts from ${numberToTime(d.start)} and ends at ${numberToTime(d.end)}. The average waiting time was ${Math.floor(d.avgWait)} minutes`;
                  badge.style.backgroundColor = "#eee";
              }
          }
          content.innerHTML = message;
          return this;
      }
      hide() {
          super.hide();
          window.dispatchEvent(new CustomEvent("inspector-hidden"));
          return this;
      }
      show() {
          super.show();
          window.dispatchEvent(new CustomEvent("inspector-visible"));
          return this;
      }
      /**
       * Show/hide inspector
       */
      toggle() {
          super.toggle();
          return this;
      }
  }
  function createInspector(container) {
      return new Inspector(container);
  }

  /**
   * Sequences are collections of activity, spanning across the view for a given time frame
   */
  class Sequence {
      constructor(options) {
          this._data = { categories: [], end: 0, start: 0 };
          this.maximumTime = options.maximumTime !== undefined ? options.maximumTime : 0;
      }
      data(d) {
          if (d) {
              this._data = d;
              return this;
          }
          return this._data;
      }
      /**
       * Once drawn, each sequence item holds the DOM object connected to it
       * @param container
       */
      draw(container) {
          this._data.relHeight = (this._data.end - this._data.start) / this.maximumTime;
          if (!this._data.el) {
              this._data.el = document.createElement("div");
              this._data.el.classList.add("sequence");
              container.appendChild(this._data.el);
              this._data.el.addEventListener("click", (e) => {
                  var _a, _b, _c, _d;
                  e.stopPropagation();
                  const eventName = ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) ? "sequence-unselect" : "sequence-select";
                  if (eventName === "sequence-unselect") {
                      (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
                  }
                  dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
              });
          }
          this._data.el.style.height = `${this._data.relHeight * 100}%`;
          this._data.el.title = `Start: ${numberToTime(this._data.start)} End: ${numberToTime(this._data.end)}`;
          return this;
      }
  }

  /**
   * Categories are the colored ranges acting as containers for events
   */
  class Category {
      constructor(options) {
          this._data = { backColor: "#000", end: 0, foreColor: "#fff", name: "Unnamed", points: [], start: 0 };
          this._observer = new ResizeObserver(() => Category.updateMedianXY(this._data));
          this.neighborCount = options.neighborCount !== undefined ? options.neighborCount : 0;
      }
      /**
       * Returns true if category is selected
       */
      get selected() {
          var _a, _b;
          return ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) || false;
      }
      data(d) {
          if (d) {
              this._data = d;
              return this;
          }
          return this._data;
      }
      /**
       * Removes selection from category
       */
      deselect() {
          var _a, _b;
          (_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.remove("highlight");
          return this;
      }
      /**
       * Once drawn, each sequence item holds the DOM object connected to it
       * @param container
       */
      draw(container) {
          var _a;
          const w = Math.floor(100 / (this.neighborCount === 0 ? 1 : this.neighborCount));
          if (!this._data.el) {
              this._data.el = document.createElement("div");
              this._data.el.classList.add("category");
              this._data.el.dataset.category = this._data.name;
              container.appendChild(this._data.el);
          }
          this._data.el.title = `${this._data.name}\nOpening times: ${numberToTime(this._data.start)}-${numberToTime(this._data.end)}\nMax waiting time (min): ${this._data.maxWait}`;
          this._data.el.style.backgroundColor = this._data.backColor;
          this._data.el.style.borderColor = this._data.foreColor;
          this._data.el.addEventListener("click", (e) => {
              e.stopPropagation();
              const eventName = this.selected ? "category-unselect" : "category-select";
              if (eventName === "category-unselect") {
                  this.deselect();
              }
              dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
          });
          if (this._data && this._data.parent) {
              const rel = (this._data.end - this._data.start) / (this._data.parent.end - this._data.parent.start);
              this._data.el.style.height = `${Math.floor(99.5 * rel)}%`;
              const y = (this._data.start - this._data.parent.start) / (this._data.parent.end - this._data.parent.start);
              this._data.el.style.transform = `translate(0, ${Math.floor(100 * y)}%)`;
              if (this._data.maxWait && this._data.parent.avgWait !== undefined) {
                  this._data.el.style.flexBasis = `${w * (this._data.maxWait / this._data.parent.avgWait)}%`;
              }
              else {
                  throw new Error("Category is missing average width and maximum waiting times");
              }
              this._addQuantiles();
          }
          this._observer.observe((_a = this._data.el) === null || _a === void 0 ? void 0 : _a.parentNode);
          return this;
      }
      _addQuantiles() {
          var _a;
          if (this._data.el) {
              let med = this._data.el.querySelector(".median");
              if (med === null) {
                  med = document.createElement("div");
                  med.classList.add("median");
                  med.textContent = "";
                  med.style.backgroundColor = this._data.backColor;
                  med.style.borderColor = this._data.foreColor;
                  this._data.el.appendChild(med);
              }
              med.title = `Median is ${(_a = this._data.stat) === null || _a === void 0 ? void 0 : _a.median} minutes`;
              Category.updateMedianXY(this._data);
          }
      }
      static updateMedianXY(d) {
          var _a, _b, _c;
          const box = (_a = d.el) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
          const med = (_b = d.el) === null || _b === void 0 ? void 0 : _b.querySelector(".median");
          if (med) {
              if (((_c = d.stat) === null || _c === void 0 ? void 0 : _c.median) && d.maxWait !== undefined) {
                  med.style.transform = `translateX(${(box.width - 4) * (d.stat.median / d.maxWait)}px)`;
              }
          }
      }
  }

  /**
   * Points are individual data items occuring within categories
   */
  class Point {
      /**
       * Watch for view size changes and re-align points if needed
       */
      constructor() {
          this._data = { time: 0, wait: 0 };
          this._observer = new ResizeObserver(() => Point.updateXY(this._data));
          window.addEventListener("category-select", () => {
              var _a, _b, _c, _d, _e, _f, _g, _h;
              if ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) {
                  (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
              }
              if ((_f = (_e = this._data) === null || _e === void 0 ? void 0 : _e.el) === null || _f === void 0 ? void 0 : _f.classList.contains("filtered")) {
                  (_h = (_g = this._data) === null || _g === void 0 ? void 0 : _g.el) === null || _h === void 0 ? void 0 : _h.classList.remove("filtered");
              }
          });
          window.addEventListener("sequence-select", () => {
              var _a, _b, _c, _d, _e, _f, _g, _h;
              if ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) {
                  (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
              }
              if ((_f = (_e = this._data) === null || _e === void 0 ? void 0 : _e.el) === null || _f === void 0 ? void 0 : _f.classList.contains("filtered")) {
                  (_h = (_g = this._data) === null || _g === void 0 ? void 0 : _g.el) === null || _h === void 0 ? void 0 : _h.classList.remove("filtered");
              }
          });
      }
      data(d) {
          if (d) {
              this._data = d;
              return this;
          }
          return this._data;
      }
      /**
       * Once drawn, each point item holds the DOM object connected to it
       * @param container
       */
      draw(container) {
          var _a;
          if (!this._data.el) {
              this._data.el = document.createElement("div");
              this._data.el.classList.add("pt");
              this._data.el.addEventListener("click", e => {
                  var _a, _b;
                  e.stopPropagation();
                  if ((_a = this._data) === null || _a === void 0 ? void 0 : _a.el) {
                      const eventName = this._data.el.classList.contains("highlight") ? "point-unselect" : "point-select";
                      const points = (_b = this._data.el.parentNode) === null || _b === void 0 ? void 0 : _b.querySelectorAll(".pt");
                      if (points) {
                          if (eventName === "point-unselect") {
                              Array.from(points).forEach(pt => pt.classList.remove("filtered", "highlight"));
                          }
                          else {
                              Array.from(points).forEach(pt => {
                                  pt.classList.remove("filtered", "highlight");
                                  if (pt === this._data.el) {
                                      pt.classList.add("highlight");
                                  }
                                  else {
                                      pt.classList.add("filtered");
                                  }
                              });
                          }
                          dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
                      }
                  }
              });
              container.appendChild(this._data.el);
          }
          this._data.el.style.backgroundColor = container.style.backgroundColor;
          this._data.el.style.borderColor = container.style.borderColor;
          this._data.el.title = `Appointment time: ${numberToTime(this._data.time)}\nWaiting time (min): ${this._data.wait}`;
          Point.updateXY(this._data);
          this._observer.observe((_a = this._data.el) === null || _a === void 0 ? void 0 : _a.parentNode);
          return this;
      }
      /**
       * Adjusts point positions in view
       * @param point - Point to set view position
       */
      static updateXY(point) {
          var _a;
          if (point && point.parent && point.el) {
              const box = (_a = point.parent.el) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
              if (point.parent && point.parent.maxWait) {
                  const x = point.wait / point.parent.maxWait;
                  const y = (point.time - point.parent.start) / (point.parent.end - point.parent.start);
                  point.el.style.transform = `translate(${(box.width - 7.5) * x}px, ${(box.height - 7.5) * y}px)`;
              }
          }
      }
  }

  /**
   * Container for holding button-related actions and events
   */
  class Button extends Control {
      constructor(selector) {
          super(selector);
      }
  }
  function createButton(selector) {
      return new Button(selector);
  }

  const demo = new DemoData();
  demo.addRandomSequence()
      .addRandomSequence()
      .addRandomSequence()
      .recalc();
  const legend = createLegend(".container");
  legend.data(demo.categories).draw();
  const inspector = createInspector(".container");
  inspector
      .indirect("point-select", (e) => inspector.draw(e.detail).show())
      .indirect("category-select", (e) => inspector.draw(e.detail).show())
      .indirect("sequence-select", (e) => inspector.draw(e.detail).show())
      .indirect("point-unselect", () => inspector.hide())
      .indirect("category-unselect", () => inspector.hide())
      .indirect("sequence-unselect", () => inspector.hide());
  const timeline = document.querySelector(".timeline");
  let sequences = linkData(demo.data);
  drawSequences(sequences, timeline);
  const btnLegend = createButton("btnShowLegend");
  btnLegend.direct("click", () => legend.toggle())
      .indirect("legend-visible", () => btnLegend.hide())
      .indirect("legend-hidden", () => btnLegend.show())
      .indirect("legend-filter-clear", () => {
      Array.from(document.querySelectorAll(".category.disabled"))
          .forEach(e => e.classList.remove("disabled", "filtered"));
  })
      .indirect("legend-filter", (event) => {
      const list = event.detail;
      if (list.length > 1) {
          Array.from(document.querySelectorAll(".category"))
              .forEach(e => e.classList.add("disabled", "filtered"));
          list.forEach((item) => {
              Array.from(document.querySelectorAll(".category"))
                  .forEach((e) => {
                  const c = e.dataset.category || "";
                  if (c === item) {
                      e.classList.remove("disabled", "filtered");
                  }
              });
          });
      }
      else {
          Array.from(document.querySelectorAll(".category.disabled"))
              .forEach(e => e.classList.remove("disabled", "filtered"));
          list.forEach((item) => {
              Array.from(document.querySelectorAll(".category"))
                  .forEach((e) => {
                  const c = e.dataset.category || "";
                  if (c !== item) {
                      e.classList.add("disabled", "filtered");
                  }
              });
          });
      }
  });
  createButton("btnAddData").direct("click", () => {
      demo.addRandomSequence().recalc();
      sequences = linkData(demo.data, sequences);
      drawSequences(sequences, timeline);
      legend.data(demo.categories).state().draw();
  });
  /**
   * Iterates over demo data and updates the sequences array
   * @param data - data array
   * @param sequences - array of Sequence objects
   */
  function linkData(data, sequences) {
      if (sequences === undefined) {
          sequences = [];
      }
      data.forEach((seq, n) => {
          var _a, _b;
          if (!seq.el) {
              let s = new Sequence({ maximumTime: demo.maximumTime });
              s.data(seq);
              (_a = sequences) === null || _a === void 0 ? void 0 : _a.push(s);
          }
          else {
              if (sequences && sequences[n]) {
                  (_b = sequences[n]) === null || _b === void 0 ? void 0 : _b.data(seq);
              }
          }
      });
      return sequences;
  }
  /**
   * Re/draws the DOM elements
   * @param sequences - array of sequences
   * @param container - parent element of graphic
   */
  function drawSequences(sequences, container) {
      sequences.forEach((seq) => { seq.draw(container); });
      sequences.forEach((seq) => {
          const d = seq.data();
          const nc = d.categories.length;
          d.categories.forEach((cat) => {
              const c = new Category({ neighborCount: nc });
              c.data(cat).draw(d.el);
              const cd = c.data();
              cd.points.forEach((pt) => {
                  const p = new Point();
                  p.data(pt).draw(cd.el);
              });
          });
      });
  }

}());
