<?php
//error_reporting(E_ALL);

/* 
 * Its great that
 * http://hitchwiki.org/maps/#
 * offers a free accessable JSONP API but there is a little Problem which is fixed by this script
 * hitchwiki supports bounds instead of bbox - so we have to convert it...
 *
 * Attention:
 * this will not run on a free hoster because file_get_contents won't wort there!
 *
 * by Karsten Hinz <k.hinz@tu-bs.de>
 */

function downloadPois($north,$east,$south,$west)
{
    // URL
    $url = "http://hitchwiki.org/maps/api/?bounds=$south,$north,$west,$east&format=json&who=k4";

    $parsed_uri = parse_url($url);
    // open URL 
    if( function_exists('file_get_contents') )
    {
        $pois = file_get_contents($url);
    } else {
        die('deine php-version stinkt! :D');
    }

    return $pois;
}

    //Braunschweig
//    $north = 52.2985;
//    $south = 52.2274;
//    $east = 10.5841;
//    $west = 10.4579;

header("content-type: text/javascript"); 

if(isset($_GET['callback']))
{
	if(isset($_GET['bounds'])) 
	{
		//if converter is accessed with bounds parameter
		list($south,$north,$west,$east) = explode(',',$_GET["bounds"],4);
	}
	elseif(isset($_GET['bbox']))
	{
		//if converter is accessed with bbox parameter
		list($west,$south,$east,$north) = explode(',',$_GET["bbox"],4);
	}
	else
	{/*error no area specified*/
		break;
	}

		$pois = downloadPois($north,$east,$south,$west);

		//$pois='[{"id":"1500","lat":"53.292","lon":"10.5","rating":"3"},{"id":"100","lat":"53.293","lon":"10.5002","rating":"4"}]';

		echo $_GET['callback']. '('.$pois.');';
}else{
	echo "usage: parameter bounds=SOUTH,NORTH,WEST,EAST&callback=?<br>";
	echo "usage: parameter bbox=EAST,SOUTH,WEST,NORTH&callback=?";
}
?>
