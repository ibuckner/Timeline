import { TSequence, TCategory, TPoint } from "./typings/timeline";
import { ascending, deviation, median, quantile } from "d3-array";

const data: TSequence[] = [
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

let activePoint: TPoint | undefined; // which point is currently highlighted?
let activeEvent: any;
const objExplorer = document.querySelector(".object");
const timeline = document.querySelector(".timeline");
const legend = document.querySelector(".legend");
const legendItems = document.querySelector(".legend-items");
const viewLegendButton = document.querySelector(".show-legend");
const closeLegendButton = document.querySelector(".close-legend");
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

function toggleLegendClickHandler(): void {
  if (legend?.classList.contains("hidden")) {
    legend.classList.remove("hidden");
    viewLegendButton?.classList.add("hidden");
  } else {
    legend?.classList.add("hidden");
    viewLegendButton?.classList.remove("hidden");
  }
}

function togglePointSelection(point?: TPoint): void {
  if (point) {
    if (point.el?.classList.contains("highlight")) {
      point.el.classList.remove("highlight");
    } else {
      point.el?.classList.add("highlight");
    }
  }
}

function toggleObjectExplorer(point?: TPoint): void {
  if (objExplorer) {
    if (point) {
      objExplorer.classList.remove("hidden");
      const heading = objExplorer?.querySelector("h3");
      const category: TCategory | undefined = point.parent;
      if (category) {
        if (heading) {
          heading.textContent = `point appointment for "${category.name}"`;
        }
        const content = objExplorer.querySelector(".content");
        if (content && category.parent) {
          content.innerHTML = `<div>The opening times are ${numberToTime(category.parent?.start)} to ${numberToTime(category.parent?.end)}</div>`;
          content.innerHTML += `<div>The appointment was scheduled at ${numberToTime(point.time)} and the point waited approx. ${point.wait} minute${point.wait > 1 ? "s" : ""}.</div>`;
        }
      }
    } else {
      objExplorer.classList.add("hidden");
    }
  }
}

function numberToTime(value: number): string {
  let t = ("0" + value.toString()).slice(-4);
  return t.slice(0,2) + ":" + t.slice(-2);
}

function addSequence(seq: TSequence): HTMLElement {
  seq.el = document.createElement("div");
  seq.el.classList.add("sequence");
  if (seq.relHeight) {
    seq.el.style.height = `${seq.relHeight * 100}%`;
  } else {
    throw new Error("Sequence is missing relative height");
  }
  return seq.el;
}

function addLegendItem(category: TCategory): HTMLElement {
  const li = document.createElement("div");
  li.classList.add("legend-item");
  li.style.backgroundColor = category.backColor;
  li.style.borderColor = category.foreColor;
  li.textContent = category.name;
  return li;
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
  med.title = `Median is ${category.median}`;
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
      if (category.median !== undefined && category.maxWait !== undefined) {
        med.style.transform = `translateX(${(box.width - 4) * (category.median / category.maxWait)}px)`;
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
  const legend: Map<string, number> = new Map<string, number>();
  const legendItems = document.querySelector(".legend-items");

  // 1st pass: determine dimensions, etc
  let totalTimes = 0;
  seq.forEach(s => {
    totalTimes += s.end - s.start;
    const w = Math.floor(100 / (s.categories.length === 0 ? 1 : s.categories.length));
    let waits: number[] = [];
    s.categories.forEach(c => {
      if (!legend.has(c.name)) {
        legendItems?.appendChild(addLegendItem(c));
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

timeline?.addEventListener("click", timelineclickHandler);
viewLegendButton?.addEventListener("click", toggleLegendClickHandler);
closeLegendButton?.addEventListener("click", toggleLegendClickHandler);
window.addEventListener("resize", updatePoints);