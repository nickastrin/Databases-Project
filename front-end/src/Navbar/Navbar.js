import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <span className="navbar-logo">Hotel California</span>
        <NavLink
          className="navbar-item"
          activeClassName="selected"
          exact
          to="/"
        >
          Home
        </NavLink>

        <NavLink
          className="navbar-item"
          activeClassName="selected"
          exact
          to="/services"
        >
          Services
        </NavLink>
        <NavLink
          className="navbar-item"
          activeClassName="selected"
          exact
          to="/frequency"
          style={{ float: "right", width: "200px" }}
        >
          Visit Frequency
        </NavLink>
        <NavLink
          className="navbar-item"
          activeClassName="selected"
          exact
          to="/infected"
          style={{ float: "right", width: "200px" }}
        >
          COVID-19 Tracker
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
