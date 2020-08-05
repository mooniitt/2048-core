import Core from "./core";

test("size is 4", () => {
  const core = new Core(4);
  expect(core.getMap().length).toBe(4);
  expect(new Core(4).getMap()[0].toString()).toBe([0, 0, 0, 0].toString());
});

test("init() map[x,y] = 2 and return {x,y} ", () => {
  const core = new Core(10);
  const { x, y } = core.init();
  expect(core.getMap()[x][y]).toBe(2);
});

test("score() get the map of score", () => {
  const core = new Core(4);
  core.init();
  expect(core.score()).toBe(2);
});

test("clear() map is clear", () => {
  const core = new Core(4);
  core.init();
  expect(core.score()).toBe(2);
  core.clear();
  expect(core.score()).toBe(0);
});

test("rotateMap():size=2 map", () => {
  const origin = [
    [1, 2],
    [3, 4]
  ];
  const after = [
    [3, 1],
    [4, 2]
  ];
  expect(Core.rotateMap(origin).toString()).toBe(after.toString());
});

test("rotateMap():size=4 map", () => {
  const origin = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
  ];
  const after = [
    [13, 9, 5, 1],
    [14, 10, 6, 2],
    [15, 11, 7, 3],
    [16, 12, 8, 4]
  ];
  expect(Core.rotateMap(origin).toString()).toBe(after.toString());
});

test("pleaseOutZero() remove front zero", () => {
  expect(Core.pleaseOutZero([2, 0, 2, 2]).toString()).toBe(
    [2, 2, 2, 0].toString()
  );
  expect(Core.pleaseOutZero([0, 2, 0, 2]).toString()).toBe(
    [2, 2, 0, 0].toString()
  );
});

test("numPlus tow num plus", () => {
  expect(Core.numPlus([2, 0, 2, 2]).toString()).toBe([4, 0, 0, 2].toString());
  expect(Core.numPlus([0, 2, 0, 2]).toString()).toBe([0, 4, 0, 0].toString());
});

test("mergeOneLine() test one line array's merge is OK?", () => {
  expect(Core.mergeOneLine([2, 2, 2, 2]).toString()).toBe(
    [4, 4, 0, 0].toString()
  );
  expect(Core.mergeOneLine([2, 2, 4, 4]).toString()).toBe(
    [4, 8, 0, 0].toString()
  );
  expect(Core.mergeOneLine([2, 0, 2, 4]).toString()).toBe(
    [4, 4, 0, 0].toString()
  );
  expect(Core.mergeOneLine([0, 0, 4, 4]).toString()).toBe(
    [8, 0, 0, 0].toString()
  );
  expect(Core.mergeOneLine([0, 2, 0, 2]).toString()).toBe(
    [4, 0, 0, 0].toString()
  );
});

test("merge() test mutiline to merge is OK?", () => {
  expect(
    Core.merge([
      [0, 2, 0, 2],
      [0, 0, 4, 4]
    ]).toString()
  ).toBe([[4, 0, 0, 0], [[8, 0, 0, 0]]].toString());
});

test("rotateMap() and merge() together is OK?", () => {
  expect(
    Core.rotateMap(
      Core.merge([
        [0, 2, 0, 2],
        [0, 0, 4, 4],
        [2, 2, 4, 4],
        [2, 0, 2, 2]
      ])
    ).toString()
  ).toBe(
    [
      [4, 4, 8, 4],
      [2, 8, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ].toString()
  );
});
