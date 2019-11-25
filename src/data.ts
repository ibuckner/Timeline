import { ascending, deviation, median, quantile } from "d3-array";
import { TSequence, TCategory } from "./typings/timeline";
import { randomInt, randomTime } from "./random";

export class DemoData {
  private _categories: any[] = [
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

  public data: TSequence[] = [];
  public maximumPoints: number = 25;

  /**
   * Initialise generator
   * @param {number} start - id index to begin at
   */
  constructor(options?: any) {
    if (options) {
      if (options.maximumPoints !== undefined) {
        this.maximumPoints = options.maximumPoints;
      }
    }
  }

  public addRandomCategory(exclude: string[]): any {
    let i: number = randomInt(0, this._categories.length - 1);
    let search: boolean = true;
    while (search) {
      if (exclude.length === 0 || !exclude.includes(this._categories[i].name)) {
        search = false;
      } else {
        i = randomInt(0, this._categories.length - 1);
      }
    }
    this._categories[i].points = [];
    let result = {};
    Object.assign(result, this._categories[i]);
    return result;
  }

  public addRandomSequence(): DemoData {
    let sequence: TSequence = {
      id: this.data.length + 1,
      start: randomTime(800, 1000, 30),
      end: randomTime(1700, 2000, 30),
      categories: []
    };

    let categoryCount: number = randomInt(1, 5);
    let used: string[] = [];

    for (let n: number = 1; n <= categoryCount; n++) {
      let category: TCategory = this.addRandomCategory(used);
      used.push(category.name);
      let pointCount: number = randomInt(5, this.maximumPoints);
      category.start = randomTime(sequence.start, sequence.start + 200, 30);
      category.end = randomTime(sequence.end - 200, sequence.end, 30);
      for (let n = 1; n <= pointCount; n++) {
        category.points.push({
          id: category.points.length + 1,
          time: randomTime(category.start, category.end, 10),
          wait: randomInt(0, 60)
        });
      }
      category.id = sequence.categories.length + 1
      sequence.categories.push(category);
    }

    this.data.push(sequence);
    return this;
  }

  public recalc(): DemoData {
    this.data.forEach(s => {
      let waits: number[] = [];
      s.categories.forEach((c: TCategory) => {
        c.parent = s;
        c.maxWait = 1;
        c.points.sort((a, b) => ascending(a.wait, b.wait));
        /*c.stat = {};
        if (c.stat) {
          c.stat.median = median(c.points, d => d.wait);
          c.stat.q25 = quantile(c.points, 0.25, d => d.wait);
          c.stat.q50 = quantile(c.points, 0.5, d => d.wait);
          c.stat.q75 = quantile(c.points, 0.75, d => d.wait);
          c.stat.std = deviation(c.points, d => d.wait);
        }*/
  
        c.points.forEach(pt => {        
          if (c.maxWait !== undefined && pt.wait > c.maxWait) {
            c.maxWait = pt.wait;
          }
          pt.top = (pt.time - s.start) / (s.end - s.start);
        });
  
        c.points.forEach(pt => {
          if (c.maxWait !== undefined) {
            pt.left = pt.wait / c.maxWait;
            pt.parent = c;
          }
        });
        
        waits.push(c.maxWait);
      });
      let sum = 0;
      waits.forEach(wt => sum += wt);
      s.avgWait = sum / waits.length;
    });

    return this;
  }
}