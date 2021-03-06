const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql");

require("dotenv").config();

const port = process.env.db_port || 3306; //change this
const service_port = process.env.service_port || 4001;

const app = express();
app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
  host: "localhost",
  user: "hotelcalifornia",
  password: "suchalovelyplace",
  database: "hotel",
  port,
});

app.post("/service-search", (req, res) => {
  console.log(req.body);
  let where = " WHERE 1";
  if (req.body.startDate != "") {
    where = where + " AND ch.date >= '" + req.body.startDate + "'";
  }
  if (req.body.endDate != "") {
    where = where + " AND ch.date <= '" + req.body.endDate + "'";
  }
  if (req.body.minPrice != "") {
    where = where + " AND ch.amount >= " + req.body.minPrice;
  }
  if (req.body.maxPrice != "") {
    where = where + " AND ch.amount <= " + req.body.maxPrice;
  }
  if (req.body.service != "") {
    where = where + " AND ser.name = '" + req.body.service + "'";
  }
  con.query(
    "SELECT ch.date, ch.amount, ser.name as service, cust.name FROM is_charged ch INNER JOIN customer cust ON cust.customer_id = ch.customer_id INNER JOIN service ser ON ser.service_id = ch.service_id" +
      where,
    (err, result, fields) => {
      if (err) throw err;

      for (let res of result) {
        res.amount = res.amount + "€";
        res.date = res.date.toLocaleString();
      }

      res.status(200).send(result);
    }
  );
});

app.get("/services", (req, res) => {
  con.query("SELECT * FROM service", (err, result, fields) => {
    if (err) throw err;
    res.status(200).send(result);
  });
});

app.get("/infected/places/:infectedid", (req, res) => {
  con.query(
    "SELECT s.site_id, s.name, s.floor, v.arrival, v.departure FROM visited v INNER JOIN site s ON s.site_id = v.site_id WHERE v.customer_id =? ORDER BY v.arrival ASC",
    [req.params.infectedid],
    (err, result, fields) => {
      if (err) throw err;
      for (x of result) {
        x.arrival = x.arrival.toLocaleString();
        x.departure = x.departure.toLocaleString();
      }
      res.status(200).send(result);
    }
  );
});

app.get("/infected/people/:infectedid", (req, res) => {
  con.query(
    "SELECT c.customer_id, c.name FROM (SELECT customer_id, site_id, arrival AS start, ADDTIME(departure, 10000) AS finish FROM visited WHERE customer_id = ?) AS i INNER JOIN visited v ON v.site_id = i.site_id INNER JOIN customer c ON c.customer_id = v.customer_id WHERE v.customer_id != i.customer_id AND i.start <= v.departure AND i.finish >= v.arrival GROUP BY c.customer_id ORDER BY c.customer_id ASC",
    [req.params.infectedid],
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/agegroup/mostvisited/:time", (req, res) => {
  if (req.params.time != "month" && req.params.time != "year") {
    res.status(400).send("Bad Request");
  }
  const period = req.params.time == "month" ? 30 : 365;
  con.query(
    "SELECT age_group, q.name, q.site_id, q.floor, MAX(q.visits) AS visits FROM (SELECT a.age_group, v.site_id, s.name, s.floor, COUNT(*) AS visits FROM age_group a INNER JOIN visited v ON v.customer_id = a.customer_id INNER JOIN site s ON s.site_id = v.site_id WHERE DATEDIFF(NOW(), v.arrival) < ? GROUP BY v.site_id, a.age_group ORDER BY a.age_group, visits desc) q GROUP BY q.age_group;",
    [period],
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/agegroup/mostused/:time", (req, res) => {
  if (req.params.time != "month" && req.params.time != "year") {
    res.status(400).send("Bad Request");
  }
  const period = req.params.time == "month" ? 30 : 365;
  con.query(
    "SELECT age_group, q.name service_name, MAX(q.times_used) times_used FROM (SELECT a.age_group, ch.service_id, s.name, COUNT(*) AS times_used FROM age_group a INNER JOIN is_charged ch ON ch.customer_id = a.customer_id INNER JOIN service s ON s.service_id = ch.service_id WHERE DATEDIFF(NOW(), ch.date) < ? GROUP BY ch.service_id, a.age_group ORDER BY a.age_group, times_used desc) q GROUP BY q.age_group;",
    [period],
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/agegroup/mostcustomers/:time", (req, res) => {
  if (req.params.time != "month" && req.params.time != "year") {
    res.status(400).send("Bad Request");
  }
  const period = req.params.time == "month" ? 30 : 365;
  con.query(
    "SELECT age_group, q.name service_name, MAX(q.customers) customers FROM (SELECT a.age_group, ch.service_id, s.name, COUNT(DISTINCT a.customer_id) AS customers FROM age_group a INNER JOIN is_charged ch ON ch.customer_id = a.customer_id INNER JOIN service s ON s.service_id = ch.service_id WHERE DATEDIFF(NOW(), ch.date) < ? GROUP BY ch.service_id, a.age_group ORDER BY a.age_group, customers desc) q GROUP BY q.age_group",
    [period],
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/sales", (req, res) => {
  con.query("SELECT * FROM salesview", (err, result, fields) => {
    if (err) throw err;
    for (let row of result) {
      row.max_earnings = row.max_earnings + "€";
      row.total_earnings = row.total_earnings + "€";
      const avg = row.average_earnings.toString();
      row.average_earnings = avg.substring(0, avg.indexOf(".") + 3) + "€";
    }
    res.status(200).send(result);
  });
});

app.get("/customer", (req, res) => {
  con.query("SELECT * FROM customerview", (err, result, fields) => {
    if (err) throw err;
    for (let row of result) {
      row.arrival_date = row.arrival_date.toLocaleString();
    }
    res.status(200).send(result);
  });
});

app.listen(service_port, () => {
  console.log("Listening on port " + service_port + "...");
});
