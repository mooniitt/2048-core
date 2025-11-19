export type Map = number[][];
export interface ILoc {
  i: number;
  j: number;
}
export type EventHandler = () => void;
export interface IListener {
  [key: string]: EventHandler[];
}
