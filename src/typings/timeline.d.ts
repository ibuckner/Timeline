export type TPoint = {
  el?: HTMLElement,
  id?: number,
  left?: number,
  parent?: TCategory,
  time: number,
  top?: number,
  wait: number
}

export type TLegendItem = {
  backColor: string,
  el?: HTMLElement,
  foreColor: string,
  name: string
}

export type TCategory = {
  backColor: string,
  el?: HTMLElement,
  end: number,
  foreColor: string,
  id?: number,
  maxWait?: number,
  name: string,
  parent?: TSequence,
  points: TPoint[],
  relHeight?: number,
  start: number,
  stat?: TStat
}

export type TSequence = {
  avgWait?: number,
  categories: TCategory[],
  el?: HTMLElement,
  end: number,
  id?: number,
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