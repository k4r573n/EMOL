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
//OpenLayers.Format.HITCH = OpenLayers.Class(OpenLayers.Format.GeoJSON, {
OpenLayers.Format.HITCH = OpenLayers.Class(OpenLayers.Format, {

    /**
* Constructor: OpenLayers.Format.GeoJSON
* Create a new parser for GeoJSON.
*
* Parameters:
* options - {Object} An optional object whose properties will be set on
* this instance.
*/

    /**
* Method: parseHitchSpot
* Convert a feature object from hitchwiki-json into an
* <OpenLayers.Feature.Vector>.
*
* Parameters:
* obj - {Object} An object created from a hitchwiki-json object
*
* Returns:
* {<OpenLayers.Feature.Vector>} A feature.
*/
    parseFeature: function(obj) {
					/*Object includes:
						 obj.id;
						 obj.lat;
						 obj.lon;
						 obj.rating;
						 */
				maps_debug("feature ...parseing");
        var feature, geometry, attributes = [];
        attributes['id'] = obj.id;
        attributes['rating'] = obj.rating;
				geometry = new OpenLayers.Geometry.Point(parseFloat(obj.lon), parseFloat(obj.lat));

        feature = new OpenLayers.Feature.Vector(geometry, attributes);
        if(obj.id) {
            feature.fid = obj.id;
        }
        return feature;
    },

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
    read: function(json) {
			maps_debug("parse data (format)...");
			var features = [];
			//var obj = null;

			var obj = json;//OpenLayers.Format.JSON.prototype.read.apply(this,
							//[json, null]);

			// Loop markers we got trough
			if(json.error != undefined)
				maps_debug("error while loading hitchPlaces");
			else{
				// Go trough all markers
				maps_debug("Starting markers each-loop...");
				var markerStock = [];
				for(var i=0, len=obj.length; i<len; ++i) {
				//$.each(json, function(key, value) {
					 try {
						features.push(this.parseFeature(obj[i]));
					 } catch (err){
						 maps_debug("feature parsing error.");
						 throw err;
					 }
						maps_debug("feature ...done.");

					//if(markers[value.id] != true) {
					//	markers[value.id] = true;
					//}
					//else {
					//	maps_debug("marker #"+value.id +" already on the map.");
					//}

					// each * end
				//});
				}
			}

			return features;
    },
    
    CLASS_NAME: "OpenLayers.Format.HITCH"

}); 
