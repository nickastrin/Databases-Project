<?php
function openCon()
{
	$db_host = "localhost";
	$db_user = "hotelcalifornia";
	$db_pass = "lovelyplace";
	$db_inuse = "hotel";

	$conn = new mysqli($db_host, $db_user, $db_pass, $db_inuse);

	if ($conn->connect_errno) {
		die("Connection failed: " . $conn->connect_error);
	}

	echo $conn->host_info . "<br>";
	return $conn;
}

function closeCon($conn)
{
	$conn->close();
}
