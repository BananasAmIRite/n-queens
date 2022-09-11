/* 
Brainstorm: 
maybe place down a queen anywhere on the board first
then place down another queen somewhere that doesn't attack first queen
(the nice thing is that theyre bidirectional so if one queen cant attack 
another, the other cant attack that one)



*/

const deepClone: (arr: string[][]) => string[][] = (arr) => JSON.parse(JSON.stringify(arr));

const flatten: (arr: string[][]) => string[] = (arr) => {
  const a: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      a.push(arr[i][j]);
    }
  }
  return a;
};

function solveNQueens(n: number): string[][] {
  return _solveNQueens(n).map((e) => flatten(removeLimits(e)));
}

function _solveNQueens(
  n: number,
  row: number = 0,
  board: string[][] = createMap(n),
  answerStore: string[][][] = []
): string[][][] {
  if (row >= board.length) {
    answerStore.push(board);
    return answerStore;
  }
  const allowedCols = board[row].reduce<number[]>((b, a, i) => {
    if (a === '.') b.push(i);
    return b;
  }, []);

  for (const col of allowedCols) _solveNQueens(n, row + 1, placeQueen(col, row, deepClone(board)), answerStore);

  return answerStore;
}

function createMap(n: number): string[][] {
  const map: string[][] = [];

  for (let i = 0; i < n; i++) {
    map.push([]);
    for (let j = 0; j < n; j++) {
      map[i].push('.');
    }
  }
  return map;
}

function placeQueen(x: number, y: number, map: string[][]) {
  if (map[y][x] !== '.') return;

  for (let i = 0; i < map[y].length; i++) {
    map[y][i] = '-';
  }

  for (let i = 0; i < map[x].length; i++) {
    map[i][x] = '-';
  }

  // right-left diagonal
  for (let i = -Math.min(y, map[y].length - 1 - x); i <= Math.min(map.length - 1 - y, x); i++) {
    map[y + i][x - i] = '-';
  }

  // left-right diagonal
  for (let i = -Math.min(y, x); i <= Math.min(map.length - 1 - y, map[y].length - 1 - x); i++) {
    map[y + i][x + i] = '-';
  }

  map[y][x] = 'Q';

  return map;
}

function removeLimits(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '-') map[y][x] = '.';
    }
  }
  return map;
}

const n = solveNQueens(8);

console.log(n.length);
