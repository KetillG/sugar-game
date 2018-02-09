// const testBoard = 
// [
//     [0,0,0,0,0],
//     [0,0,1,2,0],
//     [0,0,2,0,0],
//     [0,1,0,2,0],
//     [0,0,0,1,0]
// ];

// The boards are stored here
const hashedBoards = {};

const computeBestMove = (board, player) => {
    console.time("Timer");

// computeBestMove(testBoard, 2);

// console.timeEnd("Timer");
    // Get score for each move
    let topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    let midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    let botMove = computeMoveForRow(deepCopyBoard(board), 3, player);

    // Force score to min if the move is not allowed
    if(!isNextMoveAllowed(board, 1, player)) topMove = -2;
    if(!isNextMoveAllowed(board, 2, player)) midMove = -2;
    if(!isNextMoveAllowed(board, 3, player)) botMove = -2;
    
    // Create an array of scores
    const scores = [topMove, midMove, botMove];

    console.log('=== RUN ===');
    
    console.log(scores);
    console.timeEnd("Timer");
    // Find the index of highest score
    return scores.indexOf(Math.max(...scores)) + 1;
}

// Always treats current player as the player moving horizontal
const getBestMove = (board, player) => {
    // Initialize each move as illegal
    let topMove = -2;
    let midMove = -2;
    let botMove = -2;
    
    // If the move is allowed then overwrite then illegal score
    if(isNextMoveAllowed(board, 1, player)) topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    if (topMove === 1) return 1;
    if(isNextMoveAllowed(board, 2, player)) midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    if (midMove === 1) return 1;
    if(isNextMoveAllowed(board, 3, player)) botMove = computeMoveForRow(deepCopyBoard(board), 3, player);
    
    // Check if current player could not move at all, then return next move for the previous player skipping this player turn
    let max = Math.max(topMove, midMove, botMove);
    if(max === -2) max = -getBestMove(transposeBoard(board), getNextPlayer(player));
    
    return max;
    
}

// Check if next move is allowed, returns true if so
const isNextMoveAllowed = (board, rowIndex, player) => {
    // Gets the current row
    const row = board[rowIndex];
    // Next position
    const nextMove = getNextMove(row, player);

    return nextMove !== -1;
}

const computeMoveForRow = (board, rowIndex, player) => {
    // Gets the current row
    const row = board[rowIndex];
    // Next position
    const nextMove = getNextMove(row, player);

    // Current position
    const playerPosition = getPlayerPosition(row, player);
    
    // Update position
    board[rowIndex][playerPosition] = 0;
    board[rowIndex][nextMove] = player;
    
    // Check if this won the game
    if(checkIfWon(board)) return 1;
    
    // Check if current board has already been computed, if so return the known score
    const boardScore = getBoardScore(board);
    if(boardScore) return hashedBoards[board];
    
    // If board hasnt been computed then compute it
    const computedScore = -getBestMove(transposeBoard(board), getNextPlayer(player));
    
    // Store the computed score for the board
    hashedBoards[board] = computedScore;

    return computedScore;
}

// Return true if current board score has been computed
const getBoardScore = (board) => hashedBoards.hasOwnProperty(board);

// Returns next move for the player
const getNextMove = (row, player) => {
    const playerPosition = getPlayerPosition(row, player);
    // If at end
    if ( playerPosition === 4 ) return -1;
    // Check if next is free
    if ( row[playerPosition + 1] === 0 ) return playerPosition + 1;
    // Else check if next next is free
    if ( row[playerPosition + 2] === 0 ) return playerPosition + 2;
    // Else cant move
    return -1;
}

// Flips the array
const transposeBoard = (board) => board.map((col, i) => board.map(row => row[i]));

// Current position
const getPlayerPosition = (row, player) => row.indexOf(player);

// Returns true if current player has won
const checkIfWon = (board) => board[1][4] !== 0 && board[2][4] !== 0 && board[3][4] !== 0;

// Returns next player
const getNextPlayer = (player) => player === 1 ? 2 : 1;

// Copies array of array with dereferencing
const deepCopyBoard = (board) => board.map(row => [...row]);

// console.time("Timer");

// computeBestMove(testBoard, 2);

// console.timeEnd("Timer");

module.exports = {
    computeBestMove,
    transposeBoard,
    getNextMove,
    getPlayerPosition,
};