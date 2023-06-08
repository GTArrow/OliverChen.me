const aiPlayer = 'O'; //Black
const opponentPlayer = 'X'; //White

const pattern ={
    //4 stones potentially conncted in a row with 2 open ends
    "_OOOO_": 1000000,
    //4 stones potentially conncted in a row with 1 open end
    "XOOOO_":1000000,
    //3 stones potentially conncted in a row with two open ends
    "_OOO_":1000,
    //3 stones potentially conncted in a row with one open end
    "XOOO_":10,
    //2 stones potentially conncted in a row with two open ends
    "_OO_":5,
    //2 stones potentially conncted in a row with one open end
    "XOO_":2,
    //else
    "rest":0,
}

function findBestMove(board, depth) {
    let bestEval = -Infinity;
    let bestMove = null;
    for (let move of generatePossibleMoves(board)) {
        const newBoard = makeMove(board, move, aiPlayer);
        const eval = alphaBetaPruning(newBoard, depth - 1, -Infinity, Infinity, false);
        //console.log(`row:${move.row} col:${move.col} eval:${eval}`)

        if (eval > bestEval) {
            bestEval = eval;
            bestMove = move;
        }
    }
    return bestMove;
}

function generatePossibleMoves(board) {
    const possibleMoves = [];
  
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== null) {
          // Check adjacent cells
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
  
              // Check if adjacent cell is valid and empty
              if (isValidCell(board, newRow, newCol) && board[newRow][newCol] === null) {
                possibleMoves.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }
    }
  
    return possibleMoves;
  }
  
function isValidCell(board, row, col) {
    const rowCount = board.length;
    const colCount = board[0].length;
    return row >= 0 && row < rowCount && col >= 0 && col < colCount;
}

function makeMove(board, move, player){
    const {row,col} = move;
    const newBoard = structuredClone(board);
    newBoard[row][col] = player;
    return newBoard;
}


function alphaBetaPruning(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || isGameOver(board)) {
      return evaluate(board);
    }
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let move of generatePossibleMoves(board)) {
        const newBoard = makeMove(board, move, aiPlayer);
        const eval = alphaBetaPruning(newBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of generatePossibleMoves(board)) {
        const newBoard = makeMove(board, move, opponentPlayer);
        const eval = alphaBetaPruning(newBoard, depth - 1, alpha, beta, true);
        if(eval===-Infinity && !opponentWinningMove.find(item => item.col === move.col && item.row === move.row)){
            opponentWinningMove.push(move);
        }
        //console.log(`move:${move.row} ${move.col} eval:${eval}`)
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) {
          break;
        }
      }
      return minEval;
    }
}

function isGameOver(board){
    if(checkDraw(board)){
        return true;
    }
    // Check for a win
    const players = [aiPlayer, opponentPlayer];
    for (let player of players) {
        if (isWin(board, player)) {
            return true;
        }
    }
    return false;
}

function evaluate(board) {
  
    // Evaluation weights for different scenarios
    //const winScore = 1000000000;
    const winScore = Infinity;
    const gamma =1.5;
  
    // Check for a win
    if (isWin(board, aiPlayer)) {
      return winScore;
    } else if (isWin(board, opponentPlayer)) {
      return -winScore;
    }
  
    let score = 0;
  
    
    let s1 = countThreats(board, aiPlayer);
    let s2 = countThreats(board, opponentPlayer);
    score = s1 - gamma * s2;
    //console.log(`ai point:${s1}, player point:${s2}`);
    // Return the final evaluation score
    return score;
}

function isWin(board, player) {
    const rowCount = board.length;
    const colCount = board[0].length;

    // Check rows for a win
    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col <= colCount - 5; col++) {
            let foundWin = true;
            for (let i = 0; i < 5; i++) {
                if (board[row][col + i] !== player) {
                    foundWin = false;
                    break;
                }
            }
            if (foundWin) {
                return true;
            }
        }
    }

    // Check columns for a win
    for (let col = 0; col < colCount; col++) {
        for (let row = 0; row <= rowCount - 5; row++) {
            let foundWin = true;
            for (let i = 0; i < 5; i++) {
                    if (board[row + i][col] !== player) {
                    foundWin = false;
                    break;
                }
            }
            if (foundWin) {
                return true;
            }
        }
    }

    // Check diagonals (both directions) for a win
    for (let row = 0; row <= rowCount - 5; row++) {
        for (let col = 0; col <= colCount - 5; col++) {
            // Check diagonal (top-left to bottom-right)
            let foundWin1 = true;
            for (let i = 0; i < 5; i++) {
                    if (board[row + i][col + i] !== player) {
                    foundWin1 = false;
                    break;
                }
            }
            if (foundWin1) {
                return true;
            }

            // Check diagonal (bottom-left to top-right)
            let foundWin2 = true;
            for (let i = 0; i < 5; i++) {
                    if (board[row + 4 - i][col + i] !== player) {
                    foundWin2 = false;
                    break;
                }
            }
            if (foundWin2) {
                return true;
            }
        }
    }
    return false;
}

