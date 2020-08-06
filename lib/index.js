var Core = /** @class */ (function () {
    function Core(size) {
        this.size = size;
        this.map = Core.generateMap(size);
        this.listeners = {};
    }
    Core.generateMap = function (size) {
        var genMap = [];
        for (var i = 0; i < size; i++) {
            genMap[i] = [];
            for (var j = 0; j < size; j++) {
                genMap[i][j] = 0;
            }
        }
        return genMap;
    };
    Core.getRandomInt = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    Core.rotateMap = function (map) {
        var matrix = map;
        var n = matrix.length;
        var limit = (n - 1) / 2;
        for (var i = 0; i <= limit; i++) {
            for (var j = i; j < n - 1 - i; j++) {
                var temp = matrix[i][j];
                matrix[i][j] = matrix[n - 1 - j][i];
                matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j];
                matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i];
                matrix[j][n - 1 - i] = temp;
            }
        }
        return map;
    };
    Core.pleaseOutZero = function (line) {
        var zeroIndex = -1;
        for (var i = 0; i < line.length; i++) {
            if (line[i] !== 0 && zeroIndex !== -1) {
                var tmp = line[i];
                line[i] = line[zeroIndex];
                line[zeroIndex] = tmp;
                zeroIndex += 1;
            }
            if (zeroIndex === -1 && line[i] === 0) {
                zeroIndex = i;
            }
        }
        return line;
    };
    Core.numPlus = function (line) {
        var previous = 0;
        for (var i = 0; i < line.length; i++) {
            if (previous !== i && line[i] !== 0) {
                if (line[previous] === line[i]) {
                    line[previous] *= 2;
                    previous = i + 1;
                    line[i] = 0;
                }
                else {
                    previous = i;
                }
            }
        }
        return line;
    };
    Core.mergeOneLine = function (line) {
        return Core.pleaseOutZero(Core.numPlus(line));
    };
    Core.merge = function (map) {
        for (var i = 0; i < map.length; i++) {
            Core.mergeOneLine(map[i]);
        }
        return map;
    };
    Core.generate2or4 = function () {
        return (Core.getRandomInt(2) + 1) * 2;
    };
    Core.appendNum = function (map) {
        var zeorMap = [];
        for (var i_1 = 0; i_1 < map.length; i_1++) {
            for (var j_1 = 0; j_1 < map.length; j_1++) {
                if (map[i_1][j_1] === 0) {
                    zeorMap.push({ i: i_1, j: j_1 });
                }
            }
        }
        if (!zeorMap.length) {
            return false;
        }
        var randomIndex = Core.getRandomInt(zeorMap.length);
        var _a = zeorMap[randomIndex], i = _a.i, j = _a.j;
        map[i][j] = Core.generate2or4();
        return true;
    };
    Core.prototype.addEventListener = function (name, callback) {
        if (callback === void 0) { callback = function () { }; }
        this.listeners[name] = callback;
    };
    Core.prototype.triggerListener = function (name) {
        this.listeners[name] && this.listeners[name]();
    };
    Core.prototype.appendNumIntoMap = function () {
        var ok = Core.appendNum(this.map);
        if (!ok) {
            this.autoRun();
        }
    };
    // 执行所有监听事件
    Core.prototype.autoRun = function () {
        var _this = this;
        Object.keys(this.listeners).forEach(function (key) {
            _this.listeners[key]();
        });
    };
    Core.prototype.mergeMap = function () {
        Core.merge(this.map);
        this.appendNumIntoMap();
    };
    Core.prototype.getMap = function () {
        return this.map;
    };
    // 初始化
    Core.prototype.init = function () {
        var x = Core.getRandomInt(this.size);
        var y = Core.getRandomInt(this.size);
        this.map[x][y] = 2;
        return { x: x, y: y };
    };
    // 清除
    Core.prototype.clear = function () {
        this.map = Core.generateMap(this.size);
    };
    Core.prototype.score = function () {
        var total = 0;
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                total += this.map[i][j];
            }
        }
        return total;
    };
    // 顺时针旋转数组
    Core.prototype.rotate = function (time) {
        if (time === void 0) { time = 1; }
        while (time) {
            Core.rotateMap(this.map);
            time--;
        }
    };
    // 移动
    Core.prototype.leftMoving = function () {
        this.mergeMap();
    };
    Core.prototype.rightMoving = function () {
        this.rotate(2);
        this.mergeMap();
        this.rotate(2);
    };
    Core.prototype.topMoving = function () {
        this.rotate(3);
        this.mergeMap();
        this.rotate(1);
    };
    Core.prototype.bottomMoving = function () {
        this.rotate(1);
        this.mergeMap();
        this.rotate(3);
    };
    return Core;
}());

export default Core;
