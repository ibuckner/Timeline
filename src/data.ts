import { ascending, deviation, median, quantile } from "d3-array";
import { TSequence, TCategory } from "./typings/timeline";
import { randomInt } from "./random";
import { Point } from "./point";
import { Category } from "./category";

export class DemoData {
  public data: TSequence[] = [];
  public maximumPoints: number = 25;

  private _seqId: number;

  /**
   * Initialise generator
   * @param {number} start - id index to begin at
   */
  constructor(start: number, options?: any) {
    this._seqId = start;
    if (options) {
      if (options.maximumPoints !== undefined) {
        this.maximumPoints = options.maximumPoints;
      }
    }
  }

  public addRandomSequence(): DemoData {
    const sequence: TSequence = {
      id: this._seqId++,
      start: 0,
      end: 2300,
      categories: []
    };

    const categoryCount: number = randomInt(1, 5);
    const used: string[] = [];
    for (let n: number = 1; n <= categoryCount; n++) {
      const category: TCategory = Category.random(used);
      used.push(category.name);
      const pointCount: number = randomInt(5, this.maximumPoints);
      for (let n = 1; n <= pointCount; n++) {
        category.points.push(Point.random());
      }
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