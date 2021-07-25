import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Board from "./components/Board";
import PlayerInfo from "./components/PlayerInfo";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <Switch>
            <Route exact path="/" component={() => <PlayerInfo />} />
            <Route exact path="/board" component={() => <Board />} />
          </Switch>
        </div>
      </Router>
    );
  }
}
