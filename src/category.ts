import { TSequence, TCategory } from "./typings/timeline";
import { numberToTime } from "./format";

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
        if (!cat.el) {
          cat.el = document.createElement("div");
          cat.el.classList.add("category");
          cat.el.addEventListener("click", () => console.log("Not available"));
          seq.el?.appendChild(cat.el);
        }
        cat.el.title = `${cat.name}\nOpening times: ${numberToTime(cat.start)}-${numberToTime(cat.end)}\nMax waiting time (min): ${cat.maxWait}`;
        cat.el.style.backgroundColor = cat.backColor;
        cat.el.style.borderColor = cat.foreColor;
        cat.relHeight = (cat.end - cat.start) / (seq.end - seq.start);
        cat.el.style.height = `${cat.relHeight * 100}%`;
        cat.el.style.transform = `translate(0, ${100 - (cat.relHeight * 100)}%)`;
        if (cat.maxWait && seq.avgWait !== undefined) {
          cat.el.style.flexBasis = `${w * (cat.maxWait / seq.avgWait)}%`;
        } else {
          throw new Error("Category is missing average width and maximum waiting times");
        }  
      });
    });
    return this;
  }
}