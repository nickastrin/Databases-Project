/*
Query για την εύρεση των επισκέψεων σε υπηρεσίες με βάση πολλαπλά κριτήρια.
Το WHERE statement αρχικά έχει σκέτο 1 αλλά προστίθενται τα αντίστοιχα
κριτήρια ανάλογα με την αίτηση
*/
SELECT ch.date, ch.amount, ser.name as service, cust.name
FROM is_charged ch
INNER JOIN customer cust
ON cust.customer_id = ch.customer_id
INNER JOIN service ser
ON ser.service_id = ch.service_id
WHERE 1
AND ch.date >= "2000-01-20"         --startDate
AND ch.date <= "2030-01-20"         --endDate
AND ch.amount >= 10                 --minPrice
AND ch.amount <= 30                 --maxPrice
AND ser.name = 'Bar';               --service


/*
Query για την εύρεση όλων των δωματίων που ενδεχομένως να έχουν μολυνθεί,
δεδομένου συγκεκριμένου id μολυσμένου πελάτη. Επιστρέφει μια λίστα από
όλους τους χώρους που επισκέφθηκε κατά την παραμονή του στο ξενοδοχείο
μαζί με τις ακριβείς ώρες άφιξης και αναχώρησης από τον καθένα.
*/
SELECT s.site_id, s.name, s.floor, v.arrival, v.departure
FROM visited v
INNER JOIN site s
ON s.site_id = v.site_id
WHERE v.customer_id = 10            --infectedID
ORDER BY v.arrival ASC;

/*
Query για την εύρεση όλων πιθανών μολυσμένων πελατών, δηλαδή όσων βρέθηκαν
στον ίδιο χώρο με κάποιον μολυσμένο όσο ήταν εκεί ή για μία ώρα μετά από
την αναχώρησή του.
*/
SELECT c.customer_id, c.name
FROM
    (SELECT customer_id, site_id, arrival AS start, ADDTIME(departure, 10000) AS finish
    FROM visited
    WHERE customer_id = 10) AS i    --infectedID
INNER JOIN visited v
ON v.site_id = i.site_id
INNER JOIN customer c
ON c.customer_id = v.customer_id
WHERE v.customer_id != i.customer_id
AND i.start <= v.departure
AND i.finish >= v.arrival
GROUP BY c.customer_id
ORDER BY c.customer_id ASC;

/*
Query για τη δημιουργία βοηθητικού view που παράγει τα age groups.
Περιλαμβάνεται και στο database dump
*/
CREATE VIEW age_group AS SELECT customer_id, "20-40" AS age_group FROM customer WHERE dob < DATE_SUB(CURDATE(), INTERVAL 20 YEAR) AND dob > DATE_SUB(CURDATE(), INTERVAL 40 YEAR)
UNION
SELECT customer_id, "41-60" AS age_group FROM customer WHERE dob < DATE_SUB(CURDATE(), INTERVAL 40 YEAR) AND dob > DATE_SUB(CURDATE(), INTERVAL 60 YEAR)
UNION
SELECT customer_id, "61+" AS age_group FROM customer WHERE dob < DATE_SUB(CURDATE(), INTERVAL 60 YEAR);


/*
Query για την εύρεση του πιο πολυσύχναστου χώρου (με τις περισσότερες επισκέψεις)
ανά ηλικιακό group (20-40, 40-60, 61+)
Στο συγκεκριμένο παράδειγμα το timePeriod είναι ορισμένο σε 30, που σημαίνει ότι
εξετάζουμε τις επισκέψεις του τελευταίου μήνα, αλλά αρκεί να το αλλάξουμε σε 365
για να συμπεριλάβουμε τις επισκέψεις του τελευταίου χρόνου
*/
SELECT age_group, q.name, q.site_id, q.floor, MAX(q.visits) AS visits
FROM
    (SELECT a.age_group, v.site_id, s.name, s.floor, COUNT(*) AS visits
    FROM age_group a
    INNER JOIN visited v
    ON v.customer_id = a.customer_id
    INNER JOIN site s
    ON s.site_id = v.site_id
    WHERE DATEDIFF(NOW(), v.arrival) < 30       --timePeriod
    GROUP BY v.site_id, a.age_group
    ORDER BY a.age_group, visits desc) q
GROUP BY q.age_group;

/*
Query για την εύρεση των συχνότερα χρησιμοποιούμενων υπηρεσιών ανά ηλικιακό
group.
*/
SELECT age_group, q.name service_name, MAX(q.times_used) times_used
FROM
    (SELECT a.age_group, ch.service_id, s.name, COUNT(*) AS times_used
    FROM age_group a
    INNER JOIN is_charged ch
    ON ch.customer_id = a.customer_id
    INNER JOIN service s
    ON s.service_id = ch.service_id
    WHERE DATEDIFF(NOW(), ch.date) < 30         --timePeriod
    GROUP BY ch.service_id, a.age_group
    ORDER BY a.age_group, times_used desc) q
GROUP BY q.age_group;

/*
Query για την εύρεση των υπηρεσιών με τους περισσότερους πελάτες ανά ηλικιακό
group. Συγκεκριμένα μετράμε για κάθε group και για κάθε υπηρεσία πόσοι πελάτες
έχουν χρησιμοποιήσει την υπηρεσία τουλάχιστον μία φορά, και συγκρίνουμε
τα αποτελέσματα.
*/
SELECT age_group, q.name service_name, MAX(q.customers) customers
FROM
    (SELECT a.age_group, ch.service_id, s.name, COUNT(DISTINCT a.customer_id) AS customers
    FROM age_group a
    INNER JOIN is_charged ch
    ON ch.customer_id = a.customer_id
    INNER JOIN service s
    ON s.service_id = ch.service_id
    WHERE DATEDIFF(NOW(), ch.date) < 30         --timePeriod
    GROUP BY ch.service_id, a.age_group
    ORDER BY a.age_group, customers desc) q
GROUP BY q.age_group

/*
Query για τη δημιουργία της όψεις με τις πωλήσεις ανά υπηρεσία
*/
CREATE VIEW salesview AS
SELECT s.name AS service, s.category, AVG(ch.amount) AS average_earnings, SUM(ch.amount) AS total_earnings, MAX(ch.amount) AS max_earnings, COUNT(*) AS transactions
 FROM service s
INNER JOIN is_charged ch
ON ch.service_id = s.service_id
GROUP BY s.service_id

/*
Query για τη δημιουργία της όψης με τα στοιχεία των πελατών
*/
CREATE VIEW customerview AS
SELECT c.name, s.gender AS sex, c.phone, c.email, c.dob, c.arrival_date, c.certification_auth, c.identification_no, COUNT(*) AS registered_services
FROM customer c
INNER JOIN (SELECT 1 AS sex, "Male" AS gender UNION ALL SELECT 2, "Female" UNION ALL SELECT 3, "Other") s
ON c.sex = s.sex
INNER JOIN is_registered r
ON c.customer_id = r.customer_id
GROUP BY c.customer_id;
