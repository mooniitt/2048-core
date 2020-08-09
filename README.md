# core of 2048 (逻辑抽离)

## usage

```JS
const core = new Core(size:number)
// size 生成 size * size 的网格

core.init()
// 初始化

core.start()
// 同core.init()

core.getMap()
// 获取网格元数据

core.score()
// 获取分数

core.clear()
// 清空数组

core.restart()
// 类似
// core.clear()
// core.start()

core.addEventListens(name,callback)
// 游戏结束后执行的回调

core.leftMoving()
// 向左移动

core.rightMoving()
// 向右移动

core.topMoving()
// 向上移动

core.bottomMoving()
// 向下移动
```
