import { TSequence, TCategory, TPoint } from "./typings/timeline";
import { ascending, deviation, median, quantile } from "d3-array";
import { DemoData } from "./data";
import { numberToTime } from "./format";
import { Legend } from "./legend";

const demo: DemoData = new DemoData(1);
const data: TSequence[] = [];
data.push(demo.addRandomSequence());
data.push(demo.addRandomSequence());
data.push(demo.addRandomSequence());
data.push(demo.addRandomSequence());
data.push(demo.addRandomSequence());

const container = document.querySelector(".container") as HTMLElement;
const legend = new Legend(container);


let activePoint: TPoint | undefined; // which point is currently highlighted?
let activeEvent: any;
const objExplorer = document.querySelector(".object");
const timeline = document.querySelector(".timeline");
const btnViewLegend = document.getElementById("btnShowLegend");
const btnUpdateTimeline = document.getElementById("btnUpdateTimeline");
let resizeTimer: any;

// what happens when someone clicks on a point
function pointClickHandler(e: Event, point: TPoint): void {
  e.stopPropagation();
  togglePointSelection(activePoint);
  activePoint = activePoint === point ? undefined : point;
  togglePointSelection(activePoint);
  toggleObjectExplorer(activePoint);
}

// what happens when someone clicks on an category
function eventClickHandler(e: Event, category: TCategory): void {
  e.stopPropagation();
  togglePointSelection(activePoint);
  activePoint = undefined;
  activeEvent = activeEvent === category ? undefined : category;
  toggleObjectExplorer(activeEvent);
  if (!legend?.classList.contains("hidden")) {
    toggleLegendClickHandler();
  }
}

// what happens when someone clicks anywhere in timeline
function timelineclickHandler(_: Event): void {
  togglePointSelection(activePoint);
  activePoint = undefined;
  toggleObjectExplorer();
  if (!legend?.classList.contains("hidden")) {
    toggleLegendClickHandler();
  }
}

window.addEventListener("legend-visible", () => btnViewLegend?.classList.add("hidden"));
window.addEventListener("legend-hidden", () => btnViewLegend?.classList.remove("hidden"));

function togglePointSelection(point?: TPoint): void {
  if (point) {
    if (point.el?.classList.contains("highlight")) {
      point.el.classList.remove("highlight");
    } else {
      point.el?.classList.add("highlight");
    }
  }
}

function toggleObjectExplorer(feature?: any): void {
  if (objExplorer) {
    if (feature) {
      objExplorer.classList.remove("hidden");
      const heading = objExplorer?.querySelector("h3");
      if (feature.points) { // category clicked
        if (heading) {
          heading.textContent = `${feature.name}`;
        }
        const content = objExplorer.querySelector(".content");
        if (content && feature.parent) {
          content.innerHTML = `<div>The opening times are ${numberToTime(feature.parent?.start)} to ${numberToTime(feature.parent?.end)}</div>`;
        }
      } else { // point clicked
        const category: TCategory | undefined = feature.parent;
        if (category) {
          if (heading) {
            heading.textContent = `Appointment for ${category.name}`;
          }
          const content = objExplorer.querySelector(".content");
          if (content && category.parent) {
            content.innerHTML = `<div>The opening times are ${numberToTime(category.parent?.start)} to ${numberToTime(category.parent?.end)}</div>`;
            content.innerHTML += `<div>The appointment was scheduled at ${numberToTime(feature.time)} and the point waited approx. ${feature.wait} minute${feature.wait > 1 ? "s" : ""}.</div>`;
          }
        }
      }     
    } else {
      objExplorer.classList.add("hidden");
    }
  }
}

function updateTimelineClickHandler(e: Event): void {
  const btn: HTMLElement = e.target as HTMLElement; 
  btn.classList.add("hidden");
  data.push(demo.addRandomSequence())
  initData(data);
  setTimeout(() => btn.classList.remove("hidden"), 2000);
}

