import { TSequence } from "./typings/timeline";
import { numberToTime } from "./format";

/**
 * Sequences are collections of activity, spanning across the view for a given time frame
 */
export class Sequence {
  private _data: TSequence = { categories: [], end: 0, start: 0 };

  constructor(options: any) {
    this.maximumTime = options.maximumTime !== undefined ? options.maximumTime : 0;
  }

  public data(d?: TSequence): any {
    if (d) {
      this._data = d;
      return this;
    }
    return this._data;
  }

  public maximumTime: number;

  /**
   * Once drawn, each sequence item holds the DOM object connected to it
   * @param container 
   */
  public draw(container: HTMLElement): Sequence {    
    this._data.relHeight = (this._data.end - this._data.start) / this.maximumTime;
    if (!this._data.el) {
      this._data.el = document.createElement("div");
      this._data.el.classList.add("sequence");
      container.appendChild(this._data.el);
      this._data.el.addEventListener("click", (e) => {
        e.stopPropagation();
        const eventName: string = this._data?.el?.classList.contains("highlight") ? "sequence-unselect" : "sequence-select";
        if (eventName === "sequence-unselect") {
          this._data?.el?.classList.remove("highlight");
        }
        dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
      });
    }
    this._data.el.style.height = `${this._data.relHeight * 100}%`;
    this._data.el.title = `Start: ${numberToTime(this._data.start)} End: ${numberToTime(this._data.end)}`;
    return this;
  }
}