import { TSequence, TCategory } from "./typings/timeline";
import { randomInt } from "./random";

export class DemoData {
  private _categories: TCategory[] = [
    {
      name: "Late Arrival (LAT)",
      foreColor: "rgb(248, 80, 108)",
      backColor: "rgb(248, 156, 171, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Cancelled (CAN)",
      foreColor: "rgb(228, 146, 39)",
      backColor: "rgba(221, 170, 103, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Waiting Height & Weight (WHW)",
      foreColor: "rgb(41, 113, 247)",
      backColor: "rgba(100, 149, 237, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "In consultation (ICO)",
      foreColor: "rgb(81, 66, 167)",
      backColor: "rgba(123, 104, 238, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "In blood room (IBR)",
      foreColor: "rgb(247, 65, 44)",
      backColor: "rgba(250, 128, 114, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Did not attend (DNA)",
      foreColor: "rgb(143, 63, 248)",
      backColor: "rgba(139, 107, 180, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Identified by kiosk (KIO)",
      foreColor: "rgb(17, 141, 59)",
      backColor: "rgba(17, 141, 59, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Waiting for consulation (WCO)",
      foreColor: "rgb(224, 148, 5)",
      backColor: "rgba(245, 181, 61, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Waiting for blood (WB)",
      foreColor: "rgb(20, 105, 105)",
      backColor: "rgba(20, 105, 105, 0.75)",
      points: [],
      start: 0,
      end: 2300
    },
    {
      name: "Completed (COM)",
      foreColor: "rgb(116, 170, 7)",
      backColor: "rgba(154, 205, 50, 0.75)",
      points: [],
      start: 0,
      end: 2300
    }
  ];

  private _start: number;

  /**
   * Initialise generator
   * @param {number} start - id index to begin at
   */
  constructor(start: number) {
    this._start = start;
  }

  public addRandomSequence(): TSequence {
    const sequence: TSequence = {
      id: this._start++,
      start: 0,
      end: 2300,
      categories: []
    };
  }
}