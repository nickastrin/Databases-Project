// pages/Home.js

import React, { useState, useEffect } from "react";
import axios from "axios";

require("dotenv").config();
const backendPort = process.env.REACT_APP_BACKEND_PORT;

const Home = () => {
  const [salesData, setSalesData] = useState([]);
  const [showSales, setShowSales] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [showCustomer, setShowCustomer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get(`http://localhost:${backendPort}/customer`);
      setCustomerData(res.data);

      res = await axios.get(`http://localhost:${backendPort}/sales`);
      setSalesData(res.data);
    };

    fetchData();
  }, []);

  const handleCustomer = async (e) => {
    e.preventDefault(e);

    setShowCustomer(!showCustomer);
    setShowSales(false);
  };

  const handleSales = async (e) => {
    e.preventDefault(e);

    setShowSales(!showSales);
    setShowCustomer(false);
  };

  const renderedCustomerData = () => {
    if (customerData.length !== 0) {
      return (
        <div className="list-questions-wrapper" style={{ marginTop: "20px" }}>
          <ul className="questions-list">
            {customerData.map((value, key) => (
              <li key={key}>
                <div style={{ padding: "15px 10px 10px 5px" }}>
                  <span className="username-font">{"Name: " + value.name}</span>
                  <span className="username-font">{"Sex: " + value.sex}</span>
                  <span className="username-font">
                    {"Phone: " + value.phone}
                  </span>
                  <span className="username-font">
                    {"Email: " + value.email}
                  </span>
                  <span className="username-font">
                    {"D.O.B: ." + value.dob}
                  </span>
                  <span className="username-font">
                    {"Arrival Date: " + value.arrival_date}
                  </span>
                  <span className="username-font">
                    {"Certification Auth: " + value.certification_auth}
                  </span>
                  <span className="username-font">
                    {"ID Number: " + value.identification_no}
                  </span>
                  <span className="username-font">
                    {"Registered Services: " + value.registered_services}
                  </span>
                </div>
                <hr className="divider" />
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const renderedSalesData = () => {
    if (salesData.length !== 0) {
      return (
        <div className="list-questions-wrapper" style={{ marginTop: "20px" }}>
          <ul className="questions-list">
            {salesData.map((value, key) => (
              <li key={key}>
                <div style={{ padding: "15px 10px 10px 5px" }}>
                  <span className="username-font">
                    {"Service: " + value.service}
                  </span>
                  <span className="username-font">
                    {"Category: " + value.category}
                  </span>
                  <span className="username-font">
                    {"Average Earnings: " + value.average_earnings}
                  </span>
                  <span className="username-font">
                    {"Total Earnings: " + value.total_earnings}
                  </span>
                  <span className="username-font">
                    {"Max Earnings: " + value.max_earnings}
                  </span>
                  <span className="username-font">
                    {"Total Transactions: " + value.total_transactions}
                  </span>
                </div>
                <hr className="divider" />
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return (
    <div>
      <h1 className="title">
        <span className="normal-font">Welcome to the </span>
        <span className="colored-font">Hotel California</span>
        <span className="normal-font">!</span>
      </h1>
      <h1 className="title" style={{ marginTop: "100px" }}>
        <span className="normal-font">Our Views:</span>
      </h1>
      <button
        className="view-btn"
        style={{ marginTop: "250px" }}
        onClick={handleCustomer}
      >
        Customer View
      </button>
      <button className="view-btn" onClick={handleSales}>
        Sales View
      </button>
      {showCustomer && renderedCustomerData()}
      {showSales && renderedSalesData()}
    </div>
  );
};

export default Home;
