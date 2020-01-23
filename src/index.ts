import { TSequence, TCategory, TPoint } from "./typings/timeline";
import { DemoData } from "./data";
import { Legend } from "./legend";
import { Inspector } from "./inspector";
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

const inspector: Inspector = new Inspector(container);

const timeline = document.querySelector(".timeline") as HTMLElement;

let sequences: Sequence[] = linkData(demo.data);
drawSequences(sequences, timeline);

const btnViewLegend = document.getElementById("btnShowLegend");
btnViewLegend?.addEventListener("click", () => legend.toggle());

window.addEventListener("legend-visible", () => btnViewLegend?.classList.add("hidden"));
window.addEventListener("legend-hidden", () => btnViewLegend?.classList.remove("hidden"));

window.addEventListener("legend-filter-clear", () => {
  Array.from(document.querySelectorAll(".category.disabled"))
    .forEach(e => e.classList.remove("disabled", "filtered"));
});

window.addEventListener("legend-filter", (event: any) => {
  const list: string[] = event.detail;
  if (list.length > 1) {
    Array.from(document.querySelectorAll(".category"))
      .forEach(e => e.classList.add("disabled", "filtered"));

    list.forEach((item: string) => {
      Array.from(document.querySelectorAll(".category"))
        .forEach((e: Element) => {
          const c: string = (e as HTMLElement).dataset.category || "";
          if (c === item) {
            e.classList.remove("disabled", "filtered");
          }
        });
    });
  } else {
    Array.from(document.querySelectorAll(".category.disabled"))
      .forEach(e => e.classList.remove("disabled", "filtered"));

    list.forEach((item: string) => {
      Array.from(document.querySelectorAll(".category"))
        .forEach((e: Element) => {
          const c: string = (e as HTMLElement).dataset.category || "";
          if (c !== item) {
            e.classList.add("disabled", "filtered");
          }
        });
    });
  }
});

window.addEventListener("point-select", (event: any) => {
  const el = event.detail.el as HTMLElement;
  if (el) {
    Array.from(document.querySelectorAll(".pt.highlight")).forEach(el => {
      el.classList.remove("highlight");
    });  
    el.classList.add("highlight");
  }  
});
 
const btnAddData = document.getElementById("btnAddData");
btnAddData?.addEventListener("click", () => { 
  demo.addRandomSequence().recalc();
  sequences = linkData(demo.data, sequences);
  drawSequences(sequences, timeline);  
});

/**
 * Iterates over demo data and updates the sequences array
 * @param data - data array
 * @param sequences - array of Sequence objects
 */
function linkData(data: TSequence[], sequences?: Sequence[] | undefined): Sequence[] {
  if (sequences === undefined) {
    sequences = [];
  }
  data.forEach((seq, n) => {
    if (!seq.el) {
      let s = new Sequence({ maximumTime: demo.maximumTime });
      s.data(seq);
      sequences?.push(s);
    } else {
      if (sequences && sequences[n]) {
        sequences[n]?.data(seq);
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
function drawSequences(sequences: Sequence[], container: HTMLElement): void {
  sequences.forEach((seq: Sequence) => { seq.draw(container); });
  sequences.forEach((seq: Sequence) => {
    const d = seq.data();
    const nc: number = d.categories.length;
    d.categories.forEach((cat: TCategory) => {
      const c = new Category({ neighborCount: nc });
      c.data(cat).draw(d.el);
      const cd = c.data();
      cd.points.forEach((pt: TPoint) => {
        const p = new Point();
        p.data(pt).draw(cd.el);
      });
    });
  });
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

/**
 * Updates the Point's xy position
 * @param category - category data structure 
 */
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