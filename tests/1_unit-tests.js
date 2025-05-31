const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;
let puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidPuzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let incompletePuzzle = '..91.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

let puzzleString = [];
for (let i = 0; i < 9; i++) {
  let colArr = [];
  for (let j = 0; j < 9; j++) {
    colArr.push((puzzle.charAt(i*9 + j) === '.' ? 0 : Number(puzzle.charAt(i*9 + j))))
  };
  puzzleString.push(colArr);
};
let invalidPuzzleString = [];
for (let i = 0; i < 9; i++) {
  let colArr = [];
  for (let j = 0; j < 9; j++) {
    colArr.push((invalidPuzzle.charAt(i*9 + j) === '.' ? 0 : Number(invalidPuzzle.charAt(i*9 + j))))
  };
  invalidPuzzleString.push(colArr);
};
let incompletePuzzleString = [];
for (let i = 0; i < 9; i++) {
  let colArr = [];
  for (let j = 0; j < 9; j++) {
    colArr.push((incompletePuzzle.charAt(i*9 + j) === '.' ? 0 : Number(incompletePuzzle.charAt(i*9 + j))))
  };
  incompletePuzzleString.push(colArr);
};

suite('Unit Tests', () => {

  test('Valid puzzle string of 81 characters', function () {
    assert.equal(solver.validate(puzzle),true);
  });
  
  test(`Puzzle with invalid character (not 1-9 or '.')`, function () {
    const invalidPuzzle = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.propertyVal(solver.validate(invalidPuzzle), 'error','Invalid characters in puzzle');
  });

  test(`Puzzle length not 81`, function () {
    const invalidPuzzle = '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.notEqual(solver.validate(invalidPuzzle),true);
  });

  test(`Valid row`, function () {
    assert.propertyVal(solver.checkRowPlacement(puzzle,2,5,1),'valid',true);
  });

  test(`inValid row`, function () {
    assert.notPropertyVal(solver.checkRowPlacement(puzzle,2,5,2),'valid',true);
  });

  test(`Valid column`, function () {
    assert.propertyVal(solver.checkColPlacement(puzzle,2,5,3), 'valid',true);
  });

  test(`inValid column`, function () {
    assert.notPropertyVal(solver.checkColPlacement(puzzle,2,5,4), 'valid',true);
  });

  test(`Valid 3x3 grid`, function () {
    assert.propertyVal(solver.checkRegionPlacement(puzzle,2,5,6), 'valid',true);
  });

 test(`Invalid 3x3 grid`, function () {
    assert.notPropertyVal(solver.checkRegionPlacement(puzzle,2,5,5), 'valid',true);
  });

 test(`Valid puzzle string pass the solver`, function () {
    let solution = '7,6,9,2,3,5,4,1,8,8,5,1,4,9,6,3,7,2,4,3,2,1,7,8,9,5,6,1,7,4,5,6,9,2,8,3,3,9,5,8,4,2,7,6,1,6,2,8,7,1,3,5,4,9,2,8,3,6,5,7,1,9,4,5,1,6,9,2,4,8,3,7,9,4,7,3,8,1,6,2,5';
    // console.log(`BEFORE puzzleString:\n ${puzzleString.toString()}\n`);////////////
    assert.equal(solver.solve(puzzleString),true);
    // console.log(`AFTER puzzleString:\n ${puzzleString.toString()}\n`);//////////////
    assert.equal(puzzleString.toString(),solution);
  });

 test(`Invalid puzzle string fail the solver`, function () {
    assert.notEqual(solver.solve(invalidPuzzleString),true);
  });

 test(`Solver return incomplete puzzle`, function () {
    assert.notEqual(solver.solve(incompletePuzzleString),true);
  });

});
