import { TSequence } from "./typings/timeline";

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

  public draw(container: HTMLElement): Sequence {
    let totalTimes: number = 0;
    this._data.forEach(s => totalTimes += s.end - s.start);
    this._data.forEach(s => {
      s.relHeight = (s.end - s.start) / totalTimes;
      s.el = document.createElement("div");
      s.el.classList.add("sequence");
      s.el.style.height = `${s.relHeight * 100}%`;
      container.appendChild(s.el);
    });
    return this;
  }
}