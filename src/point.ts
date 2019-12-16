import { TSequence, TCategory, TPoint } from "./typings/timeline";
import { numberToTime } from "./format";

export class Point {
  private _data: TSequence[] = [];
  private _observer: ResizeObserver;

  constructor() {
    this._observer = new ResizeObserver((entries) => {
      this._data.forEach((seq: TSequence) => {
        seq.categories.forEach((cat: TCategory) => {
          cat.points.forEach((pt: TPoint) => {
            Point.updateXY(pt);
          })
        });
      });
    });
  }

  public data(d: TSequence[]): Point {
    this._data = d;
    return this;
  }

  public draw(): Point {
    this._data.forEach((seq: TSequence) => {
      seq.categories.forEach((cat: TCategory) => {
        cat.points.forEach((pt: TPoint) => {
          if (!pt.el) {
            pt.el = document.createElement("div");
            pt.el.classList.add("pt");
            pt.el.addEventListener("click", e => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent("point-touch", { detail: pt }));
            });
            cat.el?.appendChild(pt.el);
          }
          pt.el.style.backgroundColor = cat.foreColor;
          pt.el.style.borderColor = cat.foreColor;
          pt.el.title = `Appointment time: ${numberToTime(pt.time)}\nWaiting time (min): ${pt.wait}`;
          Point.updateXY(pt);
        })
      });
    });
    this._observer.observe(this._data[0].el?.parentNode as HTMLElement);
    return this;
  }

  public static updateXY(point: TPoint): void {
    if (point && point.parent && point.el) {
      const box: DOMRect = point.parent.el?.getBoundingClientRect() as DOMRect;
      if (point.parent && point.parent.maxWait) {
        const x: number = point.wait / point.parent.maxWait;
        const y: number = (point.time - point.parent.start) / (point.parent.end - point.parent.start);
        point.el.style.transform = `translate(${(box.width - 7.5) * x}px, ${(box.height - 7.5) * y}px)`;
      }
    }
  }
}