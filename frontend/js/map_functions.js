
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
	var root = "http://bastler.bplaced.net/osm/";

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

	 // Measure controls
	 // http://openlayers.org/dev/examples/measure.html 
		
	 // style the sketch fancy
		var sketchSymbolizers = {
				"Point": {
						pointRadius: 4,
						graphicName: "square",
						fillColor: "white",
						fillOpacity: 1,
						strokeWidth: 1,
						strokeOpacity: 1,
						strokeColor: "#333"
				},
				"Line": {
						strokeWidth: 3,
						strokeOpacity: 1,
						strokeColor: "#333",
						strokeDashstyle: "dash"
				},
				"Polygon": {
						strokeWidth: 2,
						strokeOpacity: 1,
						strokeColor: "#666",
						fillColor: "white",
						fillOpacity: 0.3
				}
		};

		var style = new OpenLayers.Style();
		style.addRules([
				new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);
		var styleMap = new OpenLayers.StyleMap({"default": style});
		
		measureControls = {
				line: new OpenLayers.Control.Measure(
						OpenLayers.Handler.Path, {
								persist: true,
								handlerOptions: {
										layerOptions: {styleMap: styleMap}
								}
						}
				),
				polygon: new OpenLayers.Control.Measure(
						OpenLayers.Handler.Polygon, {
								persist: true,
								handlerOptions: {
										layerOptions: {styleMap: styleMap}
								}
						}
				)
		};
		
		var control;
		for(var key in measureControls) {
				control = measureControls[key];
				control.geodesic = true;//take this away if you want to make geodesic optional
				control.setImmediate(true);
				control.events.on({
						"measure": handleMeasurements,
						"measurepartial": handleMeasurements
				});
				map.addControl(control);
		}

		document.getElementById('noneToggle').checked = true;
	 // END Measure controls

///////////////////////////////////////////////////////////////////////
// Basic Layers

    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    //layerMapnik.setOpacity(0.4);
    map.addLayer(layerMapnik); 

    layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
    //layerCycleMap.setOpacity(0.4);
    map.addLayer(layerCycleMap);

		//ÖPNV Lines
		map.addLayer(new OpenLayers.Layer.OSM("Public transport lines","http://openptmap.org/tiles/${z}/${x}/${y}.png",
					{ maxZoomLevel: 17, numZoomLevels: 18, alpha: true, isBaseLayer: false, visibility: false }));

// Basic Layers
///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////
// Overlays

	/* Search Marker */
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
	map.setLayerIndex(search_markers, 0); //to render this layer on top
	/* END - Search Marker */


	// adding objects overlay
	objectsLayer = new OpenLayers.Layer.Vector.HitchSpots("Hitchhiking Spots",{visibility:false});
	map.addLayer(objectsLayer);
	map.setLayerIndex(objectsLayer, 1); //to render this layer on bottom

	// adding organic overlay
	organic_layer = new OpenLayers.Layer.Vector.Organic("Organic/second_hand POIs");
	map.addLayer(organic_layer);
	map.setLayerIndex(organic_layer, 2); //to render this layer on bottom


	/* controls for selectable Layers */
	drawControls = {
			select_organic: new OpenLayers.Control.SelectFeature(
					organic_layer,
					{
						clickout: false
					}
			),
	};
	
	for(var key in drawControls) {
			map.addControl(drawControls[key]);
			drawControls[key].activate();
	}
	/* END - controls for selectable Layers */

// Overlays
///////////////////////////////////////////////////////////////////////

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
	//TODO get the icon path out of the feature
	layer = map.getLayer("OpenLayers.Layer.Vector.Organic_94");
	//maps_debug("icon: "+layer.features.styleMap.styles.default.context.getIcon(feature));
	icon = layer.styleMap.styles.default.context.getIcon(feature);
	maps_debug("icon: "+icon);
	$("#poiIcon").attr("src",icon);
	getDetails(feature.fid);

  $(".InfoPanel").hide();
  $("#PointInfoPanel").show();

	$("#counter").text(this.selectedFeatures.length);
	//alert("hallo "+ this.selectedFeatures.length);
}

function onFeatureUnselect(evt) {
	feature = evt.feature;
	$("#counter").text(this.selectedFeatures.length);
	//alert("tschüss "+ this.selectedFeatures.length);
}

function handleMeasurements(event) {
		var geometry = event.geometry;
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
		var element = document.getElementById('output');
		var out = "";
		if(order == 1) {
				out += "measure: " + measure.toFixed(3) + " " + units;
		} else {
				out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
		}
		element.innerHTML = out;
}

