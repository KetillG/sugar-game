import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square square-${props.value}`} onClick={props.onClick}>
      <p>{props.value}</p>
    </button>
  );
}

class Board extends Component {
  renderBoard() {
    const board = this.props.board.map(square => {
      let clickHandler;
      if(square.value > 2) {
        clickHandler = () => this.props.onClick(square.index);
      }
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

  getInitialState() {
    const initialState = {
      board: this.resetBoard(),
      turn: true,
      history: [this.resetBoard()],
    }
    return initialState;
  }

  handleClick(e) {
    const board = this.state.board;
    const boardExists = this.state.history.indexOf(board);
    const newHistory = boardExists === -1 ? this.state.history : this.state.history.slice(0, boardExists + 1);

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
    this.setState({
      board,
      turn: !this.state.turn,
      history: [...newHistory, board.map(square => {
        const clone = {...square}
        return clone;
      })],
    });
  }

  addValidPlaces(board) {
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
    } else {
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

  gameOver() {
    const board = this.state.board;
    if(!this.state.turn) {
      return board[21].value === 1 && board[22].value === 1 && board[23].value === 1;
    } else {
      return board[9].value === 2 && board[14].value === 2 && board[19].value === 2;
    }
  }

  resetGame() {
    this.setState(this.getInitialState());
  }

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
      liveBoard = this.state.board;
      status = this.state.turn ? 'Player 2 wins' : 'Player 1 wins';
    } else {
      liveBoard = this.addValidPlaces(this.state.board.map(square => {
        const clone = {...square}
        return clone;
      })); 
    } 

    // Enables history scrolling
    const history = [];
    for(let index in this.state.history) {
      history.push(
        <li onClick={() => this.timeShift(index)}>
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
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
