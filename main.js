
/*
* most copied from Hitchwiki Maps: main.js
* Requires:
* - jquery.js
* - jquery.scrollTo.js
* - jquery-ui.js
* - OpenLayers.js
*/ 

// Start position for the map (hardcoded here for simplicity)
var lat=53.292;
var lon=10.50;
var zoom=16;

var map, //complex object of type OpenLayers.Map
hhplaces, //hitchhiking spots
drawControls,
dragFeature,
measureControls;
// Missing tiles from the map
OpenLayers.Util.onImageLoadError = function(){this.src='img/tile_not_found.gif';}
OpenLayers.Tile.Image.useBlankTile=false; 

var mapEventlisteners = false; // These will be turned on when page stops loading and map is ready
var show_log = false; // enable / disable the log
var open_page_at_start = false;
var markersZoomLimit = 8;  
var proj4326 = new OpenLayers.Projection("EPSG:4326");
var projmerc = new OpenLayers.Projection("EPSG:900913"); 

// allow testing of specific renderers via "?renderer=Canvas", etc
// use ist vor lat lon
//var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
//renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

$(document).ready(function() {
        // Initialize stuff when page has finished loading
        // --------------------------------------------------
        /*
        * Debug log-box
        */
        // Some positioning...
        log = $("#log").attr("style","position: absolute; top: 100px; left: 100px;");
        log_list = $("#log ol");
        log.draggable({handle: ".handle", containment: "body"});
        log.resizable({alsoResize: '#log ol'});

        // Create a hide/show toggle button for the log window
        $("#log .close, .toggle_log").click(function(e){
            e.preventDefault();
            log.toggle();
        });

        // Show or hide log at the start?
        if(show_log==true) {
            log.show();
        } else {
            log.hide();
        }

        // Tools Panel - Opening/closing
        $(".toggle_tools, div#measureTools .close").click(function(e){
            e.preventDefault();
            $(this).blur();
            $("div#measureTools").toggle();
        });

        // Tools Panel - make it draggable
        $(".floatingPanel.draggable")
        .draggable({ handle: 'handle' })
        .attr("style","text-align:left; top: 100px; left: 60px; display: none;");



        // Log user's time
        var date = new Date();
        maps_debug("User's time "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()); 


        // Initialize page content area
        $("#pages .close").click(function(e){
                e.preventDefault();
                close_page();
        });
        if(open_page_at_start == false) {
            $("#pages .page .content, #pages .page, #pages .close").hide();
        } 



        // init the map
        init();
        $(".goto").click(function(event){
            event.preventDefault();
            var lat = $(".goto").parent().$("#lat");
            var lon = $(".goto").parent().$("#lon");
            var target = new OpenLayers.LonLat(lat, lon).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
            map.setCenter (target);

            alert("lat:"+lat+" lon:"+lon);
        });

				//get Locations
        $("#loadLocations").click(function(event){
            event.preventDefault();
            //sollte das info panel zeigen
						maps_debug("load Location...");
						getLocations();
        });

				//save Location
        $("#saveLocation").click(function(event){
            event.preventDefault();
            //sollte das info panel zeigen
						maps_debug("save Location...");
						storeLocation();
        });

        //function call - to test code
        $("#test").click(function(event){
            event.preventDefault();
						maps_debug("test");
						addLocation({"name":"test","desc":"eine beschreibung","lat":0,"lon":0, "zoom":10});
						//addLocation("tttt");

        });

				//shows the location List
				$("#showLocationPanel").click(function(event){
            event.preventDefault();
            //sollte das info panel zeigen
						maps_debug("show LocationPanel");
            $(".InfoPanel").hide();
            $("#LocationPanel").show();
        });
				
				//make location list selectalbe 
				$( "#locationList" ).selectable({
					stop: function() {
						//var result = $( "#select-result" ).empty();
						$( ".ui-selected", this ).each(function() {
							var index = $( "#locationList li" ).index( this );
							//result.append( " #" + ( index + 1 ) );
							maps_debug("select "+index);
							maps_debug("lat:"+$(this).find("#lat").text());// +" lon:"+$("#lon", this) +" zoom:"+$("#zoom", this) );
							var lonLat = new OpenLayers.LonLat($(this).find("#lon").text(), $(this).find("#lat").text()).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
							map.setCenter (lonLat);
							map.zoomTo($(this).find("#zoom").text());
						});
					}
				});

        //example usage of the flicker api
        $("#flicker_test").click(function(event){
            event.preventDefault();

            //get fotos from flicker - maby to conventions
            $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
              {
                tags: "cat",
                tagmode: "any",
                format: "json"
              },
              function(data) {
                alert("adf");
              //  $.each(data.items, function(i,item){
              //    $("<img/>").attr("src", item.media.m).appendTo("#images");
              //    if ( i == 3 ) return false;
              //  });
              });
            //$(this).hide("slow");
            $("#PointInfoPanel > #describtion").empty().append("new dtest");
        });

        //$(function() {
            $( "#toggleLog" ).button(
            {
              icons: {primary: "ui-icon-custom"},
              //icons: {primary: "ui-icon-locked"},
              text: false
            });

            $( "#toggleMeasure" ).button(
            {
              //icons: {primary: "ui-icon-custom"},
              icons: {primary: "ui-icon-locked"},
              text: false
            });
            $( "#format" ).buttonset();
        //});

        //move map to Braunschweig
        $("#braunschweig").click(function(event){
            event.preventDefault();
            //$(this).hide("slow");
            zoomMapIn(10.5309, 52.2728,13);
        });

        // Search form (from HH)
        $("#search_form").submit(function(){
          search($("#search_form input#q").val());
          return false;
        });

        // Autosuggest in search (from HH)
        $("#search_form input#q").autocomplete({
          source: function(request, response) {
                    $.ajax({
                      url: "http://ws.geonames.org/searchJSON",
                      dataType: "jsonp",
                      data: {
                        featureClass: "P",
                      style: "full",
                      maxRows: 10,
                      name_startsWith: request.term
                      },
                      success: function(data) {
                                 response($.map(data.geonames, function(item) {
                                   return {
                                     label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                                 value: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName
                                   //value: item.name + ", " + item.countryName
                                   }
                                 }))
                               }
                    })
                  },
            minLength: 2,
            select: function(event, ui) {
              search(ui.item.label);
            },
            open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                  },
            close: function() {
                     $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                   }
        });
        
 });

//Initialise the 'map' object
function init() {

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
				 * BUG error messages are not JSONP encoded - this means that the function is not called if there are no results
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

/*
* Search
* läuft hier nicht da ich noch keine ahnung vom aufbau des geocoder.php scripts habe
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

