//copied from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
function long2tile(lon,zoom) {
	return (Math.floor((lon+180)/360*Math.pow(2,zoom))); 
}
function lat2tile(lat,zoom)  {
	return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}
function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

function showRegExpResult(m)
{
	if (m == null) {
		alert("No match");
	} else {
		var s = "Match at position " + m.index + ":\n";
		for (i = 1; i < m.length; i++) {
			s = s + m[i] + "\n";
		}
		alert(s);
	}
}
function isTilePosition(q)
{
	//.../zoom/xtile/ytile...
	var re = /[\s\S]*\/(\d{1,2})\/(\d{1,15})\/(\d{1,15})[\s\S]*/;
	var m = re.exec(q);
	if (m != undefined) return m;

	//zoom xtile ytile
	re = /(\d{1,2})\s(\d{1,15})\s(\d{1,15})/;
	m = re.exec(q);
	//showRegExpResult(m);
	if (m != undefined) return m;
	else return null;
}
function isLonLat(q)
{
	//"lon lat" => xx.xxx x.xxxxx
	var re = /(-?\d+\.\d+)\s(-?\d+\.\d+)/;
	var m = re.exec(q);
	if (m != undefined) return m;

	//lon...xx.xxx...lat...x.xxxxx
	re = /lon\D*(-?\d+\.\d+)\D*lat\D*(-?\d+\.\d+)/;
	m = re.exec(q);
	//showRegExpResult(m);
	if (m != undefined) return m;
	else return null;
}
function isLonLat_decMin(q)
{
  maps_debug("is LonLat_decMin?: "+q);
	//N 53° 13.785' E 010° 23.887'
	//re = /[NS]\s*(\d+)\D*(\d+\.\d+).?\s*[EW]\s*(\d+)\D*(\d+\.\d+)\D*/;
	re = /([ns])\s*(\d+)\D*(\d+\.\d+).?\s*([ew])\s*(\d+)\D*(\d+\.\d+)/i;
	m = re.exec(q.toLowerCase());
	//showRegExpResult(m);
	if (m != undefined) return m;
	else return null;
	// +- dec min +- dec min
}
/*
* Search ursprünglich von HitchWiki jetzt erweitert und abgeändert
*/
function search(q) {
    maps_debug("Search: "+q);
		/* analises the querry */
		if (isTilePosition(q) != null)
		{ 
			var m = isTilePosition(q);
			//m = {zoom, x, y}
			maps_debug("tile: "+m[1]);
			showRegExpResult(m);
			zoomMapIn(tile2long(m[2],m[1]),tile2lat(m[3],m[1]),m[1]);
		}
		else if (isLonLat(q) != null)
		{
			var m = isLonLat(q);
			maps_debug("lonlat: "+m[1]+" "+m[2]);
			//m = {lon, lat}
			zoomMapIn(m[1],m[2],16);
		}
		else if (isLonLat_decMin(q) != null)
		{
			var m = isLonLat_decMin(q);
			//m: [ns, lat dec, lat min, ew, lon dec, lon min]
			var temp  = new Array();
			temp['n'] = 1;
			temp['s'] = -1;
			temp['e'] = 1;
			temp['w'] = -1;
			//maps_debug("lonlat min: " + (m[6]/60) + " " + (m[3]/60));
			//maps_debug("lonlat: " + (Number(m[5])+m[6]/60) + " " + (Number(m[2])+m[3]/60));
			//maps_debug("lon: " + temp[m[4]]*(Number(m[5]) + m[6]/60) + " lat: " +temp[m[1]]*(Number(m[2]) + m[3]/60));
			zoomMapIn(temp[m[4]]*(Number(m[5]) + m[6]/60),temp[m[1]]*(Number(m[2]) + m[3]/60),16);
		}
		else //ask nominatim where it is
		{
			//stats("search/?s="+q);
			//show_loading_bar(_("Searching..."));
			// Geocode
			$.getJSON('http://nominatim.openstreetmap.org/search?json_callback=?',
					{
						format: "json", 
				limit: "1", 
				q: q
					},
					function(data) {//success
						// Hide "searching"
						//hide_loading_bar();
						data = data[0];
						maps_debug("Search results came from: "+data.licence+"<br /> - text: "+data.display_name+"<br /> - Type: "+data.type);
						// If we got a bounding box as an answr, use it:
						//            if(data.boundingbox != undefined) {
						//									zoomToBounds(data.boundingbox);
						//            }
						//            else
						if(data.lat != undefined && data.lon != undefined) {
							maps_debug("Moving to lat+lon. "+lat+" "+lon);
							if(data.zoom == undefined) searchZoom = 14;
							else searchZoom = data.zoom;
							zoomMapIn(data.lon, data.lat, searchZoom);
						}
						// We got a result, but nada...
						else {
							maps_debug("Search didn't find anything.");
							//info_dialog('<p>'+_("Your search did not match any places.")+'</p><p>'+_("Try searching in English and add a country name in to your search.")+'</p><p>'+_("Example:")+' Vilnius, Lithuania.</p>', _('Not found'), false);
						}
					})
			// Didn't find anything...
			.error(function(){
				maps_debug("Search didn't find anything. Error type: "+strError);
				// Hide "searching"}
				//hide_loading_bar();
				info_dialog('<p>'+_("Your search did not match any places.")+'</p><p>'+_("Try searching by english city names or/and add a country name with cities."), _('Not found'), false);
				});
    // Close open stuff
    //close_cards();
    //close_page();
		}
    return false;
}

