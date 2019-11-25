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
      if (point.left !== undefined && point.top !== undefined) {
        point.el.style.transform = `translate(${(box.width - 7.5) * point.left}px, ${(box.height - 7.5) * point.top}px)`;
      } else {
        throw new Error("Point is missing top and left properties");
      }
    }
  }
}