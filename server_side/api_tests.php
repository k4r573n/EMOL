<?php
/*
 * copyed from
 * http://stackoverflow.com/questions/6591947/make-my-json-string-parsed-openlayers-format-geojson
 *
 */

//KEY
$key = "wheelchair";
//VALUE
$value = "yes";
$filter = " t.k = '$key' AND t.v = '$value' ";

if(isset($_GET['bbox']))
		list($lon_min,$lat_min,$lon_max,$lat_max) = explode(',',$_GET["bbox"],4);
else
{
	$lon_min = -180;
	$lat_min = -90;
	$lon_max = 180;
	$lat_max = 90;
	//die("bbox is missing!<br>");
}

// Server Name
$hostname = 'localhost';

// User Name
$db_user = 'bastler_my-osm';

// User Password
$db_password = 'p0o9i8u7z6t5r4e3w2q';

// DBName
$database_name = 'bastler_my-osm';

$feature_collection = array();
$feature_collection['type'] = "FeatureCollection";
$feature_collection['features'] = array();

// Connect MySQL
$con = mysql_connect($hostname, $db_user, $db_password);
if (!$con) {
    $errorMessage = "Error: Could not connect to data database.  Error: " . mysql_error();
} else {
		// Select MySQL DB
		mysql_select_db($database_name, $con) or die("Wrong MySQL Database");
    //$result = mysql_query("SELECT * FROM `conditions` WHERE LATITUDE > $LAT AND LONGITUDE > $LON GROUP BY LOCATION;");
		$sql = "SELECT n.id AS id,n.lon AS lon,n.lat AS lat,t.k,t.v FROM
			`nodes` AS n,`node_tags` AS t 
			WHERE 
			n.id = t.id AND
			$filter AND
			lon < $lon_max AND lon > $lon_min AND
			lat < $lat_max AND lat > $lat_min
			LIMIT 0, 50 ";
		$result = mysql_query($sql) 
			or die ("MySQL-Error: " . mysql_error());  

    while ($row = mysql_fetch_assoc($result)) {
			//echo implode(":",$row) . "<br>";
        $feature_collection['features'][] = createFeature($row['id'],
                                                          $row['lat'],
                                                          $row['lon'],
                                                          $row);
    }
}


echo $_GET['callback']. '(' . json_encode($feature_collection) . ');';

function createFeature($ID, $lat, $lon, $data)
{
    unset($data["lon"]);
    unset($data["lat"]);
    $feature = array();
    $feature["type"] = "Feature";
    $feature["id"] = $ID;

    $feature["geometry"] = array();
    $feature["geometry"]["type"] = "Point";
    $feature["geometry"]["coordinates"] = array($lon+0, $lat+0);

    $feature["properties"] = $data;
    $feature["properties"]["visible"] = "true";

    return $feature;
}

?>
