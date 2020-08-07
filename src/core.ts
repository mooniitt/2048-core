import { IListener, ILoc, Map } from "./interface";

class Core {
  private map: Map;
  private size: number;
  private listeners: IListener;

  constructor(size: number = 4) {
    this.size = size;
    this.map = Core.generateMap(size);
    this.listeners = {};
  }

  static generateMap(size: number): Map {
    let genMap = [];
    for (let i = 0; i < size; i++) {
      genMap[i] = [];
      for (let j = 0; j < size; j++) {
        genMap[i][j] = 0;
      }
    }
    return genMap;
  }

  static getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
  static rotateMap(map: Map): Map {
    const matrix = map;
    let n = matrix.length;
    let limit = (n - 1) / 2;
    for (let i = 0; i <= limit; i++) {
      for (let j = i; j < n - 1 - i; j++) {
        let temp = matrix[i][j];
        matrix[i][j] = matrix[n - 1 - j][i];
        matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j];
        matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i];
        matrix[j][n - 1 - i] = temp;
      }
    }
    return map;
  }

  static pleaseOutZero(line: number[]): number[] {
    let zeroIndex = -1;
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0 && zeroIndex !== -1) {
        const tmp = line[i];
        line[i] = line[zeroIndex];
        line[zeroIndex] = tmp;
        zeroIndex += 1;
      }
      if (zeroIndex === -1 && line[i] === 0) {
        zeroIndex = i;
      }
    }
    return line;
  }
  static numPlus(line: number[]): number[] {
    let previous = 0;
    for (let i = 0; i < line.length; i++) {
      if (previous !== i && line[i] !== 0) {
        if (line[previous] === line[i]) {
          line[previous] *= 2;
          previous = i + 1;
          line[i] = 0;
        } else {
          previous = i;
        }
      }
    }
    return line;
  }
  static mergeOneLine(line: number[]) {
    return Core.pleaseOutZero(Core.numPlus(line));
  }

  static merge(map: Map): Map {
    for (let i = 0; i < map.length; i++) {
      Core.mergeOneLine(map[i]);
    }
    return map;
  }
  static generate2or4(): number {
    return (Core.getRandomInt(2) + 1) * 2;
  }

  static appendNum(map: Map): boolean {
    const zeorMap: ILoc[] = [];
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map.length; j++) {
        if (map[i][j] === 0) {
          zeorMap.push({ i, j });
        }
      }
    }
    if (!zeorMap.length) {
      return false;
    }
    const randomIndex: number = Core.getRandomInt(zeorMap.length);
    const { i, j } = zeorMap[randomIndex];
    map[i][j] = Core.generate2or4();
    return true;
  }

  static dfsMap(map: Map): boolean {
    const size = map.length;
    let isOver: boolean = true;
    const dfs = function(i: number, j: number) {
      if (isOver === false) return;
      if (i >= size || j >= size) return;
      if (i + 1 < size && map[i][j] === map[i + 1][j]) {
        return (isOver = false);
      }
      if (j + 1 < size && map[i][j] === map[i][j + 1]) {
        return (isOver = false);
      }
      dfs(i + 1, j);
      dfs(i, j + 1);
    };
    dfs(0, 0);
    return isOver;
  }

  static isOver(map: Map): boolean {
    return Core.dfsMap(map);
  }

  addEventListener(name: string, callback: () => void = () => {}): void {
    this.listeners[name] = callback;
  }

  triggerListener(name: string): void {
    this.listeners[name] && this.listeners[name]();
  }

  appendNumIntoMap(): void {
    if (!Core.appendNum(this.map) && Core.isOver(this.map)) {
      this.autoRun();
    }
  }

  // 执行所有监听事件
  autoRun(): void {
    Object.keys(this.listeners).forEach(key => {
      this.listeners[key]();
    });
  }

  mergeMap(): void {
    Core.merge(this.map);
    this.appendNumIntoMap();
  }

  getMap(): Map {
    return this.map;
  }

  // 初始化
  init(): ILoc {
    const i = Core.getRandomInt(this.size);
    const j = Core.getRandomInt(this.size);
    this.map[i][j] = 2;
    return { i, j };
  }
  start(): void {
    this.init();
  }

  restart(): void {
    this.clear();
    this.init();
  }
  // 清除
  clear() {
    this.map = Core.generateMap(this.size);
  }
  score(): number {
    let total = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        total += this.map[i][j];
      }
    }
    return total;
  }

  // 顺时针旋转数组
  rotate(time: number = 1): void {
    while (time) {
      Core.rotateMap(this.map);
      time--;
    }
  }

  // 移动
  leftMoving() {
    this.mergeMap();
  }
  rightMoving() {
    this.rotate(2);
    this.mergeMap();
    this.rotate(2);
  }
  topMoving() {
    this.rotate(3);
    this.mergeMap();
    this.rotate(1);
  }
  bottomMoving() {
    this.rotate(1);
    this.mergeMap();
    this.rotate(3);
  }
}

export default Core;
