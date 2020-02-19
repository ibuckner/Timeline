import { TSequence, TCategory, TCategoryLabel, TPoint } from "./typings/timeline";
import { DemoData } from "./data";
import { createLegend } from "./legend";
import { createInspector } from "./inspector";
import { Sequence } from "./sequence";
import { Category } from "./category";
import { Point } from "./point";
import { createButton } from "./button";

const demo: DemoData = new DemoData();
demo.addRandomSequence()
    .addRandomSequence()
    .addRandomSequence()
    .recalc();

const legend = createLegend(".container");
legend.draw(demo.categories);

const inspector = createInspector(".container");
inspector
  .indirect("point-select", (e: any) => inspector.draw(e.detail).show())
  .indirect("category-select", (e: any) => inspector.draw(e.detail).show())
  .indirect("sequence-select", (e: any) => inspector.draw(e.detail).show())
  .indirect("point-unselect", () => inspector.hide())
  .indirect("category-unselect", () => inspector.hide())
  .indirect("sequence-unselect", () => inspector.hide());

const timeline = document.querySelector(".timeline") as HTMLElement;
let sequences: Sequence[] = linkData(demo.data);
drawSequences(sequences, timeline);

const btnLegend = createButton("btnShowLegend");
btnLegend.direct("click", () => legend.toggle())
  .indirect("legend-visible", () => btnLegend.hide() )
  .indirect("legend-hidden", () => btnLegend.show() )
  .indirect("legend-filter-clear", () => {
    Array.from(document.querySelectorAll(".category.disabled"))
      .forEach(e => e.classList.remove("disabled", "filtered"));
  })
  .indirect("legend-filter", (event: any) => {
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

createButton("btnAddData").direct("click", () => {
  demo.addRandomSequence().recalc();
  sequences = linkData(demo.data, sequences);
  drawSequences(sequences, timeline);
  legend.draw(demo.categories);
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