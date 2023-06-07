// Generate the game board cells dynamically
const gameBoardContainer = document.getElementById('game-board');
const boardSize = 15;
var stoneSize=30;
const smallScreen = window.innerWidth<=600;
if(smallScreen){
    stoneSize=18
}
const boardPadding =20;

var gameBoard = []
initGameBoard();

// Players
//X:White O:black
const players = ['X', 'O'];
let currentPlayer = 0;

// Game state
let gameState = 'ongoing';

var winList = [];

function handleGameBoardClick(event) {
    if (gameState !== 'ongoing') {
      return; // Ignore the click if the game is not ongoing
    }
    const rect = gameBoardContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - boardPadding;
    const offsetY = event.clientY - rect.top - boardPadding;
  
    // Calculate the row and column based on the click position
    const cellSize = (rect.width-(2*boardPadding)) / boardSize;
    
    var col = Math.round(offsetX / cellSize);
    var row = Math.round(offsetY / cellSize);
    if(col<0){
        col=0;
    }
    if(col>boardSize){
        col=boardSize;
    }
    if(row<0){
        row=0;
    }
    if(row>boardSize){
        row=boardSize;
    }
    /*
    console.log(`row: ${row}`);
    console.log(`col: ${col}`);
    */
    if(gameBoard[row][col]!==null){
      return;
    }
    if(row<=boardSize && col<=boardSize && row>=0 && col>=0){
        placeStone(row, col);
        const aiMove = findBestMove(gameBoard,2);
        console.log(aiMove);

        placeStone(aiMove.row, aiMove.col);
        renderAllStone();
    }
  }

function initGameBoard(){
    for (let i = 0; i <= boardSize; i++) {
        gameBoard[i] = new Array(boardSize+1).fill(null);
    }
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            gameBoardContainer.appendChild(cell);
        }
    }
}

function renderAllStone(){
    clearStones();
    const rect = gameBoardContainer.getBoundingClientRect();
    const cellSize = (rect.width-(2*boardPadding)) / boardSize;
    const offset = stoneSize/2;
    var left = rect.left -2;
    var top = rect.top-2;
    /*
    console.log(`Cell: ${cellSize}`);
    console.log(`rectH: ${rect.height}`);
    console.log(`CellH: ${(rect.height-(2*boardPadding)) / boardSize}`);
    console.log(`offset: ${offset}`);
    console.log(`left: ${left}`);
    console.log(`top: ${top}`);
    */
    var x = left+boardPadding-offset; var y=top+boardPadding-offset;
    for(let i=0; i<=boardSize; i++){
        for(let j=0;j<=boardSize; j++){
            renderStone(x+j*cellSize,y+i*cellSize, gameBoard[i][j], i,j);
        }
    }
    if(winList!==null && winList.length>0){
      for(var {row, col} of winList){
        console.log($(`.row${row}_col${col}`));
        $(`.row${row}_col${col}`).addClass("winner");
      }
    }
}

function clearStones() {
    const stones = document.getElementsByClassName('stone');
    while (stones.length > 0) {
      stones[0].parentNode.removeChild(stones[0]);
    }
  }

function renderStone(x,y, player, i,j){
    if(player!==null){
        /*
        console.log(`xPos: ${x}`);
        console.log(`yPos: ${y}`);
        */
        const stoneElement = document.createElement('div');
        stoneElement.classList.add('stone');
        stoneElement.classList.add(player.toLowerCase());
        $(stoneElement).css({ top: y+"px" });
        $(stoneElement).css({ left: x+"px" });
        $(stoneElement).addClass(`row${i}_col${j}`);
        gameBoardContainer.appendChild(stoneElement);
    }
}

// Function to place a stone on the game board
function placeStone(row, col) {
    if (gameState !== 'ongoing' || gameBoard[row][col] !== null) {
      return; // Ignore the move if the game is not ongoing or the position is already occupied
    }
  
    gameBoard[row][col] = players[currentPlayer];
  
    // Check for a win
    if (checkWin(row, col)) {
      gameState = 'win';
      var msg = (players[currentPlayer]==='X'?"White":"Black") + "</br>"+' Wins!';

      $("#Lwinner").html(msg);
      $("#Lwinner").show();
      return;
    }
  
    // Check for a draw
    if (checkDraw(gameBoard)) {
      gameState = 'draw';
      var msg ='The game ends in a draw!';
      $("#Lwinner").text(msg);
      $("#Lwinner").show();
      return;
    }
  
    // Switch to the next player
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  // Function to check for a win condition
function checkWin(row, col) {
    const stone = gameBoard[row][col];
    var winningList =[];
    // Check horizontally
    let count = 0;
    let i = col;
    while (i >= 0 && gameBoard[row][i] === stone) {
      winningList.push({row:row,col:i});
      count++;
      i--;
    }
    i = col + 1;
    while (i <= boardSize && gameBoard[row][i] === stone) {
      winningList.push({row:row,col:i});
      count++;
      i++;
    }
    if (count >= 5) {
      winList =winningList;
      return true;
    }
  
    // Check vertically
    winningList =[];
    count = 0;
    let j = row;
    while (j >= 0 && gameBoard[j][col] === stone) {
      winningList.push({row:j,col:col});
      count++;
      j--;
    }
    j = row + 1;
    while (j <= boardSize && gameBoard[j][col] === stone) {
      winningList.push({row:j,col:col});
      count++;
      j++;
    }
    if (count >= 5) {
      winList =winningList;
      return true;
    }
  
    // Check diagonally (top-left to bottom-right)
    winningList =[];
    count = 0;
    i = col;
    j = row;
    while (i >= 0 && j >= 0 && gameBoard[j][i] === stone) {
      winningList.push({row:j,col:i});
      count++;
      i--;
      j--;
    }
    i = col + 1;
    j = row + 1;
    while (i <= boardSize && j <= boardSize && gameBoard[j][i] === stone) {
      winningList.push({row:j,col:i});
      count++;
      i++;
      j++;
    }
    if (count >= 5) {
      winList =winningList;
      return true;
    }
  
    // Check diagonally (top-right to bottom-left)
    count = 0;
    winningList =[];
    i = col;
    j = row;
    while (i <= boardSize && j >= 0 && gameBoard[j][i] === stone) {
      winningList.push({row:j,col:i});
      count++;
      i++;
      j--;
    }
    i = col - 1;
    j = row + 1;
    while (i >= 0 && j <= boardSize && gameBoard[j][i] === stone) {
      winningList.push({row:j,col:i});
      count++;
      i--;
      j++;
    }
    if (count >= 5) {
      winList =winningList;
      return true;
    }
  
    return false;
  }
  
  // Function to check for a draw condition
  function checkDraw(board) {
    for (let row = 0; row <= boardSize; row++) {
      for (let col = 0; col <= boardSize; col++) {
        if (board[row][col] === null) {
          return false; // If there's an empty position, the game is not a draw
        }
      }
    }
    return true; // All positions are filled, indicating a draw
  }

  function reset(){
    clearStones();
    for (let i = 0; i <= boardSize; i++) {
        gameBoard[i] = new Array(boardSize+1).fill(null);
    }
    $("#Lwinner").hide();
    gameState = 'ongoing';
    winList =[];
    currentPlayer =0;
  }