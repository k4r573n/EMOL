
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
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:900913"),
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

	// styles for object layer
//	var objectsStyle = new OpenLayers.Style(
//	{
//		pointRadius: 8,//"${radius}",
//		strokeColor: "#000000",
//		strokeWidth: 2,
//		fillColor: "#FF0000",
//		fillOpacity: 1,//0.2,
//		cursor: "pointer"
//		},
//		{
//			context: {
//				radius: function(feature)
//				{
//					return Math.min(feature.attributes.count, 7) + 4;
//				}
//		}
//	});
//	var objectsStyleSelected = new OpenLayers.Style(
//	{
//		pointRadius: 5,//"${radius}",
//		strokeColor: "#0860d5",
//		strokeWidth: 4,
//		fillColor: "#0860d5",
//		fillOpacity: 0.3,
//		cursor: "pointer"
//		},
//		{
//			context: {
//				radius: function(feature)
//				{
//					return Math.min(feature.attributes.count, 7) + 5;
//				}
//		}
//	});
//	var objectsStyleMap = new OpenLayers.StyleMap(
//	{
//		'default': objectsStyle,
//		'select': objectsStyleSelected
//	});
	// adding objects overlay
	objectsLayer = new OpenLayers.Layer.Vector("Hitchhiking Spots",
	{
		projection: proj4326,
		//maxResolution: 10.0,
		visibility: true,
		//transitionEffect: 'resize',
		//styleMap: objectsStyleMap,
		strategies:
		[
			new OpenLayers.Strategy.BBOX({ratio: 2.5})
			//new OpenLayers.Strategy.BBOX()
		],
///		//Wichtig damit HTTP geht muss es auf dem selben server liegen (gleicher namespace)
///		protocol: new OpenLayers.Protocol.HTTP(
///		{
///			url: "http://127.0.0.1/api/api_hitchmap.php",
///			params: {who: "k4", lang: "de_DE", callback: "a"},
///			format: new OpenLayers.Format.HITCH(),
///			callback: function(resp){this.addFeatures(resp.features)}
///		})
   protocol: new OpenLayers.Protocol.Script({
          url: "http://127.0.0.1/api/api_hitchmap.php",
					params: {who: "k4", lang: "de_DE"},
					format: new OpenLayers.Format.HITCH()
		})
 });
	map.addLayer(objectsLayer);


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
