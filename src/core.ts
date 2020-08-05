class Core {
  private map: Array<Array<number>>;
  private size: number;
  constructor(size: number) {
    this.size = size;
    this.map = Core.generateMap(size);
  }

  static generateMap(size: number) {
    let genMap = [];
    for (let i = 0; i < size; i++) {
      genMap[i] = [];
      for (let j = 0; j < size; j++) {
        genMap[i][j] = 0;
      }
    }
    return genMap;
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  static rotateMap(map: number[][]) {
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

  static pleaseOutZero(line: number[]) {
    let zeroIndex = -1;
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0 && zeroIndex !== -1) {
        [line[zeroIndex], line[i]] = [line[i], line[zeroIndex]];
        zeroIndex += 1;
      }
      if (zeroIndex === -1 && line[i] === 0) {
        zeroIndex = i;
      }
    }
    return line;
  }
  static numPlus(line: number[]) {
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

  static merge(map: number[][]) {
    for (let i = 0; i < map.length; i++) {
      Core.mergeOneLine(map[i]);
    }
    return map;
  }

  mergeMap() {
    return Core.merge(this.map);
  }

  getMap() {
    return this.map;
  }

  // 初始化
  init() {
    const x = Core.getRandomInt(this.size);
    const y = Core.getRandomInt(this.size);
    this.map[x][y] = 2;
    return { x, y };
  }
  // 清除
  clear() {
    this.map = Core.generateMap(this.size);
  }
  score() {
    let total = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        total += this.map[i][j];
      }
    }
    return total;
  }

  // 顺时针旋转数组
  rotate(time: number = 1) {
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
