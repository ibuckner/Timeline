function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
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

class DemoData {
    /**
     * Initialise generator
     * @param start - id index to begin at
     */
    constructor(options) {
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
        Object.assign(result, this._categories[i]);
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
                /*c.stat = {};
                if (c.stat) {
                  c.stat.median = median(c.points, d => d.wait);
                  c.stat.q25 = quantile(c.points, 0.25, d => d.wait);
                  c.stat.q50 = quantile(c.points, 0.5, d => d.wait);
                  c.stat.q75 = quantile(c.points, 0.75, d => d.wait);
                  c.stat.std = deviation(c.points, d => d.wait);
                }*/
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

class Slicer {
    constructor(list) {
        this._ = new Map();
        if (list) {
            this.data = list;
        }
    }
    get data() {
        return this._;
    }
    set data(list) {
        if (Array.isArray(list)) {
            this._.clear();
            list.forEach((item) => {
                this._.set(item, { filtered: false, selected: false });
            });
        }
    }
    clear() {
        this._.forEach((_, key) => {
            this._.set(key, { filtered: false, selected: false });
        });
        return this;
    }
    toggle(item, ctrlKey = false) {
        this._.forEach((value, key) => {
            if (item !== key) {
                value.selected = ctrlKey ? value.selected : false;
                value.filtered = ctrlKey ? false : true;
            }
            else {
                if (value.selected) {
                    value.selected = false;
                    value.filtered = false;
                }
                else {
                    value.selected = !value.selected;
                    value.filtered = !value.selected;
                }
            }
            this._.set(key, value);
        });
        const selectionList = [];
        let filtered = 0;
        this._.forEach((value, key) => {
            if (value.selected) {
                selectionList.push(key);
            }
            if (value.filtered) {
                ++filtered;
            }
        });
        if (filtered === this._.size ||
            selectionList.length === 0 ||
            selectionList.length === this._.size) {
            this.clear();
        }
        else if (selectionList.length > 0 && filtered === 0) {
            this._.forEach((value, key) => {
                value.filtered = !value.selected;
                this._.set(key, value);
            });
        }
        return this;
    }
}

class Legend {
    constructor(container) {
        this._legendMap = new Map();
        this._slicer = new Slicer();
        this.element = document.createElement("div");
        this.element.classList.add("legend", "hidden");
        container.appendChild(this.element);
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
    get visible() {
        return !this.element.classList.contains("hidden");
    }
    /**
     * Clear any filtered legend items
     */
    clear() {
        this._slicer.clear();
        Array.from(this.element.querySelectorAll(".filtered"))
            .forEach(el => el.classList.remove("filtered"));
        this.btnFilter.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("legend-filter", { detail: [] }));
        return this;
    }
    /**
     * Populates the legend with categories
     * @param data - list of categories
     */
    data(data) {
        const labels = [];
        data.forEach((s) => {
            s.categories.forEach((c) => {
                if (!this._legendMap.has(c.name)) {
                    labels.push(c.name);
                    this._legendMap.set(c.name, {
                        backColor: c.backColor,
                        foreColor: c.foreColor,
                        name: c.name
                    });
                }
            });
        });
        this._slicer.data = labels;
        return this;
    }
    /**
     * Draws the legend items
     */
    draw() {
        this.element.querySelector(".legend-items").innerHTML = "";
        this._legendMap.forEach((item) => {
            item.el = this._addItem(item.name, item.foreColor, item.backColor);
            this._legendMap.set(item.name, item);
        });
    }
    /**
     * Handles the click event on legend items
     */
    handleClick(e) {
        const key = e.target.textContent || "";
        const clicked = this._legendMap.get(key);
        if (clicked) {
            this._slicer.toggle(clicked.name, e.ctrlKey);
        }
        const selectionList = [];
        this.btnFilter.classList.add("hidden");
        this._slicer.data.forEach((value, key) => {
            var _a, _b, _c, _d;
            const item = this._legendMap.get(key);
            if (value.selected) {
                selectionList.push(key);
            }
            if (value.filtered) {
                (_b = (_a = item) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.add("filtered");
                this.btnFilter.classList.remove("hidden");
            }
            else {
                (_d = (_c = item) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("filtered");
            }
        });
        window.dispatchEvent(new CustomEvent("legend-filter", { detail: selectionList }));
    }
    /**
     * Hide legend
     */
    hide() {
        this.element.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("legend-hidden"));
    }
    /**
     * Display legend
     */
    show() {
        this.element.classList.remove("hidden");
        window.dispatchEvent(new CustomEvent("legend-visible"));
    }
    /**
     * Show/hide legend
     */
    toggle() {
        this.visible ? this.hide() : this.show();
    }
    _addItem(label, foreColor, backColor) {
        const li = document.createElement("div");
        li.classList.add("legend-item");
        li.style.backgroundColor = backColor;
        li.style.borderColor = foreColor;
        li.textContent = label;
        li.addEventListener("click", e => this.handleClick(e));
        this.element.querySelector(".legend-items")
            .appendChild(li);
        return li;
    }
}

/**
 * Returns number as hh:mm
 * @param value - number should conform to hhmm expectations
 */
function numberToTime(value) {
    let t = ("0" + value.toString()).slice(-4);
    return t.slice(0, 2) + ":" + t.slice(-2);
}

class Inspector {
    constructor(container) {
        this.element = document.createElement("div");
        this.element.classList.add("objExplorer", "inspector", "hidden");
        container.appendChild(this.element);
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
        window.addEventListener("point-select", (e) => this.draw(e.detail).show());
        window.addEventListener("category-select", (e) => this.draw(e.detail).show());
        window.addEventListener("sequence-select", (e) => this.draw(e.detail).show());
        window.addEventListener("point-unselect", () => this.hide());
        window.addEventListener("category-unselect", () => this.hide());
        window.addEventListener("sequence-unselect", () => this.hide());
    }
    get visible() {
        return !this.element.classList.contains("hidden");
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
                message = `<b>${d.name}</b><br>The opening times are ${numberToTime(d.start)} to ${numberToTime(d.end)}<br>The longest waiting time was ${d.maxWait} miuntes.`;
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
    /**
     * Hide inspector
     */
    hide() {
        this.element.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("inspector-hidden"));
    }
    /**
     * Display inspector
     */
    show() {
        this.element.classList.remove("hidden");
        window.dispatchEvent(new CustomEvent("inspector-visible"));
    }
    /**
     * Show/hide inspector
     */
    toggle() {
        this.visible ? this.hide() : this.show();
    }
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

class Category {
    constructor(options) {
        this._data = { backColor: "#000", end: 0, foreColor: "#fff", name: "Unnamed", points: [], start: 0 };
        this.neighborCount = options.neighborCount !== undefined ? options.neighborCount : 0;
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
        const w = Math.floor(100 / (this.neighborCount === 0 ? 1 : this.neighborCount));
        if (!this._data.el) {
            this._data.el = document.createElement("div");
            this._data.el.classList.add("category");
            this._data.el.addEventListener("click", () => console.log("Not available"));
            container.appendChild(this._data.el);
        }
        this._data.el.title = `${this._data.name}\nOpening times: ${numberToTime(this._data.start)}-${numberToTime(this._data.end)}\nMax waiting time (min): ${this._data.maxWait}`;
        this._data.el.style.backgroundColor = this._data.backColor;
        this._data.el.style.borderColor = this._data.foreColor;
        this._data.el.addEventListener("click", (e) => {
            var _a, _b, _c, _d;
            e.stopPropagation();
            const eventName = ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) ? "category-unselect" : "category-select";
            if (eventName === "category-unselect") {
                (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
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
        }
        return this;
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
            var _a, _b, _c, _d;
            if ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) {
                (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
            }
        });
        window.addEventListener("sequence-select", () => {
            var _a, _b, _c, _d;
            if ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) {
                (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
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
                var _a, _b, _c, _d;
                e.stopPropagation();
                const eventName = ((_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.classList.contains("highlight")) ? "point-unselect" : "point-select";
                if (eventName === "point-unselect") {
                    (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.el) === null || _d === void 0 ? void 0 : _d.classList.remove("highlight");
                }
                dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
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

var _a, _b;
const demo = new DemoData();
demo.addRandomSequence()
    .addRandomSequence()
    .addRandomSequence()
    .recalc();
const container = document.querySelector(".container");
const legend = new Legend(container);
legend.data(demo.data).draw();
const inspector = new Inspector(container);
const timeline = document.querySelector(".timeline");
let sequences = linkData(demo.data);
drawSequences(sequences, timeline);
const btnViewLegend = document.getElementById("btnShowLegend");
(_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => legend.toggle());
window.addEventListener("legend-visible", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.add("hidden"); });
window.addEventListener("legend-hidden", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden"); });
window.addEventListener("point-select", (event) => {
    const el = event.detail.el;
    if (el) {
        Array.from(document.querySelectorAll(".pt.highlight")).forEach(el => {
            el.classList.remove("highlight");
        });
        el.classList.add("highlight");
    }
});
const btnAddData = document.getElementById("btnAddData");
(_b = btnAddData) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    demo.addRandomSequence().recalc();
    sequences = linkData(demo.data, sequences);
    drawSequences(sequences, timeline);
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
