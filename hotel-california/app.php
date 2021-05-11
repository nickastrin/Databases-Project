<?php
include 'connection.php';

$conn = openCon();

$sql = "SELECT * FROM site";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Returned rows are: ";
    while ($row = $result->fetch_assoc()) {
        echo "site id: " . $row["site_id"] .
            " - floor: " . $row["floor"] .
            " - name " . $row["name"] . "<br>";
    }
    $result->free_result();
} else {
    echo "0 results";
}

closeCon($conn);
