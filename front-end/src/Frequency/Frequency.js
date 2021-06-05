import React, { useState } from "react";
import axios from "axios";

export default function Frequency() {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    setShow(true);
    await axios
      .get(`http://localhost:4001/agegroup/${type}/${duration}`)
      .then((response) => {
        setData(response.data);
      });
  };

  const renderResult = () => {
    if (data !== []) {
      let obj = data;
      let out = [];
      let titles = "";

      for (let i in obj[0]) {
        titles += i + ", ";
      }
      titles = titles.substring(0, titles.length - 2);
      titles = titles.replace(/_+/g, " ");

      for (let i of obj) {
        let strng = "";
        for (let k in i) {
          if (k === "name") {
            strng += i[k] + " ";
          } else if (k === "floor") {
            strng += "Floor " + i[k] + ", ";
          } else strng += i[k] + ", ";
        }
        strng = strng.substring(0, strng.length - 2);
        out.push(strng);
      }

      return (
        <>
          <span className="normal-font">
            <div>{titles}</div>
            {out.map((value, key) => {
              return <div key={key}>{value}</div>;
            })}
          </span>
        </>
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
        >
          <option value="">Select Interval</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <input type="submit" />
      </form>
      <button
        onClick={() => {
          setShow(false);
        }}
      >
        Clear
      </button>
      {show && renderResult()}
    </div>
  );
}
