const testBoard = 
[
    [0,1,1,1,0],
    [2,0,0,0,0],
    [2,0,0,0,0],
    [2,0,0,0,0],
    [0,0,0,0,0]
];

const hashedBoards = {};

computeBestMove = (board, player) => {
    const topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    const midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    const botMove = computeMoveForRow(deepCopyBoard(board), 3, player);

    console.log(topMove);
    console.log(midMove);
    console.log(botMove);

    

}


// Always treats current player as the player moving horizontal
getBestMove = (board, player) => {
    
    const topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    const midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    const botMove = computeMoveForRow(deepCopyBoard(board), 3, player);
    
    const score = topMove + midMove + botMove;
    //console.log(score);
    return score
}

computeMoveForRow = (board, rowIndex, player) => {

    const row = board[rowIndex];
    // Next position
    const nextMove = getNextMove(row, player);
    // If end hit then exit
    
    if(nextMove === -1) return 0;
    // Current position
    playerPosition = getPlayerPosition(row, player);
    // Update position
    
    board[rowIndex][playerPosition] = 0;
    board[rowIndex][nextMove] = player;
    
    // Check if this won the game
    if(checkIfWon(board)) return 1;
    
    // Switch players and go deeper into game tree
    //console.log('kkk');
    
    // Check if current board has already been computed
    const boardScore = getBoardScore(board);
    if(boardScore) return hashedBoards[board];
    
    // If board hasnt been computed then compute it
    const computedScore = -getBestMove(transposeBoard(board), getNextPlayer(player));

    // Store the computed score for the board
    hashedBoards[board] = computedScore;

    return computedScore;
}

getBoardScore = (board) => hashedBoards.hasOwnProperty(board);

// Returns next move for the player
getNextMove = (row, player) => {
    playerPosition = getPlayerPosition(row, player);
    
    if ( playerPosition === 4 ) return -1;
    if ( row[playerPosition + 1] === 0 ) return playerPosition + 1;
    if ( row[playerPosition + 2] === 0 ) return playerPosition + 2;
    return -1;
}

// Flips the array
transposeBoard = (board) => board.map((col, i) => board.map(row => row[i]));

// Current position
getPlayerPosition = (row, player) => row.indexOf(player);

// Returns true if current player has won
checkIfWon = (board) => board[1][4] !== 0 && board[2][4] !== 0 && board[3][4] !== 0;

// Returns next player
getNextPlayer = (player) => player === 1 ? 2 : 1;

// Copies array of array with dereferencing
deepCopyBoard = (board) => board.map(row => [...row]);

// console.time("Timer");

// computeBestMove(testBoard, 2);

// console.timeEnd("Timer");