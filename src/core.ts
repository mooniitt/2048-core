import { IListener, ILoc, Map } from "./interface";

/**
 * Core.ts
 */
class Core {
  private map: Map;
  private size: number;
  // 改进：支持同名事件绑定多个回调
  private listeners: IListener = {};

  constructor(size: number = 4) {
    this.size = size;
    this.map = Core.generateMap(size);
  }

  // --- 静态工具方法 ---

  // 生成空地图
  static generateMap(size: number): Map {
    return Array.from({ length: size }, () => Array(size).fill(0));
  }

  static getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  // 顺时针旋转矩阵 90度 (原地修改)
  static rotateMap(matrix: Map): Map {
    const n = matrix.length;
    // 先沿对角线翻转
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
      }
    }
    // 再左右镜像翻转
    for (let i = 0; i < n; i++) {
      matrix[i].reverse();
    }
    return matrix;
  }

  // 核心算法：处理单行逻辑 (移动 + 合并)
  // 返回值：[新行数据, 是否发生了变化]
  static processLine(line: number[]): { newLine: number[]; changed: boolean } {
    let changed = false;
    // 1. 去除 0 (Compress)
    let newLine = line.filter((v) => v !== 0);
    if (newLine.length !== line.length - line.filter(v => v===0).length) {
        // 如果原来的非0元素位置变了，或者长度变了（虽然filter后长度肯定变短，但这里指逻辑上的变化），
        // 简单判断：如果去0后的数组填满0和原数组不一样，则视为变化。
        // 为了简单，我们在最后统一比较整个数组。
    }

    // 2. 合并相同数值 (Merge)
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        newLine[i + 1] = 0;
        changed = true; // 发生了合并
        i++; // 跳过下一个，因为已经合并过了
      }
    }

    // 3. 再次去除因合并产生的 0 并补齐长度
    newLine = newLine.filter((v) => v !== 0);
    const zeros = Array(line.length - newLine.length).fill(0);
    const result = newLine.concat(zeros);

    // 4. 检查最终结果与原行是否不同
    if (!changed) {
        for(let k=0; k<line.length; k++) {
            if (line[k] !== result[k]) {
                changed = true;
                break;
            }
        }
    }

    return { newLine: result, changed };
  }

  // 生成 2 或 4 (90% 概率生成 2, 10% 生成 4，这是原版游戏设定，也可以改回 50/50)
  static generate2or4(): number {
    return Math.random() < 0.9 ? 2 : 4;
  }

  // --- 实例方法 ---

  // 添加数字到随机空位
  appendNum(): boolean {
    const emptyLocs: ILoc[] = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.map[i][j] === 0) {
          emptyLocs.push({ i, j });
        }
      }
    }

    if (emptyLocs.length === 0) return false;

    const { i, j } = emptyLocs[Core.getRandomInt(emptyLocs.length)];
    this.map[i][j] = Core.generate2or4();
    return true;
  }

  // 检查游戏是否结束 (没有空位且无法合并)
  // 优化：移除 DFS 递归，使用 O(N^2) 遍历
  isOver(): boolean {
    // 1. 检查是否有 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.map[i][j] === 0) return false;
      }
    }

    // 2. 检查四周是否有相同数字可以合并
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.map[i][j];
        // 检查右侧
        if (j < this.size - 1 && current === this.map[i][j + 1]) return false;
        // 检查下方
        if (i < this.size - 1 && current === this.map[i + 1][j]) return false;
      }
    }

    return true;
  }

  // 事件监听
  on(name: string, callback: EventHandler): void {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  }

  emit(name: string): void {
    if (this.listeners[name]) {
      this.listeners[name].forEach((cb) => cb());
    }
  }

  // 核心移动逻辑
  move(direction: 'left' | 'right' | 'up' | 'down'): void {
    let rotateTimes = 0;
    // 利用旋转将所有方向的操作转换为 "向左移动"
    switch (direction) {
      case 'left': rotateTimes = 0; break;
      case 'down': rotateTimes = 1; break; // 左旋1次或右旋3次，这里统一用Core.rotateMap(顺时针)
      // 这里的旋转逻辑需要配合 Core.rotateMap (顺时针90度)
      // 向右划 = 矩阵顺时针转2次 -> 向左合并 -> 转2次复原
      // 向下划 = 矩阵顺时针转1次 -> 向左合并 -> 转3次复原 (原代码逻辑可能有误，需对齐)
      // 修正如下：
      // 原逻辑：
      // Right: rotate(2) -> merge -> rotate(2)
      // Top: rotate(3) -> merge -> rotate(1) (相当于逆时针转90度变成左，处理完顺时针转回)
      // Bottom: rotate(1) -> merge -> rotate(3)
      case 'right': rotateTimes = 2; break;
      case 'up': rotateTimes = 3; break;
    }

    // 1. 旋转到标准方向 (向左)
    for (let k = 0; k < rotateTimes; k++) {
        Core.rotateMap(this.map);
    }

    // 2. 执行合并并记录是否有变化
    let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      const { newLine, changed } = Core.processLine(this.map[i]);
      this.map[i] = newLine;
      if (changed) hasMoved = true;
    }

    // 3. 旋转回原始方向 (总共4次即复原)
    const restoreTimes = (4 - rotateTimes) % 4;
    for (let k = 0; k < restoreTimes; k++) {
        Core.rotateMap(this.map);
    }

    // 4. 只有地图发生变化才生成新数字
    if (hasMoved) {
      this.appendNum();
      // 触发移动后的回调（比如更新UI）
      this.emit('move'); 
    }

    // 5. 检查游戏是否结束
    if (this.isOver()) {
      this.emit('over');
    }
  }

  getMap(): Map {
    return this.map; // 注意：返回的是引用
  }

  init(): void {
    this.map = Core.generateMap(this.size);
    // 标准 2048 开局通常生成两个数字
    this.appendNum();
    this.appendNum();
    this.emit('start');
  }

  start(): void {
    this.init();
  }

  restart(): void {
    this.init();
  }

  score(): number {
    return this.map.flat().reduce((acc, val) => acc + val, 0);
  }

  // 对外暴露的移动 API
  leftMoving() { this.move('left'); }
  rightMoving() { this.move('right'); }
  topMoving() { this.move('up'); }
  bottomMoving() { this.move('down'); }
}

export default Core;
