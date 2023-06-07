const aiPlayer = 'O'; //Black
const opponentPlayer = 'X'; //White

function findBestMove(board, depth) {
    let bestEval = -Infinity;
    let bestMove = {row:0,col:0};
    for (let move of generatePossibleMoves(board)) {
        const newBoard = makeMove(board, move, aiPlayer);
        const eval = alphaBetaPruning(newBoard, depth - 1, -Infinity, Infinity, false);
        console.log(`row:${move.row} col:${move.col} eval:${eval}`)

        if (eval > bestEval) {
            bestEval = eval;
            bestMove = move;
        }
    }

    return bestMove;
}

function generatePossibleMoves(board) {
    const possibleMoves = [];
    const MoveTaken = [];
    for (let curRow = 0; curRow < board.length; curRow++) {
        for (let curCol = 0; curCol < board[curRow].length; curCol++) {
            if (board[curRow][curCol] != null) {
                MoveTaken.push({ curRow, curCol });
            }
        }
    }
    for(let move of MoveTaken){
        var {curRow, curCol} =move;
        for(let row=curRow-1; row<=curRow+1;row++){
            for(let col=curCol-1; col<=curCol+1;col++){
                if (row>=0 && row<board.length && col>=0 && col<board.length  && 
                    board[row][col] === null && !possibleMoves.includes({ row, col })) {
                    possibleMoves.push({ row, col });
                }
            }
        }
    }

    return possibleMoves;
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
    let player = maximizingPlayer?aiPlayer:opponentPlayer;
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let move of generatePossibleMoves(board)) {
        const newBoard = makeMove(board, move, player);
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
        const newBoard = makeMove(board, move, player);
        const eval = alphaBetaPruning(newBoard, depth - 1, alpha, beta, true);
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
    if(checkDraw){
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
    const winScore = Infinity;
    const gamma =3.5;
  
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
    console.log(`ai point:${s1}, player point:${s2}`);
    //// Evaluate threats (potential winning moves) for AI player
    //score += countThreats(board, aiPlayer) * threatScore;
    //// Evaluate threats (potential winning moves) for opponent
    //score -= countThreats(board, opponentPlayer) * threatScore;
    //console.log(score);
    //// Evaluate defensive moves to block opponent's threats
    //score += countDefenses(board, aiPlayer) * defenseScore;
    //console.log(score);
    //// Evaluate opponent's defensive moves to block AI's threats
    //score -= countDefenses(board, opponentPlayer) * defenseScore;
    //console.log(score);
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
        for (let col = 0; col <= board.length - 5; col++) {
            const sequence = board[row].slice(col, col + 5);
            threatsCount+=PotentialThreat(sequence, player);
        }
    }

    // Check columns for threats
    for (let col = 0; col < board.length; col++) {
        for (let row = 0; row <= board.length - 5; row++) {
            const sequence = [];
            for (let i = row; i < row + 5; i++) {
                sequence.push(board[i][col]);
                }
            threatsCount+=PotentialThreat(sequence, player);
        }
    }

    // Check diagonals (both directions) for threats
    for (let row = 0; row <= board.length - 5; row++) {
        for (let col = 0; col <= board.length - 5; col++) {
            const sequence1 = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3], board[row + 4][col + 4]];
            const sequence2 = [board[row + 4][col], board[row + 3][col + 1], board[row + 2][col + 2], board[row + 1][col + 3], board[row][col + 4]];
            threatsCount+=PotentialThreat(sequence1, player);
            threatsCount+=PotentialThreat(sequence2, player);
        }
    }

    return threatsCount;
}

function PotentialThreat(sequence, player) {
// Check if the sequence contains the player's stones with an empty space at the beginning or end
//return sequence.includes(player) && (sequence[0] === null || sequence[4] === null);
//check if there is a potential three stones
    const pattern ={
        //4 stones potentially conncted in a row with or without block
        "_OOOO": 500000,
        //3 stones potentially conncted in a row without block
        "_OOO_":80000,
        //3 stones potentially conncted in a row with one block
        "XOOO_":10000,
        //2 stones potentially conncted in a row without block
        "_OO__":1000,
        //else
        "rest":0,
    }
    const opponent =  player === aiPlayer ? opponentPlayer : aiPlayer;
    if(sequence.includes(player)){
        //count for continuous stones
        let maxContinuousCount =0;
        let count =0;
        let bolckCount =0;
        for(let stone of sequence){
            if(stone===player){
                count++;
            }else if(stone===opponent){
                maxContinuousCount = Math.max(maxContinuousCount, count);
                count =0;
                bolckCount++;
            }
        }
        maxContinuousCount = Math.max(maxContinuousCount, count);
        if(maxContinuousCount==4){
            return pattern._OOOO;
        }
        if(maxContinuousCount==3 && bolckCount==0){
            return pattern._OOO_;
        }
        if(maxContinuousCount==3 && bolckCount>=1 && !(sequence[0]===opponent && sequence[-1]===opponent) ){
            return pattern.XOOO_;
        }
        if(maxContinuousCount==2 && bolckCount==0){
            return pattern._OO__;
        }
    }
    return pattern.rest;
}

function countDefenses(board, player) {
    const oppPlayer = player === aiPlayer ? opponentPlayer : aiPlayer;
    return countThreats(board, oppPlayer);
}
