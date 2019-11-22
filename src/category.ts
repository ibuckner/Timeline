import { TSequence, TCategory } from "./typings/timeline";
import { randomInt } from "./random";

export class Category {
  private _data: TSequence[] = [];

  constructor() {
    
  }

  public data(d: TSequence[]): Category {
    this._data = d;
    return this;
  }

  public draw(): Category {
    this._data.forEach((seq: TSequence) => {
      const w: number = Math.floor(100 / (seq.categories.length === 0 ? 1 : seq.categories.length));
      seq.categories.forEach((cat: TCategory) => {
        cat.el = document.createElement("div");
        cat.el.classList.add("category");
        cat.el.title = `${cat.name}\nMax waiting time (min): ${cat.maxWait}`;
        cat.el.style.backgroundColor = cat.backColor;
        cat.el.style.borderColor = cat.foreColor;
        if (cat.maxWait && seq.avgWait !== undefined) {
          cat.el.style.flexBasis = `${w * (cat.maxWait / seq.avgWait)}%`;
        } else {
          throw new Error("Category is missing average width and maximum waiting times");
        }
        cat.el.addEventListener("click", (e: Event) => console.log("Not available"));
        seq.el?.appendChild(cat.el);
      });
    });
    return this;
  }
}