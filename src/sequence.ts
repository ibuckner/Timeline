import { TSequence } from "./typings/timeline";
import { Category } from "./category";

export class Sequence {
  private _data: TSequence[] = [];

  constructor() {

  }

  public data(d: TSequence[]): Sequence {
    this._data = d;
    return this;
  }

  public draw(container: HTMLElement): Sequence {
    let totalTimes: number = 0;
    this._data.forEach(s => totalTimes += s.end - s.start);
    this._data.forEach(s => {
      s.relHeight = (s.end - s.start) / totalTimes;
      s.el = document.createElement("div");
      s.el.classList.add("sequence", "hidden");
      s.el.style.height = `${s.relHeight * 100}%`;
      container.appendChild(s.el);

      s.categories.forEach(c => {
        const cat: Category = new Category();
        cat.data()
           .draw()
        // c.el = addCategory(c, s.avgWait);
      });


    });
    return this;
  }
}