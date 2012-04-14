<?php
/* this is a starter page to access all special maps on this server
 * it parses all "osm / * / index.php" files and lists them here
 * exept off config and a special page for the API
 */
?>
<html>
<head>
<style type="text/css">
<!--
/* ... Hier werden die Formate definiert ... */
-->
body {
    background: -moz-linear-gradient(center top , #DAE7EB 0%, #F5F4EF 10%, #F5F4EF 96%, #E0E0E0 100%) no-repeat fixed 0 0 #F5F4EF;
    color: #222222;
    font-family: 'Trebuchet MS',Trebuchet,'Lucida Sans Unicode','Lucida Grande','Lucida Sans',Arial,sans-serif;
    height: 95%;
}
h1 {

}
.map_box {
    background-attachment: scroll;
    background-clip: border-box;
    background-color: #FFFFFF;
    background-image: -moz-linear-gradient(center top , #FFFFFF 0%, #E3E3E3 58%, #C7C7C7 71%, #FFFFFF 100%);
    background-origin: padding-box;
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100% 4px;
    border-radius: 10px 10px 10px 10px;
    clear: both;
    margin-bottom: 1em;
    margin-top: 1em;
    padding: 20px;
}

.map_list {
    /*background-attachment: scroll;
    background-clip: border-box;
    background-color: #FFFFFF;
    background-image: -moz-linear-gradient(center top , #FFFFFF 0%, #E3E3E3 58%, #C7C7C7 71%, #FFFFFF 100%);
    background-origin: padding-box;
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: 100% 4px;*/
		border-radius: 10px 10px 10px 10px;
    clear: both;
    height: 90%;
    padding: 10px;
}

.right {
		margin-left: 150px;
		min-height: 150px;
}
.left {
		float:left;
		margin-right: 2em;
}

.change {
	font-size: 0.9em;
}
.map_link {
	font-size: 1.6em;
}

#page {
		clear: both;
		margin: 0 auto;
		max-width: 800px;
}
#top {
	text-align:center;
}
</style>
</head>
<body>
<div id="page">
<div id="top">
<h1>My OSM special Maps</h1>
here I have listed some maps where I am working on
</div>
<br>
<div class="map_list">
<?php 
/* generate nice boxes for each osm Project */
$dirs = glob('osm/*' , GLOB_ONLYDIR);
foreach ($dirs as $dir) {
	if ((strcmp($dir,"osm/upload") == 0) ||
		 (strcmp($dir,"osm/config") == 0) ||
		 (strcmp($dir,"osm/api") == 0) )
	{
		continue;
	}

	$name = substr($dir,4);
	$tags = get_meta_tags($dir."/index.php");
	print "<div id=\"$name\" class=\"map_box\">\n";
	print "<div class=\"left\">\n";
	print "<a href=\"./$dir/\"><img width=150 src=\"./$dir/img/logo.png\"/></a>\n";
	print "</div><div class=\"right\">\n";
	print "<a class=\"map_link\" href=\"./$dir/\">$name</a><br>\n";
	print "<span class=\"change\">last change: ";
	include "$dir/last_update.php";
	print "</span><br>\n";
	//print "<span class=\"change\">last change: ".$tags['date']."</span><br>\n";
//	foreach ($tags as $key=>$value) {
//		print "$key => $value <br>\n";
//	}
	print $tags['description']."<br>\n";
	print "</div>";
	print "</div><br>\n\n";
}	
?>
</div>
</div>
</body>
</html>
