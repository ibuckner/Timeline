export type TPoint = {
  el?: HTMLElement,
  id: number,
  left?: number,
  parent?: TCategory,
  time: number,
  top?: number,
  wait: number
}

export type TCategory = {
  avgWidth?: number,
  backColor: string,
  el?: HTMLElement,
  end: number,
  foreColor: string,
  maxWait?: number,
  name: string,
  parent?: TSequence,
  points: TPoint[],
  start: number,
  stat?: TStat
}

export type TSequence = {
  avgWait?: number,
  categories: TCategory[],
  el?: HTMLElement,
  end: number,
  id: number,
  relHeight?: number,
  start: number
}

export type TStat = {
  median?: number,
  q25?: number,
  q50?: number,
  q75?: number,
  std?: number
}