function countThreats(board, player) {
    let threatsCount = 0;

    // Check rows for threats
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col <= board.length - 6; col++) {
            const sequence = board[row].slice(col, col + 6);
            threatsCount+=PotentialThreat(sequence, player);
        }
    }

    // Check columns for threats
    for (let col = 0; col < board.length; col++) {
        for (let row = 0; row <= board.length - 6; row++) {
            const sequence = [];
            for (let i = row; i < row + 6; i++) {
                sequence.push(board[i][col]);
                }
            threatsCount+=PotentialThreat(sequence, player);
        }
    }

    // Check diagonals (both directions) for threats
    for (let row = 0; row <= board.length - 6; row++) {
        for (let col = 0; col <= board.length - 6; col++) {
            const sequence1 = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3], board[row + 4][col + 4], board[row + 5][col + 5]];
            const sequence2 = [board[row + 5][col], board[row + 4][col + 1], board[row + 3][col + 2], board[row + 2][col + 3], board[row+1][col + 4], board[row][col + 5]];
            threatsCount+=PotentialThreat(sequence1, player);
            threatsCount+=PotentialThreat(sequence2, player);
        }
    }

    return threatsCount;
}

function PotentialThreat(sequence, player) {
//check the continuous stones and open ends
    const opponent =  player === aiPlayer ? opponentPlayer : aiPlayer;
    if(sequence.includes(player)){
        //count for continuous stones
        let maxContinuousCount =0;
        let count =0;
        let maxStartIndex=0; let maxEndIndex=0;
        let i=0, j=0;
        while(i<sequence.length && j<sequence.length){
            var stone = sequence[j];
            if(stone===player){
                count++;
                j++;
            }else{
                if(count>maxContinuousCount){
                    maxContinuousCount =count;
                    maxStartIndex =i;
                    maxEndIndex =j;
                }
                count=0
                j++;
                i=j;
            }
        }
        if(count>maxContinuousCount){
            maxContinuousCount =count;
            maxStartIndex =i;
            maxEndIndex =j;
        }
        let openEnd = leftOpenEnd(sequence, maxStartIndex, opponent) + rightOpenEnd(sequence, maxEndIndex, opponent);

        if(maxContinuousCount==4 && openEnd===2){
            //console.log("_OOOO_")
            return pattern._OOOO_;
        }
        if(maxContinuousCount==4 && openEnd===1){
            //console.log("XOOOO_")
            return pattern.XOOOO_;
        }
        if(maxContinuousCount==3 && openEnd===2){
            //console.log("_OOO_")
            return pattern._OOO_;
        }
        if(maxContinuousCount==3 && openEnd===1){
            //console.log("XOOO_")
            return pattern.XOOO_;
        }
        if(maxContinuousCount==2 && openEnd===2){
            //console.log("_OO_")
            return pattern._OO_;
        }
        if(maxContinuousCount==2 && openEnd===1){
            //console.log("XOO_")
            return pattern.XOO_;
        }
    }
    return pattern.rest;
}

function leftOpenEnd(sequence, maxStartIndex, block){
    if(maxStartIndex === 0){
        return 0;
    }
    for(let index =0;index<maxStartIndex;index++){
        if(sequence[index]===block){
            return 0;
        }
    }
    return 1;
}

function rightOpenEnd(sequence, maxEndIndex, block){
    if(maxEndIndex === sequence.length){
        return 0;
    }
    for(let index =maxEndIndex;index<sequence.length;index++){
        if(sequence[index]===block){
            return 0;
        }
    }
    return 1;
}

function countDefenses(board, player) {
    const oppPlayer = player === aiPlayer ? opponentPlayer : aiPlayer;
    return countThreats(board, oppPlayer);
}
