import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Navbar from "../Navbar/Navbar.js";
import Home from "../Home/Home.js";
import Services from "../Services/Services.js";
import Infected from "../Infected/Infected.js";
import Frequency from "../Frequency/Frequency.js";

import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/services">
            <Services />
          </Route>
          <Route path="/infected">
            <Infected />
          </Route>
          <Route path="/frequency">
            <Frequency />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
