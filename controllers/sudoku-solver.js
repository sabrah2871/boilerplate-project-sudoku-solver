class SudokuSolver {

  validate(puzzleString) {
    const regex = /[1-9|\.]/g;
    if (!puzzleString) return { error: 'Required field missing' }
    else if (String(puzzleString).match(regex).length != 81 && puzzleString.length === 81) return { error: 'Invalid characters in puzzle' }
    else if (puzzleString.length != 81) return { error: 'Expected puzzle to be 81 characters long' }
    else return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // console.log('check ROW placement');//////////////////
    let input = [];
    if (!Array.isArray(puzzleString)){
      for (let i = 0; i < 9; i++) {
        let colArr = [];
        for (let j = 0; j < 9; j++) {
          colArr.push(puzzleString.charAt(i*9 + j) === '.' ? 0 : Number(puzzleString.charAt(i*9 + j)))
        };
        input.push(colArr);
      };
    } else input = puzzleString;

    if (input[row][column] != value){
      for (let x = 0; x < 9; x++) {
        // Check row
        // console.log(input[row][x]);////////////////////
        if (input[row][x] == value) return {valid: false, conflict: ["row"]};//return false;
      };
    };
    return {valid: true, conflict: []};
  }

  checkColPlacement(puzzleString, row, column, value) {
    // console.log('check COLUMN placement');//////////////////
    let input = [];
    if (!Array.isArray(puzzleString)){
      for (let i = 0; i < 9; i++) {
        let colArr = [];
        for (let j = 0; j < 9; j++) {
          colArr.push(puzzleString.charAt(i*9 + j) === '.' ? 0 : Number(puzzleString.charAt(i*9 + j)))
        };
        input.push(colArr);
      };
    } else input = puzzleString;
    if(input[row][column] != value){
      for (let x = 0; x < 9; x++) {
        // Check column
        // console.log(input[x][column]);////////////////
        if (input[x][column] == value) return {valid: false, conflict: ["column"]};
      };
    };
    return {valid: true, conflict: []};
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // console.log('check REGION placement');//////////////////
    let input = [];
    if (!Array.isArray(puzzleString)){
      for (let i = 0; i < 9; i++) {
        let colArr = [];
        for (let j = 0; j < 9; j++) {
          colArr.push(puzzleString.charAt(i*9 + j) === '.' ? 0 : Number(puzzleString.charAt(i*9 + j)))
        };
        input.push(colArr);
      };
    } else input = puzzleString;

    if (input[row][column] != value) {
      for (let x = 0; x < 9; x++) {
        // check 3x3 grid
        const startRow = 3 * Math.floor(row / 3);
        const startCol = 3 * Math.floor(column / 3);
        const boxRow = startRow + Math.floor(x / 3);
        const boxCol = startCol + (x % 3);

        // console.log(input[boxRow][boxCol]);////////////////////
        if (input[boxRow][boxCol] == value) return {valid: false, conflict: ["region"]};
      };
    };
    return {valid: true, conflict: []}; 
  }

  solve(puzzleString) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleString[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (
              this.checkColPlacement(puzzleString, row, col, num).valid &&
              this.checkRowPlacement(puzzleString, row, col, num).valid &&
              this.checkRegionPlacement(puzzleString, row, col, num).valid
            ) {
              puzzleString[row][col] = num;
              if (this.solve(puzzleString)) return true;
              puzzleString[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

