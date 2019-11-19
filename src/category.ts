import { TSequence, TCategory } from "./typings/timeline";
import { randomInt } from "./random";

export class Category {
  private static _categories: any[] = [
    {
      name: "Late Arrival (LAT)",
      foreColor: "rgb(248, 80, 108)",
      backColor: "rgb(248, 156, 171, 0.5)"
    },
    {
      name: "Cancelled (CAN)",
      foreColor: "rgb(228, 146, 39)",
      backColor: "rgba(221, 170, 103, 0.5)"
    },
    {
      name: "Waiting Height & Weight (WHW)",
      foreColor: "rgb(41, 113, 247)",
      backColor: "rgba(100, 149, 237, 0.5)"
    },
    {
      name: "In consultation (ICO)",
      foreColor: "rgb(81, 66, 167)",
      backColor: "rgba(123, 104, 238, 0.5)"
    },
    {
      name: "In blood room (IBR)",
      foreColor: "rgb(247, 65, 44)",
      backColor: "rgba(250, 128, 114, 0.5)"
    },
    {
      name: "Did not attend (DNA)",
      foreColor: "rgb(143, 63, 248)",
      backColor: "rgba(139, 107, 180, 0.5)"
    },
    {
      name: "Identified by kiosk (KIO)",
      foreColor: "rgb(17, 141, 59)",
      backColor: "rgba(17, 141, 59, 0.5)"
    },
    {
      name: "Waiting for consulation (WCO)",
      foreColor: "rgb(224, 148, 5)",
      backColor: "rgba(245, 181, 61, 0.5)"
    },
    {
      name: "Waiting for blood (WB)",
      foreColor: "rgb(20, 105, 105)",
      backColor: "rgba(20, 105, 105, 0.5)"
    },
    {
      name: "Completed (COM)",
      foreColor: "rgb(116, 170, 7)",
      backColor: "rgba(154, 205, 50, 0.5)"
    }
  ];
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
        const c = document.createElement("div");
        c.classList.add("category");
        c.title = `${cat.name}\nMax waiting time (min): ${cat.maxWait}`;
        c.style.backgroundColor = cat.backColor;
        c.style.borderColor = cat.foreColor;
        if (cat.maxWait && seq.avgWait !== undefined) {
          c.style.flexBasis = `${w * (cat.maxWait / seq.avgWait)}%`;
        } else {
          throw new Error("Category is missing average width and maximum waiting times");
        }
        c.addEventListener("click", (e: Event) => console.log("Not available"));
        cat.el = c;
        seq.el?.appendChild(cat.el);
      });
    });
    return this;
  }

  public static random(exclude: string[]): TCategory {
    const temp: TCategory[] = [];
    Category._categories.forEach(c => {
      if (!exclude.includes(c.name)) {
        c.points = [];
        c.start = 0;
        c.end = 2359;
        temp.push(c);
      }
    });
    const categoryCount: number = temp.length;
    const index: number = randomInt(1, categoryCount) - 1;
    const category: TCategory = temp[index];
    return category;
  }
}