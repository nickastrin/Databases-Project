import React, { useState } from "react";
import axios from "axios";

export default function Infected() {
  const [tracker, setTracker] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    setShow(true);
    await axios
      .get(`http://localhost:4001/infected/places/${tracker}`)
      .then((response) => {
        setData(response.data);
      });
  };

  const renderResult = () => {
    if (data !== []) {
      return (
        <>
          <span className="normal-font">
            {data.map((value, key) => {
              return (
                <div key={key}>
                  {value.name +
                    ", " +
                    value.floor +
                    ", " +
                    value.arrival +
                    ", " +
                    value.departure}
                </div>
              );
            })}
          </span>
        </>
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
        />
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
