/* 
Idea: 
place a queen at one position in the first row
generate all the possible acceptable queen positions for the second row <-- this may be a bottleneck
recurse with those new queen positions on the new row
- if the row is the last row, add that to the answer

basically generate a tree of possible board combinations where queens do not attack each other

  optimization: since all grids have a reflection over the middle line, 
  we could calculate half of it, then reflect the other half
*/

const deepClone: (arr: string[][]) => string[][] = (arr) => JSON.parse(JSON.stringify(arr));

const flatten: (arr: string[][]) => string[] = (arr) => {
  const a: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    a.push('');
    for (let j = 0; j < arr[i].length; j++) {
      a[i] += arr[i][j];
    }
  }
  return a;
};

function solveNQueens(n: number): string[][] {
  const half = _solveHalfNQueens(n).map((e) => flatten(removeLimits(e)));
  const otherHalf = (
    n % 2 === 0
      ? half
      : half.slice(
          0,
          half.findIndex((e) => e[0].startsWith(`${'.'.repeat(Math.floor(n / 2))}Q`))
        )
  ).map((e) => e.map((a) => a.split('').reverse().join('')));

  return [...half, ...otherHalf];
}

function _solveHalfNQueens(
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

  for (let i = 0; i < Math.ceil(row === 0 ? allowedCols.length / 2 : allowedCols.length); i++) {
    _solveHalfNQueens(n, row + 1, placeQueen(allowedCols[i], row, deepClone(board)), answerStore);
  }

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

const n = solveNQueens(5);

console.log(n);

console.log(n.length);

/*


[["Q....","..Q..","....Q",".Q...","...Q."],["Q....","...Q.",".Q...","....Q","..Q.."],[".Q...","...Q.","Q....","..Q..","....Q"],[".Q...","....Q","..Q..","Q....","...Q."],["..Q..","Q....","...Q.",".Q...","....Q"],["..Q..","....Q",".Q...","...Q.","Q...."],["...Q.","Q....","..Q..","....Q",".Q..."],["...Q.",".Q...","....Q","..Q..","Q...."],["....Q",".Q...","...Q.","Q....","..Q.."],["....Q","..Q..","Q....","...Q.",".Q..."]]
*/
