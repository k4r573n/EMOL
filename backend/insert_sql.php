<?php
/*
 * A script to fill data in the mysql tables
 * copied from the net
 *
 * !!! untested !!!
 *
 */
include "mysql.config";

// SQL File
$SQLFile = 'upload.sql';
if(isset($_GET['file'])) 
	$SQLFile = $_GET['file'];


// Connect MySQL
$link = mysql_connect($hostname, $db_user, $db_password);

if (!$link) {
	die("MySQL Connection error");
}

// Select MySQL DB
mysql_select_db($database_name, $link) or die("Wrong MySQL Database");

// Function For Run Multiple Query From .SQL File
function MultiQuery($sqlfile, $sqldelimiter = ';') {
	set_time_limit(0);

	if (is_file($sqlfile) === true) {
		$sqlfile = fopen($sqlfile, 'r');

		if (is_resource($sqlfile) === true) {
			$query = array();
			echo "<table cellspacing='3' cellpadding='3' border='0'>";

			while (feof($sqlfile) === false) {
				$query[] = fgets($sqlfile);

				if (preg_match('~' . preg_quote($sqldelimiter, '~') . '\s*$~iS', end($query)) === 1) {
					$query = trim(implode('', $query));

					if (mysql_query($query) === false) {
						echo '<tr><td>ERROR:</td><td> ' . $query . '</td></tr>';
					} else {
						//echo '<tr><td>SUCCESS:</td><td>' . $query . '</td></tr>';
					}

					while (ob_get_level() > 0) {
						ob_end_flush();
					}

					flush();
				}

				if (is_string($query) === true) {
					$query = array();
				}
			}
			echo "</table>";
			echo "Finish :D<br>";

			return fclose($sqlfile);
		}
	}

	return false;
}

/* * * Use Function Like This: ** */

MultiQuery($SQLFile);

?>
