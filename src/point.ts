import { TPoint } from "./typings/timeline";
import { randomInt } from "./random";

export class Point {
  constructor() {

  }

  public static random(): TPoint {
    const result: TPoint = {
      time: 0,
      wait: randomInt(1, 60)
    }
    return result;
  }
}