import { TCategory, TPoint } from "./typings/timeline";
import { DemoData } from "./data";
import { Legend } from "./legend";
import { Sequence } from "sequence";
import { Category } from "category";
import { Point } from "point";

const demo: DemoData = new DemoData();
demo.addRandomSequence()
    .addRandomSequence()
    .addRandomSequence()
    .recalc();

const container = document.querySelector(".container") as HTMLElement;
const legend: Legend = new Legend(container);
legend.data(demo.data).draw();

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

const btnViewLegend = document.getElementById("btnShowLegend");
btnViewLegend?.addEventListener("click", () => legend.toggle());
window.addEventListener("legend-visible", () => btnViewLegend?.classList.add("hidden"));
window.addEventListener("legend-hidden", () => btnViewLegend?.classList.remove("hidden"));
  
const btnAddData = document.getElementById("btnAddData");
btnAddData?.addEventListener("click", () => { 
  demo.addRandomSequence().recalc();
  sequences.data(demo.data).draw(timeline);
  categories.data(sequences.data()).draw();
  points.data(sequences.data()).draw();
  legend.data(demo.data).draw();
});

const objExplorer = document.getElementById("objExplorer");
objExplorer?.addEventListener("sequence-touch", () => {
  objExplorer.classList.add("hidden");
})



function togglePointSelection(point?: TPoint): void {
  if (point) {
    if (point.el?.classList.contains("highlight")) {
      point.el.classList.remove("highlight");
    } else {
      point.el?.classList.add("highlight");
    }
  }
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

// timeline?.addEventListener("click", timelineclickHandler);
