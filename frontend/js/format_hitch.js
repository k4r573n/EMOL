/**
* Class: OpenLayers.Format.Hitch
* Read hitchwiki json. Create a new parser with the
* <OpenLayers.Format.Hitch> constructor.
*
* Inherits from:
* - <OpenLayers.Format>
*/
OpenLayers.Format.Hitch = OpenLayers.Class(OpenLayers.Format, {

/**
* Method: parseFeature
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
* Deserialize a JSON string.
*
* Parameters:
* json - {String} A JSON string
*
* Returns:
* An Array of <OpenLayers.Feature.Vector>
*/
    read: function(json) {
			maps_debug("parse data (format)...");
			var features = [];
			var obj = null;

			//FIX this (TODO):
			//obj = OpenLayers.Format.JSON.prototype.read.apply(this, [json, null]);
			obj = json;

			// Loop markers we got trough
			if(json.error != undefined)
				maps_debug("error while loading hitchPlaces");
			else{
				// Go trough all markers
				maps_debug("Starting markers each-loop...");
				for(var i=0, len=obj.length; i<len; ++i) {
					 try {
						features.push(this.parseFeature(obj[i]));
					 } catch (err){
						 maps_debug("feature parsing error.");
						 throw err;
					 }
						maps_debug("feature ...done.");
				}
			}

			return features;
    },
    
    CLASS_NAME: "OpenLayers.Format.Hitch"
}); 
