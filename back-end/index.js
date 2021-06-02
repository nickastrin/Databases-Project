const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql");

const port = 3306; //change this

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
    "SELECT ch.date, ch.amount, ser.name as service, cust.name FROM is_charged ch INNER JOIN customer cust on cust.customer_id = ch.customer_id INNER JOIN service ser ON ser.service_id = ch.service_id" +
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

app.get("/agegroup/mostvisited", (req, res) => {
  con.query(
    "SELECT IF(q.age = 1, '20-40', IF(q.age=2, '41-60', IF(q.age=3, '61+', NULL))) AS age_group, q.site_id, q.name, q.floor, MAX(q.visits) AS visits FROM (SELECT a.age, v.site_id, s.name, s.floor, COUNT(*) AS visits FROM (SELECT customer_id, IF(YEAR(CURDATE()) - YEAR(dob) >= 61, 3, IF(YEAR(CURDATE()) - YEAR(dob) >= 41, 2, IF(YEAR(CURDATE()) - YEAR(dob) >= 20, 1, NULL))) AS age FROM customer) a INNER JOIN visited v ON v.customer_id = a.customer_id INNER JOIN site s ON s.site_id = v.site_id GROUP BY v.site_id, a.age ORDER BY a.age, visits desc) q GROUP BY q.age",
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/agegroup/mostused", (req, res) => {
  con.query(
    "SELECT IF(q.age = 1, '20-40', IF(q.age=2, '41-60', IF(q.age=3, '61+', NULL))) AS age_group, q.name service_name, MAX(q.times_used) times_used FROM (SELECT a.age, ch.service_id, s.name, COUNT(*) AS times_used FROM (SELECT customer_id, IF(YEAR(CURDATE()) - YEAR(dob) >= 61, 3, IF(YEAR(CURDATE()) - YEAR(dob) >= 41, 2, IF(YEAR(CURDATE()) - YEAR(dob) >= 20, 1, NULL))) AS age FROM customer) a INNER JOIN is_charged ch ON ch.customer_id = a.customer_id INNER JOIN service s ON s.service_id = ch.service_id GROUP BY ch.service_id, a.age ORDER BY a.age, times_used desc) q GROUP BY q.age",
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.get("/agegroup/mostcustomers", (req, res) => {
  con.query(
    "SELECT IF(q.age = 1, '20-40', IF(q.age=2, '41-60', IF(q.age=3, '61+', NULL))) AS age_group, q.name service_name, MAX(q.customers) customers FROM (SELECT a.age, ch.service_id, s.name, COUNT(DISTINCT a.customer_id) AS customers FROM (SELECT customer_id, IF(YEAR(CURDATE()) - YEAR(dob) >= 61, 3, IF(YEAR(CURDATE()) - YEAR(dob) >= 41, 2, IF(YEAR(CURDATE()) - YEAR(dob) >= 20, 1, NULL))) AS age FROM customer) a INNER JOIN is_charged ch ON ch.customer_id = a.customer_id INNER JOIN service s ON s.service_id = ch.service_id GROUP BY ch.service_id, a.age ORDER BY a.age, customers desc) q GROUP BY q.age",
    (err, result, fields) => {
      if (err) throw err;
      res.status(200).send(result);
    }
  );
});

app.listen(4001, () => {
  console.log("Listening on port 4001...");
});
