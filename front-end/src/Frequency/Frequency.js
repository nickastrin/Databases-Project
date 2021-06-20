import React, { useState } from "react";
import axios from "axios";

import "../App/Style.css";

require("dotenv").config();
const backendPort = process.env.REACT_APP_BACKEND_PORT;

export default function Frequency() {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    setShow(true);
    await axios
      .get(`http://localhost:${backendPort}/agegroup/${type}/${duration}`)
      .then((response) => {
        setData(response.data);
      });
  };

  const renderResult = () => {
    if (data.length !== 0) {
      let obj = data;
      let out = [];
      let tmp = [];
      let strng = "";

      for (let i of obj) {
        for (let k in i) {
          strng = k.replace(/_+/g, " ") + ": ";
          strng = strng[0].toUpperCase() + strng.slice(1);
          tmp.push(strng + " " + i[k]);
        }
        out.push(tmp);
        tmp = [];
        strng = "";
      }

      return (
        <div className="list-questions-wrapper" style={{ marginTop: "20px" }}>
          <ul className="questions-list">
            {out.map((value) => {
              console.log(value);
              return (
                <div>
                  <div style={{ padding: "15px 10px 10px 5px" }}>
                    {value.map((x) => {
                      return (
                        <li>
                          <span className="username-font">{x}</span>
                        </li>
                      );
                    })}
                  </div>
                  <hr className="divider" />
                </div>
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
        <span className="normal-font">Check Visiting </span>
        <span className="colored-font">Frequency</span>
        <span className="normal-font">!</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <select
          name="type-list"
          onChange={(e) => setType(e.target.value)}
          value={type}
          className="select-list"
          style={{ marginTop: "180px", marginLeft: "38%" }}
        >
          <option value="">Select a Type</option>
          <option value="mostused">Most Used</option>
          <option value="mostvisited">Most Visited</option>
          <option value="mostcustomers">Most Customers</option>
        </select>
        <select
          name="interval-list"
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
          className="select-list"
        >
          <option value="">Select Interval</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <input type="submit" className="submit-btn" />
      </form>
      <button
        className="clear-btn"
        style={{ top: "300px" }}
        onClick={() => {
          setShow(false);
          setData([]);
          setDuration("");
          setType("");
        }}
      >
        Clear
      </button>
      {show && renderResult()}
    </div>
  );
}
