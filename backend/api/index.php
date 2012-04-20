<?php
/*
 * based on
 * http://stackoverflow.com/questions/6591947/make-my-json-string-parsed-openlayers-format-geojson
 *
 */
include "../config/.mysql.config.php";
// contains $db_change = <last change date>
include "../config/last_db_update.php";

class PoiDetails
{
  public $id=0;
  public $lat = 0; 
  public $lon = 0;
  public $time = 0;
  public $user = "";

	public $attributs = array();

  //no functions cause of serilizing
}


function connect($host, $user, $pw, $database)
{
	// Connect MySQL
	$con = mysql_connect($host, $user, $pw);
	if (!$con) {
			$errorMessage = "Error: Could not connect to data database.  Error: " . mysql_error();

			return false;
	} else {
			// Select MySQL DB
			mysql_select_db($database, $con) or die("Wrong MySQL Database");
			return true;
	}
}

function getFeatures($filter, $bbox)
{
	list($lon_min,$lat_min,$lon_max,$lat_max) = explode(',',$bbox,4);

	$feature_collection = array();
	$feature_collection['type'] = "FeatureCollection";
	$feature_collection['features'] = array();

	//$result = mysql_query("SELECT * FROM `conditions` WHERE LATITUDE > $LAT AND LONGITUDE > $LON GROUP BY LOCATION;");
	$sql = "SELECT n.id AS id,n.lon AS lon,n.lat AS lat,t.k,t.v FROM
		`nodes` AS n,`node_tags` AS t 
		WHERE 
		n.id = t.id AND
		$filter AND
		lon < $lon_max AND lon > $lon_min AND
		lat < $lat_max AND lat > $lat_min
		";
		//LIMIT 0, 50 ";
	$result = mysql_query($sql) 
		or die ("MySQL-Error: " . mysql_error());  

	while ($row = mysql_fetch_assoc($result)) {
		//echo implode(":",$row) . "<br>";
			$feature_collection['features'][] = createFeature($row['id'],
																												$row['lat'],
																												$row['lon'],
																												$row);
	}

	return $feature_collection;
}


function getDetails($id, $type)
{
	$details = null;

	if ($type == "node")
	{
		$details =& new PoiDetails();
		$details->id = $id;
		$sql = "SELECT * FROM
			`nodes` WHERE 
			id = $id
			";
		$result = mysql_query($sql) 
			or die ("MySQL-Error: " . mysql_error());  

		$row = mysql_fetch_assoc($result); 
		$details->lon = $row['lon'];
		$details->lat = $row['lat'];
		$details->user = $row['user'];
		$details->time = $row['timestamp'];

		$sql = "SELECT * FROM
			`node_tags` WHERE 
			id = $id
			ORDER BY k
			";
		$result = mysql_query($sql) 
			or die ("MySQL-Error: " . mysql_error());  

		while ($row = mysql_fetch_assoc($result)) {
		//echo implode(":",$row) . "<br>";
			$details->attributs[] = array( "k" => $row['k'], "v" => $row['v']);
		}
	}else{
		die("Type not supported");
	}

	return $details;
}


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


if(isset($_GET['info']))
{
	echo $_GET['callback']. '({last_change: "'.get_db_change().'",system: "EMOL",data: "'.get_db_import().'" });';
}
else if(isset($_GET['id'])) 
{
	//returns all relevant details to this object
	if (connect($hostname, $db_user, $db_password, $database_name)) {
		$details = getDetails($_GET['id'],"node");
		echo $_GET['callback']. '(' . json_encode($details) . ');';
	}
} else {
	//list API - returns a list of all features in a bbox
	$bbox = "-180,-90,180,90";
	if(isset($_GET['bbox']))
		$bbox = $_GET['bbox'];

	$keys = explode(',',$_GET['filter']);
	$filter = "(";
	//generate Filter from parameters
	foreach ($keys as $value)
 	{
		//extract key and value
		$kv = explode('=',$value);
		if ((count($kv) == 1)||($kv[1] == '*'))
		{
			//only key is given
			$filter .= "t.k = '".$kv[0]."' OR ";
		}else{
			//key and value is given
			$filter .= "(t.k = '".$kv[0]."' AND t.v = '".$kv[1]."') OR ";
		}
	}
	if ($filter != "(")
	{
		$filter = substr($filter,0,strlen($filter)-4) . ")";
		//echo "filter:".$filter."<br>";

		if (connect($hostname, $db_user, $db_password, $database_name)) {
			$feature_collection = getFeatures($filter, $bbox);
			echo $_GET['callback']. '(' . json_encode($feature_collection) . ');';
		}
	}else{
	 	//no filter is given
		echo $_GET['callback']. '(error: "no filter given" );';
	}
}

?>
