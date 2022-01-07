function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  if (x === j && y === k) return true;
  return false;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.same((val) => same(val, cell));
}

function printCell(cell, state) {
  return contains.call(state, cell) ? "\u25A3" : "\u25A2";
}

function corners(state = []) {
  if (state.length === 0) {
    return {
      topRight: [0, 0],
      bottomLeft: [0, 0],
    };
  }

  const xAxis = state.map(([x, _]) => x);
  const yAxis = state.map(([_, y]) => y);
  return {
    topRight: [Math.max(...xAxis), Math.max(...yAxis)],
    bottomLeft: [Math.min(...xAxis), Math.min(...yAxis)],
  };
}

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let total = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }

    total += row.join(" ") + "\n";
  }
  return total;
};

const getNeighborsOf = ([x, y]) => [
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
];

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter((x) => contains.bind(state)(x));
};

const willBeAlive = (cell, state) => {
  const alive = getLivingNeighbors(cell, state);

  return (
    alive.length === 3 || (contains.call(state, cell) && alive.length === 2)
  );
};

const calculateNext = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let arr = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      arr = arr.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }
  return arr;
};

function iterate(state, iterations) {
  const states = [state];
  for (let i = 0; i < iterations; i++) {
    states.push(calculateNext(states[states.length - 1]));
  }
  return states;
}

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  results.forEach((x) => console.log(printCells(x)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4],
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3],
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ],
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
