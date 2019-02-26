import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import './App.css';

import { Create, Home, Vote, Graph, NoMatch } from "./components";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/create" component={Create} />
        <Route exact path="/not-found" component={NoMatch} />
        <Route exact path="/:id" component={Vote} />
        <Route exact path="/:id/view" component={Graph} />
        <Route exact path="/" component={Home} />
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default App;
