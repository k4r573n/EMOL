
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

	var styleMap = new OpenLayers.StyleMap({
			pointRadius: 20,
			fillColor: "#ff0000",
		  externalGraphic: './img/marker.png',
			graphicXOffset: -24,
			graphicYOffset: -48,
			graphicWidth: 48,
			graphicHeight: 48,
			graphicTitle: "here we are"
	});
	//layer for search results
	search_markers = new OpenLayers.Layer.Vector( "Search Results",
			{
				styleMap: styleMap,
			});
	map.addLayer(search_markers);
	map.setLayerIndex(search_markers, 99); //to render this layer oon top

		///////////////////////////////////////////////////////////////////////////////7
		//copyed from OLM objectlayer
		///////////////////////////////////////////////////////////////////////////////7

	// adding objects overlay
	objectsLayer = new OpenLayers.Layer.Vector.HitchSpots("Hitchhiking Spots",{visibility:false});
	map.addLayer(objectsLayer);
	map.setLayerIndex(objectsLayer, 1); //to render this layer on bottom

	//
	// adding accessibillity overlay
	wheelLayer = new OpenLayers.Layer.Vector.WheelChair("Wheelchair POIs");
	map.addLayer(wheelLayer);
	map.setLayerIndex(wheelLayer, 0); //to render this layer on bottom


	wheelLayer.events.on({
				'featureselected': onFeatureSelect,
				'featureunselected': onFeatureUnselect
	});

	drawControls = {
			select: new OpenLayers.Control.SelectFeature(
					wheelLayer,
					{
						clickout: false
					}
		//			),
		//	hover: new OpenLayers.Control.SelectFeature(
		//			wheelLayer, 
		//			{
		//					hover: true,
		//					highlightOnly: true,
		//					renderIntent: "temporary",
		//					//eventListeners: {
		//					//		beforefeaturehighlighted: report,
		//					//		featurehighlighted: report,
		//					//		featureunhighlighted: report
		//					//}
		//			}
		//		
			//),
			)
	};
	
	for(var key in drawControls) {
			map.addControl(drawControls[key]);
			drawControls[key].activate();
	}


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

		search_markers.removeAllFeatures();
		search_markers.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonLat.lon,lonLat.lat),null)]);
		map.setCenter (lonLat);

    if(zoom==false) { map.zoomToMaxExtent(); }
    else { map.zoomTo(zoom); }
}

// returns the current map bbox
function getBounds()
{
	return map.getExtent().transform(map.getProjectionObject(), wgs84).toArray();
}

function onFeatureSelect(evt) {
	feature = evt.feature;
	getDetails(feature.fid);

	$("#counter").text(this.selectedFeatures.length);
	//alert("hallo "+ this.selectedFeatures.length);
}

function onFeatureUnselect(evt) {
	feature = evt.feature;
	$("#counter").text(this.selectedFeatures.length);
	//alert("tschüss "+ this.selectedFeatures.length);
}

/**
 * requests api for locations to show them on locationPanel
 *
 * TODO: completion
 */
function getDetails(id) {
    maps_debug("Calling details API (load)... ");

		//var api_url = "http://127.0.0.1/xp/server_side/";
		var api_url = "http://bastler.bplaced.net/osm/";
    $.getJSON(api_url + 'api_tests.php?callback=?', //is running :)
        {
          id: id
        },
			function(data) {
          maps_debug('POI Details ('+data.lat+', '+data.lon+') ');
					addNodeDetails(data);
			});
}

/*
 * shows the node details at the sidebar
 */
function addNodeDetails(data) {
	$("#lon").text(data.lon);
	$("#lat").text(data.lat);
	$("#last_change").text(data.time);
	$("#mapper").text(data.user);

	$("#describtion").text("");
	// Loop attributs we got trough
	$.each(data.attributs, function(key, value) {
		$("#describtion").append("<b>"+value.k + " :</b> "+ value.v + "<br>");
	});
}
