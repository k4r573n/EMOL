
/**
 * requests api for locations to show them on locationPanel
 *
 * TODO: completion
 */
function getLocations() {
    maps_debug("Calling location API (load)... ");

    $.getJSON('http://127.0.0.1/api/api_locations.php?callback=?', //is running :)
        {
          getLocations: 1
        },
			function(data) {

				// Go trough all markers
				maps_debug("Starting locations each-loop...");
				//empty location list
				$("#locationList").empty();
				// Loop markers we got trough
				var locStock = [];
				$.each(data, function(key, value) {
					/* Value includes:
						 value.id;
						 value.lat;
						 value.lon;
						 value.zoom;
						 value.name;
						 value.desc;
             ...
						 */
          //maps_debug(""+value.name+' ('+value.lat+', '+value.lon+') zoom:'+value.zoom);
					addLocation(value);
				});
			});
}


/**
 * give the current location to api to store
 *
 * TODO: completion
 */
function storeLocation() {
    maps_debug("Calling location API (store)... ");

		//TODO fix die klasse
		var loc = {
			id : "",
			lat : "0",
			lon : "0",
			zoom : "1",
			north : "90",
			south : "-90",
			east : "180",
			west : "-180",
			name : "",
			desc : ""
			//CLASS_NAMIE="Location"
		}

    var extent = map.getExtent();
    var corner1 = new OpenLayers.LonLat(extent.left, extent.top).transform(projmerc, proj4326);
    var corner2 = new OpenLayers.LonLat(extent.right, extent.bottom).transform(projmerc, proj4326);

    var date = new Date();
    maps_debug("timestamp:"+date.getTime());
    loc.id = date.getTime(); //TODO timestamp + random
    loc.lat = (corner1.lat + corner2.lat) / 2;
    loc.lon = (corner1.lon + corner2.lon) / 2;

    loc.zoom = map.getZoom();

    loc.north = corner1.lon;
    loc.south = corner2.lon;
    loc.west = corner1.lat;
    loc.east = corner2.lat;
    loc.name = $("#LocationPanel > div > #name").val();
    loc.desc = $("#LocationPanel > div > #desc").val();

    $.getJSON('http://127.0.0.1/api/api_locations.php?callback=?', //is running :)
        {
          edit: $.toJSON(loc)
        },
			function(data) {
        
				// Go trough all markers
				maps_debug("save locations return value: "+data);
				// Loop markers we got trough

			});
    $("#LocationPanel > div > #name").val("");
    $("#LocationPanel > div > #desc").val("");
}

/*
 * adds an entry to the location list
 * just for experimenting
 */
function addLocation(mapLocation)
{
	/* values are
	 * mapLocation.name,
	 * mapLocation.desc,
	 * mapLocation.lon,
	 * mapLocation.lat,
	 * mapLocation.zoom
	 */
	maps_debug("add Loc:"+mapLocation.name+"-"+mapLocation.desc);
	$("#locationList").append('<li class="ui-widget-content"><div><h3>'+mapLocation.name+
			'<img src="img/loc_icons/sb.png" class="align_right"/>'+
			'</h3><div class="locDescribtion">'+mapLocation.desc+'</div>'+
			'<div id="lon" style="display:none;">'+mapLocation.lon+'</div>'+
			'<div id="lat" style="display:none;">'+mapLocation.lat+'</div>'+
			'<div id="zoom" style="display:none;">'+mapLocation.zoom+'</div>'+
			'</div></li>');
				
}
/**
 * loads the whole list of locations and shows them
 */
function loadLocationList(data)
{
	alert("TODO");

}
