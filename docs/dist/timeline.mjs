function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomTime(min, max, round) {
    let t = Math.floor(Math.random() * (max - min + 1) + min);
    let hh = Math.floor(t / 100), mm = t % 100;
    if (mm > 59) {
        mm = 100 - mm;
        ++hh;
    }
    if (hh > 23) {
        hh = 0;
    }
    t = hh * 100 + mm;
    return t > max ? max : t;
}

class DemoData {
    /**
     * Initialise generator
     * @param {number} start - id index to begin at
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
            start: randomTime(800, 1000),
            end: randomTime(1700, 2000),
            categories: []
        };
        let categoryCount = randomInt(1, 5);
        let used = [];
        for (let n = 1; n <= categoryCount; n++) {
            let category = this.addRandomCategory(used);
            used.push(category.name);
            let pointCount = randomInt(5, this.maximumPoints);
            category.start = randomTime(sequence.start, sequence.start + 200);
            category.end = randomTime(sequence.end - 200, sequence.end);
            for (let n = 1; n <= pointCount; n++) {
                category.points.push({
                    id: category.points.length + 1,
                    time: randomTime(category.start, category.end),
                    wait: randomInt(0, 60)
                });
            }
            category.id = sequence.categories.length + 1;
            sequence.categories.push(category);
        }
        this.data.push(sequence);
        return this;
    }
    recalc() {
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
     * @param {TSequence[]} data - list of categories
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
 * @param {number} value - number should conform to hhmm expectations
 */
function numberToTime(value) {
    let t = ("0" + value.toString()).slice(-4);
    return t.slice(0, 2) + ":" + t.slice(-2);
}

class Sequence {
    constructor() {
        this._data = [];
    }
    data(d) {
        if (d) {
            this._data = d;
            return this;
        }
        return this._data;
    }
    draw(container) {
        let totalTimes = 0;
        this._data.forEach(s => totalTimes += s.end - s.start);
        this._data.forEach(s => {
            s.relHeight = (s.end - s.start) / totalTimes;
            if (!s.el) {
                s.el = document.createElement("div");
                s.el.classList.add("sequence");
                container.appendChild(s.el);
                s.el.addEventListener("click", () => {
                    window.dispatchEvent(new CustomEvent("sequence-touch", { detail: s }));
                });
            }
            s.el.style.height = `${s.relHeight * 100}%`;
            s.el.title = `Start: ${numberToTime(s.start)} End: ${numberToTime(s.end)}`;
        });
        return this;
    }
}

class Category {
    constructor() {
        this._data = [];
    }
    data(d) {
        this._data = d;
        return this;
    }
    draw() {
        this._data.forEach((seq) => {
            const w = Math.floor(100 / (seq.categories.length === 0 ? 1 : seq.categories.length));
            seq.categories.forEach((cat) => {
                var _a;
                if (!cat.el) {
                    cat.el = document.createElement("div");
                    cat.el.classList.add("category");
                    cat.el.addEventListener("click", () => console.log("Not available"));
                    (_a = seq.el) === null || _a === void 0 ? void 0 : _a.appendChild(cat.el);
                }
                cat.el.title = `${cat.name}\nOpening times: ${numberToTime(cat.start)}-${numberToTime(cat.end)}\nMax waiting time (min): ${cat.maxWait}`;
                cat.el.style.backgroundColor = cat.backColor;
                cat.el.style.borderColor = cat.foreColor;
                cat.relHeight = (cat.end - cat.start) / (seq.end - seq.start);
                cat.el.style.height = `${cat.relHeight * 100}%`;
                cat.el.style.transform = `translate(0, ${100 - (cat.relHeight * 100)}%)`;
                if (cat.maxWait && seq.avgWait !== undefined) {
                    cat.el.style.flexBasis = `${w * (cat.maxWait / seq.avgWait)}%`;
                }
                else {
                    throw new Error("Category is missing average width and maximum waiting times");
                }
            });
        });
        return this;
    }
}

class Point {
    constructor() {
        this._data = [];
        this._observer = new ResizeObserver((entries) => {
            this._data.forEach((seq) => {
                seq.categories.forEach((cat) => {
                    cat.points.forEach((pt) => {
                        Point.updateXY(pt);
                    });
                });
            });
        });
    }
    data(d) {
        this._data = d;
        return this;
    }
    draw() {
        var _a;
        this._data.forEach((seq) => {
            seq.categories.forEach((cat) => {
                cat.points.forEach((pt) => {
                    var _a;
                    if (!pt.el) {
                        pt.el = document.createElement("div");
                        pt.el.classList.add("pt");
                        pt.el.addEventListener("click", e => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent("point-touch", { detail: pt }));
                        });
                        (_a = cat.el) === null || _a === void 0 ? void 0 : _a.appendChild(pt.el);
                    }
                    pt.el.style.backgroundColor = cat.foreColor;
                    pt.el.style.borderColor = cat.foreColor;
                    pt.el.title = `Appointment time: ${numberToTime(pt.time)}\nWaiting time (min): ${pt.wait}`;
                    Point.updateXY(pt);
                });
            });
        });
        this._observer.observe((_a = this._data[0].el) === null || _a === void 0 ? void 0 : _a.parentNode);
        return this;
    }
    static updateXY(point) {
        var _a;
        if (point && point.parent && point.el) {
            const box = (_a = point.parent.el) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (point.left !== undefined && point.top !== undefined) {
                point.el.style.transform = `translate(${(box.width - 7.5) * point.left}px, ${(box.height - 7.5) * point.top}px)`;
            }
            else {
                throw new Error("Point is missing top and left properties");
            }
        }
    }
}

var _a, _b, _c;
const demo = new DemoData();
demo.addRandomSequence()
    .addRandomSequence()
    .addRandomSequence()
    .recalc();
const container = document.querySelector(".container");
const legend = new Legend(container);
legend.data(demo.data).draw();
const timeline = document.querySelector(".timeline");
const sequences = new Sequence();
sequences
    .data(demo.data)
    .draw(timeline);
const categories = new Category();
categories
    .data(sequences.data())
    .draw();
const points = new Point();
points
    .data(sequences.data())
    .draw();
const btnViewLegend = document.getElementById("btnShowLegend");
(_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => legend.toggle());
window.addEventListener("legend-visible", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.add("hidden"); });
window.addEventListener("legend-hidden", () => { var _a; return (_a = btnViewLegend) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden"); });
const btnAddData = document.getElementById("btnAddData");
(_b = btnAddData) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    demo.addRandomSequence().recalc();
    sequences.data(demo.data).draw(timeline);
    categories.data(sequences.data()).draw();
    points.data(sequences.data()).draw();
});
const objExplorer = document.getElementById("objExplorer");
(_c = objExplorer) === null || _c === void 0 ? void 0 : _c.addEventListener("sequence-touch", () => {
    objExplorer.classList.add("hidden");
});
// timeline?.addEventListener("click", timelineclickHandler);
// window.addEventListener("resize", updatePoints);
