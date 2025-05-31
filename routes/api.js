'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  let puzzleString=[];
  function checkPlacement(puzzleString,row,column,value){
    let result = Object;
    let rowIsOk = solver.checkRowPlacement(puzzleString,row,column-1,value);
    let colIsOk = solver.checkColPlacement(puzzleString,row,column-1,value);
    let regionIsOk = solver.checkRegionPlacement(puzzleString,row,column-1,value);
    // console.log(puzzleString[row][column-1]);///////////////
    if (puzzleString[row][column-1] != value) {
    result = {
      valid: rowIsOk.valid && colIsOk.valid && regionIsOk.valid,
      conflict:[...rowIsOk.conflict,...colIsOk.conflict,...regionIsOk.conflict]
    };
    return result.valid ? {valid:true} : result;
    };
  };
  function sudokuToString(input){
    // console.log('SudokuToString :' + input);/////////////
    // convert 9x9 grid value to a string
    let output='';
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        output = output + input[i][j];
      };
    };
    return output;
  };
  function stringToSudoku(input){
    let output=[];
    for (let i = 0; i < 9; i++) {
      let colArr = [];
      for (let j = 0; j < 9; j++) {
        colArr.push((input.charAt(i*9 + j) === '.' ? 0 : Number(input.charAt(i*9 + j))))
      };
      output.push(colArr);
    };
    return output;
  }
  function validateCoordinate(input) {
    if (input.length === 2 
      && input.charAt(0).match(/[a-iA-I]/) 
      && input.charAt(1).match(/[1-9]/)) 
    return true
    else return { error: 'Invalid coordinate'};
  }
  function validateValue(input) {
    if (input.length === 1 
      && input.match(/[1-9]/)) 
    return true
    else return { error: 'Invalid value' };
  }

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle,coordinate,value} = req.body;
      // console.log(`puzzle:\n${puzzle}\ncoordinate:\n${coordinate}\nvalue:\n${value}`)//////////////
      if (puzzle && coordinate && value) {
        if (solver.validate(puzzle) === true) {
          if (validateCoordinate(coordinate) === true) {
            if (validateValue(value) === true) {
              const row = (String(coordinate.charAt(0))).toUpperCase().charCodeAt() - 'A'.charCodeAt();
              const column = coordinate.charAt(1);
              res.json(checkPlacement(puzzle,row,column,value));
            } else res.json(validateValue(value));
          } else res.json(validateCoordinate(coordinate));
        } else res.json(solver.validate(puzzle));
      } else {
        res.json({ error: 'Required field(s) missing' })
      };
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      // console.log(solver.validate(puzzle));/////////////////////////
      if (solver.validate(puzzle)===true){
        puzzleString = stringToSudoku(puzzle);
        if (puzzle.length === 0) res.json({ error: 'Required field missing' })
        else if(puzzle.length != 81) res.json({ error: 'Expected puzzle to be 81 characters long' })
        else if (!solver.validate(puzzle)) res.json({ error: 'Invalid characters in puzzle' })
        else if (solver.solve(puzzleString)) res.json({ solution: String(sudokuToString(puzzleString))})
        else res.json({ error: 'Puzzle cannot be solved' });
      } else res.json(solver.validate(puzzle));
    });
};
