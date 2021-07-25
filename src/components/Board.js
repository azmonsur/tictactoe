import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import About from "./About";

class Board extends Component {
  state = {
    rows: [],
    allowStopGame: null,
    player1: null,
    player2: null,
    clicked: [],
    players: [],
    current_player: "X",
    num_row: 3,
    num_col: 3,
    B: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    game_over: null,
    invalid_move: [],
  };

  componentDidMount() {
    this.drawBoard();
  }

  drawBoard = () => {
    // Reset all states
    const rows = [];
    const { num_row, num_col } = this.state;

    let player1 = null,
      player2 = null,
      allowStopGame = null;
    if (this.props.location.state) {
      player1 = this.props.location.state.player1;
      player2 = this.props.location.state.player2;
      allowStopGame = this.props.location.state.allowStopGame;
    }

    for (let i = 0; i < num_row * num_col; i++) {
      // Create index each cell
      rows.push(i);
    }

    this.setState({ player1 });
    this.setState({ current_player: "X" });
    this.setState({ allowStopGame });
    this.setState({ player2 });
    this.setState({ rows: rows });
    this.setState({ clicked: new Array(num_col * num_row).fill(false) });
    this.setState({ players: new Array(num_col * num_row).fill("") });
    this.setState({ game_over: false });
    this.setState({ invalid_move: [] });
    this.setState({
      B: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    });
    //this.checkForWinner();
  };

  checkForWinner = () => {
    for (let c = 0; c < 3; c++) {
      if (
        this.state.B[0][c] === this.state.B[1][c] &&
        this.state.B[1][c] === this.state.B[2][c] &&
        this.state.B[2][c] !== 0
      )
        return this.state.B[0][c];
    }

    for (let r = 0; r < 3; r++) {
      if (
        this.state.B[r][0] === this.state.B[r][1] &&
        this.state.B[r][1] === this.state.B[r][2] &&
        this.state.B[r][2] !== 0
      )
        return this.state.B[r][0];
    }

    if (
      this.state.B[0][0] === this.state.B[1][1] &&
      this.state.B[1][1] === this.state.B[2][2] &&
      this.state.B[1][1] !== 0
    )
      return this.state.B[0][0];

    if (
      this.state.B[2][0] === this.state.B[1][1] &&
      this.state.B[1][1] === this.state.B[0][2] &&
      this.state.B[0][2] !== 0
    )
      return this.state.B[2][0];

    if (
      this.state.invalid_move.length ===
      this.state.num_row * this.state.num_col - 1
    )
      return "d";
    return false;
  };

  handleButtonClick = (row) => {
    // Populate invalid_move to keep track of moves
    this.setState({ invalid_move: [...this.state.invalid_move, row] });

    // Update clicked button
    this.setState({
      clicked: this.state.clicked.map((click, idx) =>
        idx === row ? true : click
      ),
    });

    // change current player
    setTimeout(() => {
      this.setState({
        current_player: this.state.current_player === "X" ? "O" : "X",
      });
    }, 1);

    const [c, r] = [
      row % this.state.num_col,
      Math.floor(row / this.state.num_col),
    ];

    const newCoord = [...this.state.B];
    newCoord[r][c] = this.state.current_player;

    this.setState({
      B: newCoord,
    });

    this.setState({
      players: this.state.players.map((player, idx) =>
        idx !== row ? player : this.state.current_player
      ),
    });

    this.setState({ disabled: !this.state.disabled });

    if (this.checkForWinner()) {
      this.setState({ game_over: true });
      this.setState({ allowStopGame: false });
      this.setState({ clicked: new Array(9).fill(true) });
    }

    setTimeout(() => {
      if (
        this.state.player2 === "Computer" &&
        this.state.current_player === "O" &&
        !this.checkForWinner()
      ) {
        //this.setState({ current_player: "O" });
        this.computerToPlay();
      }
    }, 500);
  };

  computerToPlay = () => {
    let randomChoice = this.state.invalid_move[
      Math.floor(Math.random() * this.state.invalid_move.length)
    ];

    randomChoice += Math.floor(Math.random() * 4);

    if (randomChoice > 8) {
      randomChoice -= 4;
    }
    while (this.state.invalid_move.includes(randomChoice)) {
      randomChoice = this.state.invalid_move[
        Math.floor(Math.random() * this.state.invalid_move.length)
      ];
      randomChoice += Math.floor(Math.random() * 5);

      if (randomChoice > 8) {
        randomChoice -= 5;
      }
    }

    //this.setState({ current_player: "O" });
    this.handleButtonClick(randomChoice);
  };

  render() {
    if (!this.props.location.state) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    const { num_row, num_col } = this.state;

    return (
      <div className="game">
        {
          <div
            style={{
              transform: this.state.game_over
                ? "translate(-50%, -50%)"
                : "translate(-50%, -500%)",
            }}
            className="game-over"
          >
            Game Over <br />
            <span style={{ fontSize: "0.6em" }}>
              {this.checkForWinner() === "X"
                ? `${this.state.player1} wins`
                : this.checkForWinner() === "O"
                ? `${this.state.player2} wins`
                : "It is a draw"}
            </span>
          </div>
        }
        <div
          style={{
            gridTemplateColumns: `repeat(${num_col}, 1fr)`,
            gridTemplateRows: `repeat(${num_row}, 1fr)`,
          }}
          className="board"
        >
          {this.state.rows.map((row) => (
            <button
              key={row}
              className={`cell ${this.state.players[row] && "dance-anim"}`}
              disabled={this.state.clicked[row] === true}
              onClick={this.handleButtonClick.bind(this, row)}
            >
              <span style={{ fontSize: `${(5 / num_row) * 3.5}em` }}>
                {this.state.players[row]}
              </span>
            </button>
          ))}
        </div>
        <About />
        <div className="action-buttons">
          <button
            onClick={() => this.drawBoard()}
            className="reset"
            disabled={!this.state.game_over}
          >
            Reset Board
          </button>
          <button
            onClick={() => this.props.history.push("/")}
            className="new-game"
            disabled={this.state.allowStopGame}
          >
            New Game
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Board);