function addSequence(seq: TSequence): HTMLElement {
  seq.el = document.createElement("div");
  seq.el.classList.add("sequence", "hidden");
  if (seq.relHeight) {
    seq.el.style.height = `${seq.relHeight * 100}%`;
  } else {
    throw new Error("Sequence is missing relative height");
  }
  return seq.el;
}

function addCategory(category: TCategory, avgWait?: number): HTMLElement {
  const c = document.createElement("div");
  c.classList.add("category");
  c.title = `${category.name}\nMax waiting time (min): ${category.maxWait}`;
  c.style.backgroundColor = category.backColor;
  c.style.borderColor = category.foreColor;
  if (category.avgWidth && category.maxWait && avgWait !== undefined) {
    c.style.flexBasis = `${category.avgWidth * (category.maxWait / avgWait)}%`;
  } else {
    throw new Error("Category is missing average width and maximum waiting times");
  }
  c.addEventListener("click", (e: Event) => eventClickHandler(e, category));
  return c;
}

function addQuantiles(category: TCategory): void {
  const med = document.createElement("div");
  med.classList.add("median");
  med.textContent = "";
  med.style.backgroundColor = category.foreColor;
  med.style.borderColor = category.foreColor;
  med.title = `Median is ${category.stat?.median}`;
  category.el?.appendChild(med);
  updateLinePointX(category);
}

function addPoint(point: TPoint, category: TCategory): HTMLElement {
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

function updateLinePointX(category: TCategory): void {
  if (category.el) {
    const box: ClientRect = category.el.getBoundingClientRect();
    const med: HTMLElement | null = category.el.querySelector(".median");
    if (med) {
      if (category.stat?.median && category.maxWait !== undefined) {
        med.style.transform = `translateX(${(box.width - 4) * (category.stat.median / category.maxWait)}px)`;
      }
    }
  } else {
    throw new Error("Category is missing UI element");
  }
}

function updatePointXY(point: TPoint, category: TCategory): void {
  if (category.el) {
    const box: ClientRect = category.el.getBoundingClientRect();
    if (point.el) {
      if (point.left !== undefined && point.top !== undefined) {
        point.el.style.transform = `translate(${(box.width - 7.5) * point.left}px, ${(box.height - 7.5) * point.top}px)`;
      } else {
        throw new Error("Point is missing top and left properties");
      }
    } else {
      throw new Error("Point is missing UI element");
    }
  } else {
    throw new Error("Category is missing UI element");
  }
}

function initData(seq: TSequence[]): void {
  if (timeline) {
    const list: HTMLElement[] = Array.from(document.querySelectorAll(".sequence"));
    let j = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      list[i].classList.add("hidden");
      setTimeout(() => timeline.removeChild(list[i]), 400);
    }
  }

  // 1st pass: determine dimensions, etc
  let totalTimes = 0;
  seq.forEach(s => {
    legend.populate(s.categories);
    totalTimes += s.end - s.start;
    const w = Math.floor(100 / (s.categories.length === 0 ? 1 : s.categories.length));
    let waits: number[] = [];
    s.categories.forEach((c: TCategory) => {
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

  // 2nd pass: draw categories
  seq.forEach(s => {
    s.relHeight = (s.end - s.start) / totalTimes;
    addSequence(s);
    if (s.el !== undefined) {
      timeline?.appendChild(s.el);
      s.categories.forEach(c => {
        c.el = addCategory(c, s.avgWait);
        if (s.el !== undefined) {
          s.el.appendChild(c.el);
        }
      });
    }
  });

  // 3rd pass: draw points and quantiles
  seq.forEach((s, n) => {
    setTimeout(() => {
      s.el?.classList.remove("hidden");
    }, 100 + (100 * n));
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

timeline?.addEventListener("click", timelineclickHandler);
btnViewLegend?.addEventListener("click", () => legend.toggle());
btnUpdateTimeline?.addEventListener("click", updateTimelineClickHandler);
window.addEventListener("resize", updatePoints);
