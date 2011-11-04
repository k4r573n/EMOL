
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

    map = new OpenLayers.Map ("map", {

        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
        maxResolution: 156543.0339,
        numZoomLevels: 19,
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),

        eventListeners: {
            //"move": mapEventMoveStarted,
            "moveend": mapEventMove,
            //"zoomend": mapEventZoom,
            //"changelayer": mapLayerChanged,
            //"changebaselayer": mapBaseLayerChanged
        }, 

        controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            //new OpenLayers.Control.OverviewMap(),
            new OpenLayers.Control.ScaleLine({geodesic: true}),
            //new OpenLayers.Control.Permalink('perm link'),
            new OpenLayers.Control.MousePosition(), //<-
            new OpenLayers.Control.LayerSwitcher(), //<-
            //new OpenLayers.Control.Attribution()
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

    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    //layerMapnik.setOpacity(0.4);
    map.addLayer(layerMapnik); 

    layerTilesAtHome = new OpenLayers.Layer.OSM.Osmarender("Osmarender");
    //layerTilesAtHome.setOpacity(0.4);
    map.addLayer(layerTilesAtHome);

    layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
    //layerCycleMap.setOpacity(0.4);
    map.addLayer(layerCycleMap);

    var gphy = new OpenLayers.Layer.GoogleNG(
        {type: google.maps.MapTypeId.TERRAIN}
    );
    var gmap = new OpenLayers.Layer.GoogleNG(
        // ROADMAP, the default
    );
    var ghyb = new OpenLayers.Layer.GoogleNG(
        {type: google.maps.MapTypeId.HYBRID}
    );
    var gsat = new OpenLayers.Layer.GoogleNG(
        {type: google.maps.MapTypeId.SATELLITE}
    );

    map.addLayers([gphy, gmap, ghyb, gsat]);

    // This is the layer that uses the locally stored tiles
    //var newLayer = new OpenLayers.Layer.OSM("Local Tiles", "tiles/mapz${z}y${y}x${x}.png", {numZoomLevels: 19, alpha: true, isBaseLayer: false});
    //newLayer.setOpacity(0.5);
    //map.addLayer(newLayer);
    // This is the end of the local layer

    //draw feature - see:
    //view-source:http://openlayers.org/dev/examples/draw-feature.html
    var drawLayer = new OpenLayers.Layer.Vector("new places",
            {rendererOptions: {yOrdering: true}, isBaseLayer: false});

    drawLayer.events.on({
            'featureselected': onFeatureSelect,
            'featureunselected': onFeatureUnselect
    });

    map.addLayer(drawLayer);

    drawControls = {
        point: new OpenLayers.Control.DrawFeature(drawLayer,
                        OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(drawLayer,
                        OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(drawLayer,
                        OpenLayers.Handler.Polygon),

    };

    for(var key in drawControls) {
        drawControls[key].handler.stopDown = false;//for panning
        drawControls[key].handler.stopUp = false;//   "   "
        map.addControl(drawControls[key]);
    }

    //http://openlayers.org/dev/examples/highlight-feature.html
    var highlightCtrl = new OpenLayers.Control.SelectFeature(
                drawLayer, {
                    hover: true,
                    highlightOnly: true,
                    renderIntent: "temporary",
                    //eventListeners: {
                    //    beforefeaturehighlighted: report,
                    //    featurehighlighted: report,
                    //    featureunhighlighted: report
                    //}
                }
        );
    var selectCtrl = new OpenLayers.Control.SelectFeature(
                drawLayer,
                {
                    clickout: false, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey", // shift key adds to selection
                    box: false
                }
            );
    map.addControl(highlightCtrl);
    map.addControl(selectCtrl);

    //this should be deactive while drawing
    highlightCtrl.activate();
    selectCtrl.activate();


    document.getElementById('noneDrawToggle').checked = true;

    // Add a drag feature control to move features around.
    dragFeature = new OpenLayers.Control.DragFeature(drawLayer);
    map.addControl(dragFeature);

    //add an nice tool bar - don't work may cause I worte my own
    //map.addControl( new OpenLayers.Control.EditingToolbar(drawLayer));

		//for HitchHike overlay
  // Different colors for markers depending on their rating
    var colors = [    
                    "#ffffff", // rate 0 (white)
                    "#00ad00", // rate 1 (green)
                    "#96ad00", // rate 2
                    "#ffff00", // rate 3
                    "#ff8d00", // rate 4
                    "#ff0000"  // rate 5 (red)
                ];
    
    // Get rating from marker
    var markerContext = {
        getColor: function(feature) {
            return colors[feature.attributes["rating"]];
        }
    };

    // Initialize a layer for the hitchhiking places
    // You can fill it with refreshMapMarkers() using listener events
    hhplaces = new OpenLayers.Layer.Vector(
        "HitchHiking Places", {/*
        strategies: [
            new OpenLayers.Strategy.Fixed(),
            new OpenLayers.Strategy.Cluster()
        ],*/
        styleMap: new OpenLayers.StyleMap({
                      "default": new OpenLayers.Style(
                          {
                graphicZIndex: 1,
                pointRadius: 5,//"${radius}",
                strokeWidth: 2,
                cursor: "pointer",
                fillColor: "#000000",//#ffcc66
                strokeColor: "${getColor}" // using context.getColor(feature)
            }, {context: markerContext}),
            "select": new OpenLayers.Style({
                graphicZIndex: 2,
                fillColor: "#66ccff",
                strokeColor: "#3399ff"
            }),
            "hover": new OpenLayers.Style({
                graphicZIndex: 2,
                fillColor: "#3399ff"
            })
        }), //stylemap end
        isBaseLayer: false,
            rendererOptions: {yOrdering: true}
            }
    );//hhplaces end 
    map.addLayer(hhplaces);

		// Event listeners for places layer
    hhplaces.events.on({
        'featureselected': function(event) {
            feature = event.feature;
            maps_debug("Selected marker "+feature.attributes.id);
            //showPlacePanel(feature.attributes.id);
                
        },
        'featureunselected': function(feature) {
            maps_debug("Unselected marker.");
            //hidePlacePanel();
        }
    });

		/*
     * Hovering place markers
     */
    var hover_marker = new OpenLayers.Control.SelectFeature(hhplaces, {
        hover: true,
        highlightOnly: true,
        renderIntent: "hover"
    });
    map.addControl(hover_marker);
    hover_marker.activate();

    /*
     * Selecting markers
     */
    var select_marker = new OpenLayers.Control.SelectFeature(hhplaces, 
                            {
                                hover: false,
                                highlightOnly: true,
                                clickout: true,
                                multiple: false,
                                box: false
                            });
    map.addControl(select_marker);
    select_marker.activate();


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


function onFeatureSelect(evt) {
    var feature = evt.feature;
    var lonlat = new OpenLayers.LonLat(0,0);
    //what feature is it?
    if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
        //$("#PointInfoPanel > #describtion").empty().append(feature.geometry.toString());
        //$("#PointInfoPanel > #describtion").empty().append(feature.geometry.bounds.getCenterLonLat());
        lonlat = feature.geometry.bounds.getCenterLonLat().transform(
                    map.getProjectionObject(),
                    new OpenLayers.Projection("EPSG:4326"));
    }
    $("#PointInfoPanel > #lat").empty().append(lonlat.lat);
    $("#PointInfoPanel > #lon").empty().append(lonlat.lon);
    //$("#PointInfoPanel > #lat").empty().append("kein punkt");
    $("#PointInfoPanel > #describtion").empty().append('<a href="http://www.openstreetmap.org/?mlat='+lonlat.lat+'&mlon='+lonlat.lon+'&zoom='+16+'&layers=M">osm link</a>');
}

function onFeatureUnselect(evt) {
    feature = evt.feature;

}

function test() {
  //alert("bla");

  var control = drawControls["polygon"];
  control.activate();
}

function toggleMoveFeatures(element) {
    if(element.checked) {
        dragFeature.activate();
        //disable here drawing and measure mode while moving
    } else {
        dragFeature.deactivate();
    }
}

function toggleDrawControl(element) {
    for(key in drawControls) {
        var control = drawControls[key];
        if(element.value == key && element.checked) {
            control.activate();
        } else {
            control.deactivate();
        }
    }
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

/*
* Our own little markermanager
* Shows only what's needed, not all the world at the same time. ;-)
*/
var markers = new Array();
/* new new test with cross domain call support?! */
function refreshMapMarkers() {
    var currentZoom = map.getZoom();
    map_center = map.getCenter();
    // Hide markers layer if zoom level isn't deep enough, and show marker count-labels instead
    if(currentZoom < markersZoomLimit) {
        hhplaces.setVisibility(false);
        //hhplaces_count.setVisibility(true);
    }
    else {
        hhplaces.setVisibility(true);
        //hhplaces_count.setVisibility(false);
    }
    // Start loading markers only after certain zoom level
    if(currentZoom >= markersZoomLimit) {
        // Get corner coordinates from the map
        var extent = map.getExtent();
        var corner1 = new OpenLayers.LonLat(extent.left, extent.top).transform(projmerc, proj4326);
        var corner2 = new OpenLayers.LonLat(extent.right, extent.bottom).transform(projmerc, proj4326);

        maps_debug("Calling API... ");
        // Get markers from the API for this area
        //$.getJSON('http://127.0.0.1/blindMap/api_hitchmap.php?callback=?', // lokal gehts eh
        //$.getJSON('http://www.brgs.org/users/k.hinz/api/api_hitchmap.php?callback=?', //geht
				/*
				 * BUG: error messages are not JSONP encoded - this means that the function is not called if there are no results
				 */
        $.getJSON('http://hitchwiki.org/maps/api/?callback=?', //geht
            {
              bounds : corner2.lat+','+corner1.lat+','+corner1.lon+','+corner2.lon,
							who: "k4",
							lang: "de_DE"
            },
            function(data) {
								maps_debug("parse data...");
          
                // Loop markers we got trough
								if(data.error != undefined)
									maps_debug("error while loading hitchPlaces");
								else{
									// Go trough all markers
									maps_debug("Starting markers each-loop...");
									var markerStock = [];
									$.each(data, function(key, value) {
										/* Value includes:
											 value.id;
											 value.lat;
											 value.lon;
											 value.rating;
											 */
										// Check if marker isn't already on the map
										// and add it to the map
										if(markers[value.id] != true) {
											markers[value.id] = true;
											maps_debug("Adding marker #"+value.id +"<br />("+value.lon+", "+value.lat+")...");
											var coords = new OpenLayers.LonLat(value.lon, value.lat).transform(proj4326,projmerc);
											markerStock.push(
												new OpenLayers.Feature.Vector(
													new OpenLayers.Geometry.Point(coords.lon, coords.lat),
													{
														id: value.id,
														rating: value.rating
													}
													)
												);
											maps_debug("...done.");
										}
										else {
											maps_debug("marker #"+value.id +" already on the map.");
										}
										// each * end
									});
								}

                if(markerStock.length > 0) {
                    maps_debug("Loop ended. Adding "+markerStock.length+" new markers to the map.");
                    hhplaces.addFeatures(markerStock);
                } else {
                    maps_debug("Loop ended. No new markers found from this area.");
                }
            // getjson * end
                
            }
      ).error(function() {maps_debug("error undifined"); });
      // end zoom limit
    }
}

/*
* Call when moving ends
*/
function mapEventMove() {
    $("#zoom").empty().append(map.getZoom());

    if(mapEventlisteners==true) {
        maps_debug("map movement ended");
        // Refresh markers in viewport
        refreshMapMarkers();
    }
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