function toggleMeasureControl(element) {
		for(key in measureControls) {
				var control = measureControls[key];
				if(element.value == key && element.checked) {
						control.activate();
				} else {
						control.deactivate();
				}
		}
}

/**
 * requests api for locations to show them on locationPanel
 *
 * TODO: completion
 */
function getDetails(id) {
    maps_debug("Calling details API (load)... ");

		//var api_url = "http://127.0.0.1/xp/server_side/";
		var api_url = "http://bastler.bplaced.net/osm/api/";
    $.getJSON(api_url + 'index.php?callback=?', //is running :)
        {
          id: id,
					v: "1"
        },
			function(data) {
          maps_debug('POI Details ('+data.lat+', '+data.lon+') ');
					addNodeDetails(data,id);
			});
}

/*
 * shows the node details at the sidebar
 */
function addNodeDetails(data,id) {
	if (data.attributs["name"])
		$("#PointInfoPanel > div > #name").text(data.attributs["name"]);
	else
		$("#PointInfoPanel > div > #name").text("Unkown POI");
	if ((data.attributs["addr:street"])&&
		(data.attributs["addr:housenumber"])&&
		(data.attributs["addr:city"])&&
		(data.attributs["addr:postcode"])) 
	{
		$("#PointInfoPanel > #addr").html(
				"<b>Address:</b><br>"+
				data.attributs["addr:street"]+" "+
				data.attributs["addr:housenumber"]+"<br>"+
				data.attributs["addr:postcode"]+" "+
				data.attributs["addr:city"]
				);
	}else{
		$("#PointInfoPanel > #addr").text("");
	}
	contact = $("#PointInfoPanel > #contact");
	//contact.html("<b>Contact:</b><br>");
	contact.text("");
	if (data.attributs["website"])
		contact.append('<a href="'+data.attributs["website"]+'">'+data.attributs["website"]+'</a><br>');
	if (data.attributs["phone"])
		contact.append('<a href="phone:'+data.attributs["phone"]+'">'+data.attributs["phone"]+'</a><br>');
	if (data.attributs["contact:phone"])
		contact.append('<a href="phone:'+data.attributs["contact:phone"]+'">'+data.attributs["contact:phone"]+'</a><br>');
	if (data.attributs["mail"])
		contact.append('<a href="mailto:'+data.attributs["mail"]+'">'+data.attributs["mail"]+'</a><br>');
	if (data.attributs["contact:email"])
		contact.append('<a href="mailto:'+data.attributs["contact:email"]+'">'+data.attributs["contact:mail"]+'</a><br>');

			
	$("#lon").text(data.lon);
	$("#lat").text(data.lat);
	$("#last_change").text(data.time);
	$("#mapper").text(data.user);

	$("#describtion").text("");
	// Loop attributs we got trough
	$.each(data.attributs, function(key, value) {
		$("#describtion").append("<b>"+key + " :</b> "+ value + "<br>");
	});
	$("#describtion").append('<br><b>Edit:</b> <a href="javascript:josm_call_for_point(' +
		data.lon + ',' + data.lat + ');">JOSM</a> <b>Object ID:</b><a href="http://www.openstreetmap.org/browse/node/'+id+'">'+id+'</a><br>');
}

function josm_call_for_area() {
	left = x2lon( map.getExtent().left ).toFixed(5);
	right = x2lon( map.getExtent().right ).toFixed(5);
	// conflict with use of variable 'top' in internet explorer. (why?) use my_top instead. gw
	my_top = y2lat( map.getExtent().top ).toFixed(5);
	bottom = y2lat( map.getExtent().bottom ).toFixed(5);
	baseUrl = 'http://127.0.0.1:8111/load_and_zoom?left='+left+'&right='+right+'&top='+my_top+'&bottom='+bottom;
	// IE 9 + localhost ajax GEHT NICHT, daher Fallback:
	//window.open (baseUrl);
	document.getElementById('josm_call_iframe').src=baseUrl;
} 

function josm_call_for_point(lon,lat) {
	left = lon - 0.0006;
	right = lon + 0.0006;
	// conflict with use of variable 'top' in internet explorer. (why?) use my_top instead. gw
	my_top = lat + 0.0003;
	bottom = lat - 0.0003;
	baseUrl = 'http://127.0.0.1:8111/load_and_zoom?left='+left+'&right='+right+'&top='+my_top+'&bottom='+bottom;
	// IE 9 + localhost ajax GEHT NICHT, daher Fallback:
	//window.open (baseUrl);
	document.getElementById('josm_call_iframe').src=baseUrl;
} 
