import { TPoint } from "./typings/timeline";
import { numberToTime } from "./format";

/**
 * Points are individual data items occuring within categories
 */
export class Point {
  private _data: TPoint = { time: 0, wait: 0 };
  private _observer: ResizeObserver;

  /**
   * Watch for view size changes and re-align points if needed
   */
  constructor() {
    this._observer = new ResizeObserver(() => Point.updateXY(this._data));

    window.addEventListener("category-select", () => {
      if (this._data?.el?.classList.contains("highlight")) {
        this._data?.el?.classList.remove("highlight");
      }
      if (this._data?.el?.classList.contains("filtered")) {
        this._data?.el?.classList.remove("filtered");
      }
    });

    window.addEventListener("sequence-select", () => {
      if (this._data?.el?.classList.contains("highlight")) {
        this._data?.el?.classList.remove("highlight");
      }
      if (this._data?.el?.classList.contains("filtered")) {
        this._data?.el?.classList.remove("filtered");
      } 
    });
  }

  public data(d?: TPoint): any {
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
  public draw(container: HTMLElement): Point {
    if (!this._data.el) {
      this._data.el = document.createElement("div");
      this._data.el.classList.add("pt");
      this._data.el.addEventListener("click", e => {
        e.stopPropagation();
        if (this._data?.el) {
          const eventName: string = this._data.el.classList.contains("highlight") ? "point-unselect" : "point-select";
          const points = this._data.el.parentNode?.querySelectorAll(".pt");
          if (points) {
            if (eventName === "point-unselect") {
              Array.from(points).forEach(pt => pt.classList.remove("filtered", "highlight"));
            } else {
              Array.from(points).forEach(pt => {
                pt.classList.remove("filtered", "highlight");
                if (pt === this._data.el) {
                  pt.classList.add("highlight");
                } else {
                  pt.classList.add("filtered");
                }
              });
            }
            dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
          }          
        }
      });
      container.appendChild(this._data.el);
    }
    this._data.el.style.backgroundColor = container.style.backgroundColor;
    this._data.el.style.borderColor = container.style.borderColor;
    this._data.el.title = `Appointment time: ${numberToTime(this._data.time)}\nWaiting time (min): ${this._data.wait}`;
    Point.updateXY(this._data);
 
    this._observer.observe(this._data.el?.parentNode as HTMLElement);
    return this;
  }

  /**
   * Adjusts point positions in view
   * @param point - Point to set view position 
   */
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