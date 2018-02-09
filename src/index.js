import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import player from './player.js';
import './index.css';


// The square 
function Square(props) {
  return (
    <button className={`square square-${props.value}`} onClick={props.onClick}>
      <p>{props.value}</p>
    </button>
  );
}

class Board extends Component {
  // Renders the board
  renderBoard() {
    // For each square on the board
    const board = this.props.board.map(square => {
      let clickHandler;
      // Add the click handler for clickable squares
      if(square.value > 2) {
        clickHandler = () => this.props.onClick(square.index);
      }
      // Render the square
      return (
        <Square
          value={square.value}
          key={square.index}
          onClick={clickHandler}
        />
      )
    });
    return board;
  }
  render() {
    return (
      <div className="game-board-container">
        {this.renderBoard()}
      </div>
    );
  }
}
  
/*
  -1 unreachable block
  0 is empty block
  1 is player 1
  2 is player 2
  3 is player 1 valid plays
  4 is player 2 valid plays

  turn === true means player 1 is moving
*/

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  // Creates a new initial state board
  resetBoard() {
    const board = [];
    const corners = [0, 4, 20, 24];
    for(let i = 0; i < 25; i++) {
      board[i] = {
        index: i,
        value: 0,
      };
      if(i < 5) board[i].value = 1;
      if(i % 5 === 0) board[i].value = 2;
      if(corners.indexOf(i) !== -1) board[i].value = -1; 
    }
    return board;
  }

  // Initial state of the game for easy resetting
  getInitialState() {
    const initialState = {
      board: this.resetBoard(),
      turn: true,
      history: [this.resetBoard()],
    }
    return initialState;
  }

  // Handles clicking on the square
  handleClick(e) {
    // Copies the old board by dereference
    const board = this.state.board.map(square => {
      const clone = {...square}
      return clone;
    });
    // Gets index of current board in history
    const boardExists = this.state.history.indexOf(this.state.board);
    // If it existst in the history then wipe out history after that state
    const newHistory = boardExists === -1 ? this.state.history : this.state.history.slice(0, boardExists + 1);

    // Checks where the player clicked and updates his position
    if(this.state.turn) {
      if(board[e - 5].value === 1) {
        board[e - 5].value = 0;
        board[e].value = 1;
      } else {
        board[e - 10].value = 0;
        board[e].value = 1;
      }
    } else {
      if(board[e - 1].value === 2) {
        board[e - 1].value = 0;
        board[e].value = 2;
      } else {
        board[e - 2].value = 0;
        board[e].value = 2;
      }
    }

    // Sets the game state to a updated one
    this.setState({
      board,
      turn: !this.state.turn,
      history: [...newHistory, board.map(square => {
        const clone = {...square}
        return clone;
      })],
    });
  }
  // The pc does the next move
  computerTurn() {
    // Turns the board from an array of objects to 2d array of values
    const board = this.state.board
    const boardFlat = board.map(square => square.value);
    const board2d = [];
    for(let i = 0; i < 5; i++) {
      board2d[i] = boardFlat.slice(5 * i, 5 * i + 5);
    }

    if(this.state.turn) {
      const transposedBoard = player.transposeBoard(board2d);
      const bestMoveRow = player.computeBestMove(transposedBoard, 1);
      const bestPositionIndex = player.getNextMove(transposedBoard[bestMoveRow], 1);
      //const bestPosition = bestMoveRow * 5 + bestPositionIndex;
      if(bestPositionIndex < 1) {
        this.setState({
          turn: !this.state.turn,
        });
        return;
      }
      
      // Remove players current position
      transposedBoard[bestMoveRow][player.getPlayerPosition(transposedBoard[bestMoveRow], 1)] = 0;
      // Update the location of the player
      transposedBoard[bestMoveRow][bestPositionIndex] = 1;
      // Reverse the board
      const updatedBoard = player.transposeBoard(transposedBoard);

      const flatUpdatedBoard = updatedBoard.reduce((a, b) => a.concat(b), []);

      const newBoard = flatUpdatedBoard.map((value, i) => {
        return {index: i, value: value};
      });

      this.setState({
        board: newBoard,
        turn: !this.state.turn,
        history: [...this.state.history, newBoard.map(square => {
          const clone = {...square}
          return clone;
        })],
      });
    } else {
      const transposedBoard = board2d;
      const bestMoveRow = player.computeBestMove(transposedBoard, 2);
      const bestPositionIndex = player.getNextMove(transposedBoard[bestMoveRow], 2);
      //const bestPosition = bestMoveRow * 5 + bestPositionIndex;
      if(bestPositionIndex < 1) {
        this.setState({
          turn: !this.state.turn,
        });
        return;
      }

      // Remove players current position
      transposedBoard[bestMoveRow][player.getPlayerPosition(transposedBoard[bestMoveRow], 2)] = 0;
      // Update the location of the player
      transposedBoard[bestMoveRow][bestPositionIndex] = 2;
      // Reverse the board
      const updatedBoard = transposedBoard;

      const flatUpdatedBoard = updatedBoard.reduce((a, b) => a.concat(b), []);

      const newBoard = flatUpdatedBoard.map((value, i) => {
        return {index: i, value: value};
      });

      this.setState({
        board: newBoard,
        turn: !this.state.turn,
        history: [...this.state.history, newBoard.map(square => {
          const clone = {...square}
          return clone;
        })],
      });
    }
    
  }


  // Logic that dynamically adds valid places to the game board state
  addValidPlaces(board) {
    // Player 1
    if(this.state.turn) {
      for(let i = 1; i < 24;i++) {
        if(board[i].value === 1) {
          if(i + 5 < 25 && board[i+5].value === 0) {
            board[i+5].value = 3;
          } else if(i + 10 < 25 && board[i+10].value === 0) {
            board[i+10].value = 3;
          }
        }
      }
    } else { // Player 2
      for(let i = 1; i < 24;i++) {
        if(board[i].value === 2) {
          if(i + 1 < (Math.floor(i / 5) + 1) * 5 && board[i+1].value === 0) {
            board[i+1].value = 4;
          } else if(i + 2 < (Math.floor(i / 5) + 1) * 5 && board[i+2].value === 0) {
            board[i+2].value = 4;
          }
        }
      }
    }
    
    return board
  }
  // Returns true if game over
  gameOver() {
    const board = this.state.board;
    if(!this.state.turn) {
      return board[21].value === 1 && board[22].value === 1 && board[23].value === 1;
    } else {
      return board[9].value === 2 && board[14].value === 2 && board[19].value === 2;
    }
  }
  // Resets the game state
  resetGame() {
    this.setState(this.getInitialState());
  }
  // Handles shifting the game state to an older state
  timeShift(index) {
    this.setState({
      board: this.state.history[index],
      turn: index % 2 === 0,
    });
  }

  render() {
    // Shows which player turn it is
    let status;
    if(this.state.turn) {
      status = 'Player 1 turn';
    } else {
      status = 'Player 2 turn'
    }

    // Checks if a player has won and also adds move indicators for player
    let liveBoard
    if(this.gameOver()) {
      // Board is the static state of the board
      liveBoard = this.state.board;
      // Overwrites the status
      status = this.state.turn ? 'Player 2 wins' : 'Player 1 wins';
    } else {
      // Possible moves are added dynamically to the board
      liveBoard = this.addValidPlaces(this.state.board.map(square => {
        const clone = {...square}
        return clone;
      })); 
    } 

    // Enables history scrolling by creating the sidemenu
    const history = [];
    for(let index in this.state.history) {
      history.push(
        <li key={index} onClick={() => this.timeShift(index)}>
          Move: {index}
        </li>
      );
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            board={liveBoard}
            onClick={e => this.handleClick(e)}
          />
        </div>
        <div className="game-info">
          <button className="reset-game" onClick={() => this.computerTurn()}>
            Make computer play
          </button>
          <div>{status}</div>
          <ul className="game-history">
            {history}
          </ul>
          <button className="reset-game" onClick={() => this.resetGame()}>
            New game
          </button>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  // Adds the game class to root
  ReactDOM.render(<Game />, document.getElementById("root"));
  
