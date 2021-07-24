import React, { Component } from "react";

class Board extends Component {
  state = {
    rows: [],
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

    for (let i = 0; i < num_row * num_col; i++) {
      // Create index each cell
      rows.push(i);
    }

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
    this.setState({
      current_player: this.state.current_player === "X" ? "O" : "X",
    });

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
      this.setState({ clicked: new Array(9).fill(true) });
    }
  };

  render() {
    const { num_row, num_col } = this.state;

    return (
      <div className="game">
        {
          <div
            style={{
              transform: this.state.game_over
                ? "scale(1) translate(-50%, -50%)"
                : "scale(0)",
            }}
            className="game-over"
          >
            Game Over <br />
            <span style={{ fontSize: "0.6em" }}>
              {this.checkForWinner() === "X"
                ? "Player X wins"
                : this.checkForWinner() === "O"
                ? "Player O wins"
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
        <button
          onClick={() => this.drawBoard()}
          className="reset"
          disabled={!this.state.game_over}
        >
          Reset Board
        </button>
      </div>
    );
  }
}

export default Board;
