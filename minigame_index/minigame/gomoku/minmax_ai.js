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

function findBestMove(board, maxDepth, userMove) {
    let bestMove = null;
    opponentWinningMove= [];
    for (let depth = 1; depth <= maxDepth; depth++) {
        const { move, eval } = alphaBetaPruning(board, depth, -Infinity, Infinity, true, userMove);

        if (eval === Infinity) {
            // Found a winning move, no need to search further
            return move;
        }

        bestMove = move;
    }
    return bestMove;
}

function generatePossibleMoves(board, move, player) {
    const possibleMoves = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === player) {
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
    
    let endStoneFromAllDirection = findAnotherEnd(board, move);
    endStoneFromAllDirection.push(move);
    for(let {row,col} of endStoneFromAllDirection){
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (isValidCell(board, newRow, newCol) && board[newRow][newCol] === null) {
                    if(!possibleMoves.find(item => item.col === newCol && item.row === newCol)){
                        possibleMoves.push({ row: newRow, col: newCol });
                    }
                }
            }
        }
    }

    return possibleMoves;
  }

function findAnotherEnd(board, move) {
    const player = board[move.row][move.col];
    const directions = [];
    const rows = board.length;
    const cols = board[0].length;

    const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
    const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

    for (let i = 0; i < 8; i++) {
        const endStones = [];
        let currentRow = move.row + dy[i];
        let currentCol = move.col + dx[i];

        while (currentRow >= 0 && currentRow < rows && currentCol >= 0 && currentCol < cols) {
            if (board[currentRow][currentCol] !== player) {
                break;
            }

            endStones.push({ col: currentCol, row: currentRow });
                currentRow += dy[i];
                currentCol += dx[i];
        }

        if (endStones.length > 0) {
            directions.push(endStones[endStones.length-1]);
        }
    }
    return directions;
}

function isValidCell(board, row, col) {
    const rowCount = board.length;
    const colCount = board[0].length;
    return row >= 0 && row < rowCount && col >= 0 && col < colCount;
}

function makeMove(board, move, player){
    const {row,col} = move;
    board[row][col] = player;
}

function undoMove(board, move){
    const {row,col} = move;
    board[row][col] = null;
}


function alphaBetaPruning(board, depth, alpha, beta, maximizingPlayer, move) {
    if (depth === 0 || isGameOver(board, move)) {
      return { eval: evaluate(board, move), move:move};
    }
    let bestEval = maximizingPlayer ? -Infinity : Infinity;
    let bestMove = null;
    let otherInfinity =false;
    let player = maximizingPlayer?aiPlayer:opponentPlayer;
    for (let newMove of generatePossibleMoves(board, move, player)) {
        makeMove(board, newMove, maximizingPlayer ? aiPlayer : opponentPlayer);
        let { eval } = alphaBetaPruning(board, depth - 1, alpha, beta, !maximizingPlayer, newMove);
        undoMove(board, newMove);
        if(otherInfinity && eval!==-Infinity){
            eval =Infinity;
        }
        if(eval===-Infinity){
            otherInfinity =true;
        }
        if(!maximizingPlayer && eval===-Infinity && !opponentWinningMove.find(item => item.col === newMove.col && item.row === newMove.row)){
            opponentWinningMove.push(newMove);
        }
        if (maximizingPlayer) {
            if (eval > bestEval) {
            bestEval = eval;
            bestMove = newMove;
            alpha = Math.max(alpha, eval);
            }
        } else {
            if (eval < bestEval) {
            bestEval = eval;
            bestMove = newMove;
            beta = Math.min(beta, eval);
            }
        }

        if (beta <= alpha) {
            break;
        }
    }
    return { eval: bestEval, move: bestMove };
}

function isGameOver(board, move){
    if(checkDraw(board)){
        return true;
    }
    // Check for a win
    const players = [aiPlayer, opponentPlayer];
    for (let player of players) {
        if (isWin(board, player, move)) {
            return true;
        }
    }
    return false;
}

