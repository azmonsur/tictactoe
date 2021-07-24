import React, { Component } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Board from "./components/Board";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Board} />
      </Router>
    );
  }
}
