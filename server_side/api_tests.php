<?php
/*
 * copyed from
 * http://stackoverflow.com/questions/6591947/make-my-json-string-parsed-openlayers-format-geojson
 *
 */

$feature_collection = array();
$feature_collection['type'] = "FeatureCollection";
$feature_collection['features'] = array();

$con = mysql_connect($DB_URI, $DB_USER, $DB_PASS);
if (!$con) {
    $errorMessage = "Error: Could not connect to data database.  Error: " . mysql_error();
} else {
    mysql_select_db("data", $con);
    $result = mysql_query("SELECT * FROM `conditions` WHERE LATITUDE > $LAT AND LONGITUDE > $LON GROUP BY LOCATION;");

    while ($row = mysql_fetch_assoc($result)) {
        $feature_collection['features'][] = createFeature($row['conditionsID'],
                                                          $row['LATITUDE'],
                                                          $row['LONGITUDE'],
                                                          $row);
    }
}


echo json_encode($feature_collection);

function createFeature($ID, $lat, $lon, $data)
{
    unset($data["LATITUDE"]);
    unset($data["LONGITUDE"]);
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
