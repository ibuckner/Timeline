export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomTime(min: number, max: number, round: number): number {
  let t: number = Math.floor(Math.random() * (max - min + 1) + min);
  let hh: number = Math.floor(t / 100), mm: number = t % 100;
  if (mm > 59) {
    mm = 100 - mm;
    ++hh;
  }
  if (hh > 23) {
    hh = 0;
  }
  t = hh * 100 + mm
  return t > max ? max : t;
}