import React, { useState } from "react";
import axios from "axios";

import "../App/Style.css";

require("dotenv").config();
const backendPort = process.env.REACT_APP_BACKEND_PORT;

export default function Quarantine() {
  const [tracker, setTracker] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    setShow(true);
    await axios
      .get(`http://localhost:${backendPort}/infected/people/${tracker}`)
      .then((response) => {
        setData(response.data);
      });
  };

  const renderResult = () => {
    if (data.length !== 0) {
      return (
        <div className="list-questions-wrapper" style={{ marginTop: "20px" }}>
          <ul className="questions-list">
            {data.map((value, key) => {
              return (
                <li key={key}>
                  <span
                    className="username-font"
                    style={{ padding: "15px 10px 10px 5px" }}
                  >
                    {"Client Name: " + value.name}
                  </span>
                  <hr className="divider" />
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  };

  return (
    <div>
      <h1 className="title">
        <span className="normal-font">Input </span>
        <span className="colored-font">NFC ID</span>
        <span className="normal-font">!</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tracker}
          maxLength="5"
          onChange={(e) => setTracker(e.target.value)}
          className="search-bar"
        />
        <input type="submit" className="submit-btn" />
      </form>
      <button
        className="clear-btn"
        onClick={() => {
          setShow(false);
          setData([]);
          setTracker("");
        }}
      >
        Clear
      </button>
      {show && renderResult()}
    </div>
  );
}
