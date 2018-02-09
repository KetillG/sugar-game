const testBoard = 
[
    [0,0,0,0,0],
    [0,0,1,2,0],
    [0,0,2,0,0],
    [0,1,0,2,0],
    [0,0,0,1,0]
];

const hashedBoards = {};

const computeBestMove = (board, player) => {
    let topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    let midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    let botMove = computeMoveForRow(deepCopyBoard(board), 3, player);

    if(!isNextMoveAllowed(board, 1, player)) topMove = -2;
    if(!isNextMoveAllowed(board, 2, player)) midMove = -2;
    if(!isNextMoveAllowed(board, 3, player)) botMove = -2;

    ///console.log('==== END ====');
    
    ///console.log(topMove);
    ///console.log(midMove);
    ///console.log(botMove);

    
    const scores = [topMove, midMove, botMove].map(score => score === 0 ? /*Number.MIN_SAFE_INTEGER*/ 0 :  score);

    console.log(scores);
    
    
    ///console.log('Best index is: ', scores.indexOf(Math.max(...scores)) + 1);
    
    
    ///console.log(' ');
    return scores.indexOf(Math.max(...scores)) + 1;
}


// Always treats current player as the player moving horizontal
const getBestMove = (board, player) => {
    let topMove = -1;
    let midMove = -1;
    let botMove = -1;
    
    if(isNextMoveAllowed(board, 1, player)) topMove = computeMoveForRow(deepCopyBoard(board), 1, player);
    if(isNextMoveAllowed(board, 2, player)) midMove = computeMoveForRow(deepCopyBoard(board), 2, player);
    if(isNextMoveAllowed(board, 3, player)) botMove = computeMoveForRow(deepCopyBoard(board), 3, player);
    
    //const score = topMove + midMove + botMove;
    ///console.log(Math.max(topMove, midMove, botMove));
    //return score
    return Math.max(topMove, midMove, botMove)
}

const isNextMoveAllowed = (board, rowIndex, player) => {
    const row = board[rowIndex];
    // Next position
    const nextMove = getNextMove(row, player);
    // If end hit then exit
    ///console.log('Next move:', nextMove);
    
    return nextMove !== -1;
}

const computeMoveForRow = (board, rowIndex, player) => {

    ///console.log('STARTING');
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
    
    // Switch players and go deeper into game tree
    /////console.log('kkk');
    
    // Check if current board has already been computed
    const boardScore = getBoardScore(board);
    ///console.log(boardScore)
    if(boardScore) return hashedBoards[board];
    
    // If board hasnt been computed then compute it
    const computedScore = -getBestMove(transposeBoard(board), getNextPlayer(player));
    ///console.log('Score ',computedScore);
    
    // Store the computed score for the board
    hashedBoards[board] = computedScore;

    return computedScore;
}

const getBoardScore = (board) => hashedBoards.hasOwnProperty(board);

// Returns next move for the player
const getNextMove = (row, player) => {
    const playerPosition = getPlayerPosition(row, player);
    
    if ( playerPosition === 4 ) return -1;
    if ( row[playerPosition + 1] === 0 ) return playerPosition + 1;
    if ( row[playerPosition + 2] === 0 ) return playerPosition + 2;
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

console.time("Timer");

computeBestMove(testBoard, 2);

console.timeEnd("Timer");

module.exports = {
    computeBestMove,
    transposeBoard,
    getNextMove,
    getPlayerPosition,
};