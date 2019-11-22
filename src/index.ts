import { TCategory, TPoint } from "./typings/timeline";
import { DemoData } from "./data";
import { numberToTime } from "./format";
import { Legend } from "./legend";
import { Sequence } from "sequence";
import { Category } from "category";
import { Point } from "point";

const demo: DemoData = new DemoData(1);
demo.addRandomSequence()
    .addRandomSequence()
    .addRandomSequence()
    .recalc();

const container = document.querySelector(".container") as HTMLElement;
const legend: Legend = new Legend(container);
legend
  .data(demo.data)
  .draw();

const timeline = document.querySelector(".timeline") as HTMLElement;
const sequences: Sequence = new Sequence();
sequences
  .data(demo.data)
  .draw(timeline);

const categories: Category = new Category();
categories
  .data(sequences.data())
  .draw();

const points: Point = new Point();
points
  .data(sequences.data())
  .draw();















  




let activePoint: TPoint | undefined; // which point is currently highlighted?
let activeEvent: any;
const objExplorer = document.querySelector(".object");

const btnViewLegend = document.getElementById("btnShowLegend");
const btnUpdateTimeline = document.getElementById("btnUpdateTimeline");
let resizeTimer: any;

// what happens when someone clicks on an category
function eventClickHandler(e: Event, category: TCategory): void {
  e.stopPropagation();
  togglePointSelection(activePoint);
  activePoint = undefined;
  activeEvent = activeEvent === category ? undefined : category;
  toggleObjectExplorer(activeEvent);
  if (!legend.visible) {
    legend.show();
  }
}

// what happens when someone clicks anywhere in timeline
function timelineclickHandler(_: Event): void {
  togglePointSelection(activePoint);
  activePoint = undefined;
  toggleObjectExplorer();
  if (legend.visible) {
    legend.hide();
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
  setTimeout(() => btn.classList.remove("hidden"), 2000);
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

function updatePoints() {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(() => {
    /*data.forEach(s => {
      s.categories.forEach(c => {
        updateLinePointX(c);
        c.points.forEach(pt => updatePointXY(pt, c));
      });
    });*/
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

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    updatePoints();
  }
});
if (timeline) {
  resizeObserver.observe(timeline);
}

timeline?.addEventListener("click", timelineclickHandler);
btnViewLegend?.addEventListener("click", () => legend.toggle());
btnUpdateTimeline?.addEventListener("click", updateTimelineClickHandler);
window.addEventListener("resize", updatePoints);
