// pages/Services.js

import React, { useState, useEffect } from "react";
import axios from "axios";

require("dotenv").config();
const backendPort = process.env.REACT_APP_BACKEND_PORT;

export default function Services() {
  var currDate = new Date();
  var dd = String(currDate.getDate()).padStart(2, "0");
  var mm = String(currDate.getMonth() + 1).padStart(2, "0");
  var yyyy = currDate.getFullYear();

  var maxDate = yyyy + "-" + mm + "-" + dd;

  const [serviceList, setList] = useState([]);
  const [service, setService] = useState("");
  const [startDate, setStartDate] = useState(maxDate);
  const [endDate, setEndDate] = useState(maxDate);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await axios
      .get(`http://localhost:${backendPort}/services`)
      .then((response) => {
        setList(response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShow(true);
    await axios
      .post(`http://localhost:${backendPort}/service-search`, {
        service: service,
        startDate: startDate,
        endDate: endDate,
        minPrice: minPrice,
        maxPrice: maxPrice,
      })
      .then((response) => {
        setData(response.data);
      });
  };

  const renderResult = () => {
    if (data.length !== 0) {
      return (
        <div className="list-questions-wrapper" style={{ marginTop: "20px" }}>
          <ul className="questions-list">
            {data.map((value) => {
              return (
                <li>
                  <div>
                    <span className="username-font">
                      {"Name: " + value.name}
                    </span>
                    <span className="username-font">
                      {"Service: " + value.service}
                    </span>
                    <span className="username-font">
                      {"Date: " + value.date}
                    </span>
                    <span className="username-font">
                      {"Amount: " + value.amount}
                    </span>

                    <hr className="divider" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      return;
    }
  };

  const renderedServices = serviceList.map((value, key) => (
    <option key={key} value={value.name}>
      {value.name}
    </option>
  ));

  return (
    <div>
      <h1 className="title">
        <span className="normal-font">Our </span>
        <span className="colored-font">Services</span>
        <span className="normal-font">!</span>
      </h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "180px" }}>
        <label
          className="normal-font"
          style={{ marginLeft: "32%", marginRight: "25px" }}
        >
          Select a Service:
        </label>
        <select
          name="services-list"
          onChange={(e) => setService(e.target.value)}
          value={service}
          className="services-style-list"
        >
          <option value="">Select a Service</option>
          {renderedServices}
        </select>
        <br />
        <label
          className="normal-font"
          style={{
            marginLeft: "32%",
            marginRight: "65px",
          }}
        >
          Start Date:
        </label>
        <input
          type="date"
          name="start-date"
          value={startDate}
          min="2021-01-01"
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="services-style-list"
        />
        <br />
        <label
          className="normal-font"
          style={{
            marginLeft: "32%",
            marginRight: "70px",
          }}
        >
          End Date:
        </label>
        <input
          type="date"
          name="end-date"
          value={endDate}
          min={startDate}
          max={maxDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="services-style-list"
        />
        <br />

        <label
          className="normal-font"
          style={{
            marginLeft: "32%",
            marginRight: "27px",
          }}
        >
          Minimum Price:
        </label>
        <input
          type="number"
          name="min-price"
          step=".01"
          value={minPrice}
          min="0"
          max={maxPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="services-style-list"
        />
        <br />
        <label
          className="normal-font"
          style={{
            marginLeft: "32%",
            marginRight: "27px",
          }}
        >
          Maximum Price:
        </label>
        <input
          type="number"
          name="max-price"
          step=".01"
          value={maxPrice}
          min={minPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="services-style-list"
        />

        <input type="submit" className="submit-btn" />
      </form>
      <button
        onClick={() => {
          setShow(false);
          setStartDate(maxDate);
          setEndDate(maxDate);
          setMinPrice("");
          setMaxPrice("");
          setService("");
        }}
        className="clear-btn"
        style={{ top: "603px" }}
      >
        Clear
      </button>
      <br />
      {show && renderResult()}
    </div>
  );
}
