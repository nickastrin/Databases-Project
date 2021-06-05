// pages/Services.js

import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await axios.get("http://localhost:4001/services").then((response) => {
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
      .post("http://localhost:4001/service-search", {
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
    if (data !== []) {
      return (
        <>
          <span className="normal-font">
            {data.map((value, key) => {
              return (
                <div key={key}>
                  {value.name +
                    " , " +
                    value.service +
                    " ," +
                    value.date +
                    ", " +
                    value.amount}
                </div>
              );
            })}
          </span>
        </>
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

      <form onSubmit={handleSubmit}>
        <label className="normal-font">Start Date:</label>
        <input
          type="date"
          name="start-date"
          value={startDate}
          min="2021-01-01"
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="normal-font">End Date:</label>
        <input
          type="date"
          name="end-date"
          value={endDate}
          min={startDate}
          max={maxDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label className="normal-font">Select a Service:</label>
        <select
          name="services-list"
          onChange={(e) => setService(e.target.value)}
          value={service}
        >
          <option value="">Select a Service</option>
          {renderedServices}
        </select>

        <label className="normal-font">Minimum Price:</label>
        <input
          type="number"
          name="min-price"
          step=".01"
          value={minPrice}
          min="0"
          max={maxPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <label className="normal-font">Maximum Price:</label>
        <input
          type="number"
          name="max-price"
          step=".01"
          value={maxPrice}
          min={minPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <input type="submit" value="Submit" />
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