function evaluate(board, move) {
  
    // Evaluation weights for different scenarios
    //const winScore = 1000000000;
    const winScore = Infinity;
    const gamma =1.5
  
    // Check for a win
    if (isWin(board, aiPlayer, move)) {
      return winScore;
    } else if (isWin(board, opponentPlayer, move)) {
      return -winScore;
    }
  
    let score = 0;
  
    
    let s1 = countThreats(board, aiPlayer, move);
    let s2 = countThreats(board, opponentPlayer, move);
    score = gamma *s1 -  s2;
    // Return the final evaluation score
    return score;
}

function isWin(board, player, move) {
    const rowCount = board.length;
    const colCount = board[0].length;
    const { row, col } = move;

    // Check rows for a win
    for (let c = Math.max(0, col - 4); c <= Math.min(colCount - 5, col); c++) {
        let foundWin = true;
        for (let i = 0; i < 5; i++) {
            if (board[row][c + i] !== player) {
                foundWin = false;
                break;
            }
        }
        if (foundWin) {
            return true;
        }
    }

    // Check columns for a win
    for (let r = Math.max(0, row - 4); r <= Math.min(rowCount - 5, row); r++) {
        let foundWin = true;
        for (let i = 0; i < 5; i++) {
            if (board[r + i][col] !== player) {
                foundWin = false;
                break;
            }
        }
        if (foundWin) {
            return true;
        }
    }

    // Check diagonals (both directions) for a win
    const startRow1 = Math.max(0, row - 4);
    const endRow1 = Math.min(rowCount - 5, row);
    const startCol1 = Math.max(0, col - 4);
    const endCol1 = Math.min(colCount - 5, col);

    for (let r = startRow1, c = startCol1; r <= endRow1 && c <= endCol1; r++, c++) {
        let foundWin1 = true;
        for (let i = 0; i < 5; i++) {
            if (board[r + i][c + i] !== player) {
                foundWin1 = false;
                break;
            }
        }
        if (foundWin1) {
            return true;
        }
    }

    const startRow2 = Math.max(0, row - 4);
    const endRow2 = Math.min(rowCount - 5, row);
    const startCol2 = Math.max(4, col);
    const endCol2 = Math.min(colCount - 1, col + 4);

    for (let r = startRow2, c = startCol2; r <= endRow2 && c >= endCol2; r++, c--) {
        let foundWin2 = true;
        for (let i = 0; i < 5; i++) {
            if (board[r + i][c - i] !== player) {
                foundWin2 = false;
                break;
            }
        }
        if (foundWin2) {
            return true;
        }
    }

    return false;
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

function countThreats(board, player, move) {
    let threatsCount = 0;
    const rowCount = board.length;
    const colCount = board[0].length;
    const { row, col } = move;

    // Check rows for threats
    for (let c = Math.max(0, col - 5); c <= Math.min(colCount - 6, col); c++) {
        const sequence = board[row].slice(c, c + 6);
        threatsCount += PotentialThreat(sequence, player);
    }

    // Check columns for threats
    for (let r = Math.max(0, row - 5); r <= Math.min(rowCount - 6, row); r++) {
        const sequence = [];
        for (let i = r; i < r + 6; i++) {
            sequence.push(board[i][col]);
        }
        threatsCount += PotentialThreat(sequence, player);
    }

    // Check diagonals (both directions) for threats
    const startRow1 = Math.max(0, row - 5);
    const endRow1 = Math.min(rowCount - 6, row);
    const startCol1 = Math.max(0, col - 5);
    const endCol1 = Math.min(colCount - 6, col);

    for (let r = startRow1, c = startCol1; r <= endRow1 && c <= endCol1; r++, c++) {
        const sequence1 = [
            board[r][c],
            board[r + 1][c + 1],
            board[r + 2][c + 2],
            board[r + 3][c + 3],
            board[r + 4][c + 4],
            board[r + 5][c + 5]
        ];
        threatsCount += PotentialThreat(sequence1, player);
    }

    for (let r = startRow1, c = endCol1; r <= endRow1 && c >= startCol1; r++, c--) {
        const sequence2 = [
            board[r + 5][c],
            board[r + 4][c + 1],
            board[r + 3][c + 2],
            board[r + 2][c + 3],
            board[r + 1][c + 4],
            board[r][c + 5]
        ];
        threatsCount += PotentialThreat(sequence2, player);
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
