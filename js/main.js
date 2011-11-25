
/*
* most copied from Hitchwiki Maps: main.js
* Requires:
* - jquery.js
* - jquery.scrollTo.js
* - jquery-ui.js
* - OpenLayers.js
*/ 

// Start position for the map (hardcoded here for simplicity)
//var lat=53.292; var lon=10.50; //Scharnebeck
var lat=52.284; var lon=10.52; //BS
var zoom=16;

var map, //complex object of type OpenLayers.Map
	objectsLayer, //hitchhiking spots
	organic_layer, //for organic, second_hand etc tags
	search_markers, //layer for search result markers
	drawControls, //control elements
	wheelLayer; //wheelchair pois
// Missing tiles from the map
OpenLayers.Util.onImageLoadError = function(){this.src='img/tile_not_found.gif';}
OpenLayers.Tile.Image.useBlankTile=false; 

var mapEventlisteners = false; // These will be turned on when page stops loading and map is ready
var show_log = false; // enable / disable the log
var open_page_at_start = false;
var markersZoomLimit = 6;  
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

        //// Tools Panel - Opening/closing
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
        init_map();

        $("#goto").click(function(event){
            event.preventDefault();
            var lat = $("#lat").text();
            var lon = $("#lon").text();
						zoomMapIn(lon,lat,17);

            //alert("lat:"+lat+" lon:"+lon);
        });

				////get Locations
        //$("#loadLocations").click(function(event){
        //    event.preventDefault();
        //    //sollte das info panel zeigen
				//		maps_debug("load Location...");
				//		getLocations();
        //});

				////save Location
        //$("#saveLocation").click(function(event){
        //    event.preventDefault();
        //    //sollte das info panel zeigen
				//		maps_debug("save Location...");
				//		storeLocation();
        //});

        //function call - to test code
        $("#test").click(function(event){
            event.preventDefault();
						maps_debug("Zoom: "+map.getZoom());

						map.raiseLayer(map.getLayersByName("Search Results")[0], map.layers.length-1);
						//addLocation({"name":"test","desc":"eine beschreibung","lat":0,"lon":0, "zoom":10});
						//addLocation("tttt");

        });

				////shows the location List
				//$("#showLocationPanel").click(function(event){
        //    event.preventDefault();
        //    //sollte das info panel zeigen
				//		maps_debug("show LocationPanel");
        //    $(".InfoPanel").hide();
        //    $("#LocationPanel").show();
        //});
				//
				////make location list selectalbe 
				//$( "#locationList" ).selectable({
				//	stop: function() {
				//		//var result = $( "#select-result" ).empty();
				//		$( ".ui-selected", this ).each(function() {
				//			var index = $( "#locationList li" ).index( this );
				//			//result.append( " #" + ( index + 1 ) );
				//			maps_debug("select "+index);
				//			maps_debug("lat:"+$(this).find("#lat").text());// +" lon:"+$("#lon", this) +" zoom:"+$("#zoom", this) );
				//			var lonLat = new OpenLayers.LonLat($(this).find("#lon").text(), $(this).find("#lat").text()).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
				//			map.setCenter (lonLat);
				//			map.zoomTo($(this).find("#zoom").text());
				//		});
				//	}
				//});


//        //$(function() {
//            $( "#toggleLog" ).button(
//            {
//              icons: {primary: "ui-icon-custom"},
//              //icons: {primary: "ui-icon-locked"},
//              text: false
//            });
//
//            $( "#toggleMeasure" ).button(
//            {
//              //icons: {primary: "ui-icon-custom"},
//              icons: {primary: "ui-icon-locked"},
//              text: false
//            });
//            $( "#format" ).buttonset();
//        //});

        //move map to Braunschweig
        $("#braunschweig").click(function(event){
            event.preventDefault();
            //$(this).hide("slow");
            zoomMapIn(10.5309, 52.2728,11);
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



