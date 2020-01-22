import { TSequence } from "./typings/timeline";
import { numberToTime } from "./format";

/**
 * Sequences are collections of activity, spanning across the view for a given time frame
 */
export class Sequence {
  private _data: TSequence[] = [];
  
  constructor() {
  }

  public data(d?: TSequence[]): any {
    if (d) {
      this._data = d;
      return this;
    }
    return this._data;
  }

  /**
   * Once drawn, each sequence item holds the DOM object connected to it
   * @param container 
   */
  public draw(container: HTMLElement): Sequence {
    let totalTimes: number = 0;
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