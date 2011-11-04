
/*
* Search
* läuft :)
*/
function search(q) {
    maps_debug("Search: "+q);
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
//                //maps_debug("Search found: lat: "+data.lat+", lon: "+data.lon);
//                maps_debug("Moving to the bounding box: "+data.boundingbox +data.boundingbox[0]);
//                // build a bounding box coordinates and zoom in
//                var boundingbox = data.boundingbox;//.split(',');
//                bounds = new OpenLayers.Bounds();
//                bounds.extend( new OpenLayers.LonLat(boundingbox[2],boundingbox[0]) );
//                bounds.extend( new OpenLayers.LonLat(boundingbox[3],boundingbox[1]) );
//                map.zoomToExtent( bounds );
//            }
            //else
							if(data.lat != undefined && data.lon != undefined) {
                maps_debug("Moving to lat+lon.");
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
    return false;
}
