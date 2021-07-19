import React from 'react';
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./styles.css";

import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";


function App() {

  return (
    <div className="App">
    <Router>
    <Switch>
      <Route exact path="/login">
        <Login/>
      </Route>
      <Route exact path="/register">
        <Register/>
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
    </Router>

    <Footer/>

    </div>
  );
}

export default App;
