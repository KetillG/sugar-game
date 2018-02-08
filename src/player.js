const testBoard = 
[
    [0,0,0,0,0],
    [0,0,0,1,2],
    [0,0,2,0,0],
    [0,2,1,0,0],
    [0,1,0,0,0]
];

transposeBoard = (board) => board.map((col, i) => board.map(row => row[i]));

// Always treats current player as the player moving horizontal
getBestMove = (board, player) => {
    const topMove = getNextMove(board[1], player);
    const midMove = getNextMove(board[2], player);
    const botMove = getNextMove(board[3], player);
    console.log(topMove, midMove, botMove);

    // 
}


// Returns next move for the player
getNextMove = (row, player) => {
    playerPosition = getPlayerPosition(row, player);
    
    if ( playerPosition === 4 ) return -1;
    if ( row[playerPosition + 1] === 0 ) return playerPosition + 1;
    if ( row[playerPosition + 2] === 0 ) return playerPosition + 2;
    return -1;
}

// Current position
getPlayerPosition = (row, player) => row.indexOf(player);

// Returns true if current player has won
checkIfWon = (board) => board[1][4] !== 0 && board[2][4] !== 0 && board[3][4] !== 0;

// Returns next player
getNextPlayer = (player) => player === 1 ? 2 : 1;

getBestMove(testBoard, 2)