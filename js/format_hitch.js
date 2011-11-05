/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */

/**
* @requires OpenLayers/Format/JSON.js
* @requires OpenLayers/Feature/Vector.js
* @requires OpenLayers/Geometry/Point.js
* @requires OpenLayers/Geometry/MultiPoint.js
* @requires OpenLayers/Geometry/LineString.js
* @requires OpenLayers/Geometry/MultiLineString.js
* @requires OpenLayers/Geometry/Polygon.js
* @requires OpenLayers/Geometry/MultiPolygon.js
* @requires OpenLayers/Console.js
*/

/**
* Class: OpenLayers.Format.GeoJSON
* Read and write GeoJSON. Create a new parser with the
* <OpenLayers.Format.GeoJSON> constructor.
*
* Inherits from:
* - <OpenLayers.Format.JSON>
*/
//OpenLayers.Format.GeoJSON = OpenLayers.Class(OpenLayers.Format.JSON, {
OpenLayers.Format.HITCH = OpenLayers.Class(OpenLayers.Format.GeoJSON, {

    /**
* APIProperty: ignoreExtraDims
* {Boolean} Ignore dimensions higher than 2 when reading geometry
* coordinates.
*/
    ignoreExtraDims: true,
    
    /**
* Constructor: OpenLayers.Format.GeoJSON
* Create a new parser for GeoJSON.
*
* Parameters:
* options - {Object} An optional object whose properties will be set on
* this instance.
*/

    /**
* APIMethod: read
* Deserialize a GeoJSON string.
*
* Parameters:
* json - {String} A GeoJSON string
* type - {String} Optional string that determines the structure of
* the output. Supported values are "Geometry", "Feature", and
* "FeatureCollection". If absent or null, a default of
* "FeatureCollection" is assumed.
* filter - {Function} A function which will be called for every key and
* value at every level of the final result. Each value will be
* replaced by the result of the filter function. This can be used to
* reform generic objects into instances of classes, or to transform
* date strings into Date objects.
*
* Returns:
* {Object} The return depends on the value of the type argument. If type
* is "FeatureCollection" (the default), the return will be an array
* of <OpenLayers.Feature.Vector>. If type is "Geometry", the input json
* must represent a single geometry, and the return will be an
* <OpenLayers.Geometry>. If type is "Feature", the input json must
* represent a single feature, and the return will be an
* <OpenLayers.Feature.Vector>.
*/
//TODO HitchSpot einbauen - parseHitchSpot nutzen!
    read: function(json, type, filter) {
			maps_debug("parse data (format)...");
			var features = [];

			// Loop markers we got trough
			if(json.error != undefined)
				maps_debug("error while loading hitchPlaces");
			else{
				// Go trough all markers
				maps_debug("Starting markers each-loop...");
				var markerStock = [];
				$.each(json, function(key, value) {
					/* Value includes:
						 value.id;
						 value.lat;
						 value.lon;
						 value.rating;
						 */
					//die coords müssen komischer weise in mercator-projektion angegeben werden?!
						var coords = new OpenLayers.LonLat(value.lon, value.lat).transform(new OpenLayers.Projection("EPSG:4326"), projmerc);
						var geometry = new OpenLayers.Geometry.Point(coords.lon, coords.lat);
						maps_debug("coords: "+lon+" "+lat);
						//var geometry = new OpenLayers.Geometry.Point(0,0);
						var attributes = {};
						//var style = this.defaultStyle ? OpenLayers.Util.applyDefaults({}, this.defaultStyle) : null;
						//var icon, iconSize, iconOffset, overflow;
						maps_debug("Adding marker #"+value.id +"<br />("+value.lon+" "+value.lat+")...");
						attributes['id'] = value.id;
						attributes['rating'] = value.rating;
						var feature = new OpenLayers.Feature.Vector(geometry, attributes);
					 //var feature = new OpenLayers.Feature.Vector(geometry, attributes, style);
						features.push(feature);
						maps_debug("...done.");

					//if(markers[value.id] != true) {
					//	markers[value.id] = true;
					//}
					//else {
					//	maps_debug("marker #"+value.id +" already on the map.");
					//}

					// each * end
				});
			}

			return features;
    },
    
    /**
* Method: parseHitchSpot
* Convert a feature object from GeoJSON into an
* <OpenLayers.Feature.Vector>.
*
* Parameters:
* obj - {Object} An object created from a GeoJSON object
*
* Returns:
* {<OpenLayers.Feature.Vector>} A feature.
*/
//    parseHitchSpot: function(obj) {
//        var feature, geometry, attributes, bbox;
//        attributes['id'] = obj.id;
//        attributes['rating'] = obj.rating;
//        var coords = new OpenLayers.LonLat(obj.lon, obj.lat).transform(proj4326, map.getProjectionObject());
//        geometry = new OpenLayers.Geometry.Point(coords.lat, coords.lat);
//        //irgendeinen hüpschen styl 
//        var colors = [    
//                    "#ffffff", // rate 0 (white)
//                    "#00ad00", // rate 1 (green)
//                    "#96ad00", // rate 2
//                    "#ffff00", // rate 3
//                    "#ff8d00", // rate 4
//                    "#ff0000"  // rate 5 (red)
//                ];
//    
//        // Get rating from marker
//        var markerContext = {
//            getColor: function(feature) {
//                         //TODO : geht das so?
//                return colors[feature.attributes["rating"]];
//            }
//        };
//
//        var style = new OpenLayers.Style(
//                          {
//                graphicZIndex: 1,
//                pointRadius: 5,//"${radius}",
//                strokeWidth: 2,
//                cursor: "pointer",
//                fillColor: "#000000",//#ffcc66
//                strokeColor: "${getColor}" // using context.getColor(feature)
//            }, {context: markerContext});
//
//
//        feature = new OpenLayers.Feature.Vector(geometry, attributes, style);
//        if(bbox) {
//            feature.bounds = OpenLayers.Bounds.fromArray(bbox);
//        }
//        if(obj.id) {
//            feature.fid = obj.id;
//        }
//        return feature;
//    },

    CLASS_NAME: "OpenLayers.Format.HITCH"

}); 
