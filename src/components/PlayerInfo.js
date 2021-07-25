import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class PlayerInfo extends Component {
  state = {
    player1: "",
    player2: "",
    error: null,
    isComputer: false,
    allowStopGame: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { player1, player2 } = this.state;

    if (!player1 || !player2) {
      this.setState({
        error: `Please fill all the fields`,
      });

      setTimeout(() => {
        this.setState({ error: null });
      }, 5000);
      return;
    }

    if (
      player1.toLocaleLowerCase() === "computer" ||
      (player2.toLocaleLowerCase() === "computer" && !this.state.isComputer) ||
      player1 === player2 ||
      player1.length < 2 ||
      player2.length < 2
    ) {
      this.setState({
        error: `Invalid input.`,
      });

      setTimeout(() => {
        this.setState({ error: null });
      }, 5000);
      return;
    }

    this.props.history.push({
      pathname: "/board",
      state: {
        player1: this.state.player1,
        player2: this.state.player2,
        allowStopGame: !this.state.allowStopGame,
      },
    });
  };

  handleIsComputer = () => {
    this.setState({ isComputer: !this.state.isComputer });

    setTimeout(() => {
      this.state.isComputer
        ? this.setState({ player2: "Computer" })
        : this.setState({ player2: "" });
    }, 1);
  };

  render() {
    return (
      <div className="player-info">
        <form onSubmit={this.handleSubmit}>
          {this.state.error ? (
            <div style={{ color: "red" }} className="error">
              {this.state.error}
            </div>
          ) : (
            <div style={{ visibility: "hidden" }}>hidden</div>
          )}
          <div className="form-group">
            <label htmlFor="">Player 1</label>
            <input
              type="text"
              value={this.state.player1}
              onChange={(e) => this.setState({ player1: e.target.value })}
              autoFocus={this.state.isComputer}
            />
          </div>

          <div className="form-group">
            <label htmlFor="">Player 2</label>
            <input
              type="text"
              value={this.state.player2}
              onChange={(e) => this.setState({ player2: e.target.value })}
              disabled={this.state.isComputer}
            />
          </div>

          <div className="form-group">
            <input
              type="checkbox"
              id="isComputer"
              checked={this.state.isComputer}
              onChange={this.handleIsComputer}
            />{" "}
            <label htmlFor="isComputer">Versus computer</label>
          </div>

          <div className="form-group">
            <input
              type="checkbox"
              id="allowStopGame"
              checked={this.state.allowStopGame}
              onChange={() =>
                this.setState({ allowStopGame: !this.state.allowStopGame })
              }
            />{" "}
            <label htmlFor="allowStopGame">
              Start new game before game is over
            </label>
          </div>
          <button type="submit">Start Game</button>
        </form>
      </div>
    );
  }
}

export default withRouter(PlayerInfo);
