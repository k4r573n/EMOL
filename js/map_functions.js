
/*
* most copied from Hitchwiki Maps: main.js
* Requires:
* - jquery.js
* - jquery.scrollTo.js
* - jquery-ui.js
* - OpenLayers.js
*/ 


//Initialise the 'map' object
function init_map() {
	var root = "http://hitchwiki.org/";

    map = new OpenLayers.Map ("map", {

        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
        maxResolution: 156543.0339,
        numZoomLevels: 18,
        units: 'meters',
        projection: new OpenLayers.Projection("EPSG:900913"),
        //projection: new OpenLayers.Projection("EPSG:4326"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),

        controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition(), //<-
            new OpenLayers.Control.LayerSwitcher() //<-
        ]
    } );


    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    //layerMapnik.setOpacity(0.4);
    map.addLayer(layerMapnik); 

    layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
    //layerCycleMap.setOpacity(0.4);
    map.addLayer(layerCycleMap);

		///////////////////////////////////////////////////////////////////////////////7
		//copyed from OLM objectlayer
		///////////////////////////////////////////////////////////////////////////////7

	// adding objects overlay
	objectsLayer = new OpenLayers.Layer.Vector.HitchSpots("Hitchhiking Spots");
	map.addLayer(objectsLayer);
	//
	// adding accessibillity overlay
	wheelLayer = new OpenLayers.Layer.Vector.WheelChair("Wheel Chair pois");
	map.addLayer(wheelLayer);


    //position in map
    if( ! map.getCenter() ){
        var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        map.setCenter (lonLat);
    }

    // Zoom
    if(zoom==false) { map.zoomToMaxExtent(); }
    else { map.zoomTo(zoom); }
    // Let eventlisteners be free! :-)
    // Meaning, they can be called from now on that page has stopped loading
    mapEventlisteners = true; 
}

/*
* Log debug events
*/
function maps_debug(str) {
    log_list.append("<li><span>"+str+"</span></li>");
    //if(log.is(":visible")) log_list.attr({ scrollTop: $("#log ol").attr("scrollHeight") });
    $("#log ol").scrollTo( '100%',0,{axis:'y'} );
} 

function zoomMapIn(lon,lat, zoom) {
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    map.setCenter (lonLat);

    if(zoom==false) { map.zoomToMaxExtent(); }
    else { map.zoomTo(zoom); }
}

// returns the current map bbox
function getBounds()
{
	return map.getExtent().transform(map.getProjectionObject(), wgs84).toArray();
}
