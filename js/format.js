/*
OpenLinkMap Copyright (C) 2010 Alexander Matheisen
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it under certain conditions.
See olm.openstreetmap.de/info for details.

changed by Karsten Hinz <k.hinz@tu-bs.de> to use it with the hitch api
*/

/*
* based on OpenLayers.Format.Text
* @requires OpenLayers/Feature/Vector.js
* @requires OpenLayers/Geometry/Point.js
* 
* Class: OpenLayers.Format.OSMPOI
* Read OSMPOI text format. Create a new instance with the <OpenLayers.Format.OSMPOI>
*     constructor. This reads text which is formatted like CSV text, using
*     spaces as the seperator by default.
*
* Inherits from:
*  - <OpenLayers.Format>
*/

OpenLayers.Format.HITCH = OpenLayers.Class(OpenLayers.Format,
{
	/*
	* APIProperty: defaultStyle
	* defaultStyle allows one to control the default styling of the features.
	*    It should be a symbolizer hash. By default, this is set to match the
	*    Layer.Text behavior, which is to use the default OpenLayers Icon.
	*/
	defaultStyle: null,
	/*
	* Constructor: OpenLayers.Format.OSMPOI
	* Create a new parser for OSMPOI text.
	*
	* Parameters:
	* options - {Object} An optional object whose properties will be set on
	*     this instance.
	*/
	initialize: function(options)
    {
		options = options || {};
		if(!options.defaultStyle)
		{
			options.defaultStyle =
			{
                graphicZIndex: 1,
                pointRadius: 5,//"${radius}",
                strokeWidth: 2,
                cursor: "pointer",
                fillColor: "#000000",//#ffcc66
                strokeColor: "#000000"//"${getColor}" // using context.getColor(feature)
//				'externalGraphic': OpenLayers.Util.getImagesLocation() + "marker.png",
//				'graphicWidth': 21,
//				'graphicHeight': 25,
//				'graphicXOffset': -10.5,
//				'graphicYOffset': -12.5
			};
		}
		OpenLayers.Format.prototype.initialize.apply(this, [options]);
	}, 

	/*
	* APIMethod: read
	* Return a list of features from a Space Seperated Values text string.
	* 
	* Parameters:
	* data - {String} 
	*
	* Returns:
	* An Array of <OpenLayers.Feature.Vector>s
	*/
	read: function(text)
	{
		maps_debug("parse data (format)...");
		var features = [];

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
					var geometry = new OpenLayers.Geometry.Point(0,0);
					var coords = new OpenLayers.LonLat(value.lon, value.lat).transform(proj4326,projmerc);
					var attributes = {};
					var style = this.defaultStyle ? OpenLayers.Util.applyDefaults({}, this.defaultStyle) : null;
					var icon, iconSize, iconOffset, overflow;
					maps_debug("Adding marker #"+value.id +"<br />("+value.lon+", "+value.lat+")...");
					geometry.x = coords.lat;
					geometry.y = coords.lon;
					attributes['id'] = id;
					attributes['rating'] = rating;
					var feature = new OpenLayers.Feature.Vector(geometry, attributes, style);
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
	CLASS_NAME: "OpenLayers.Format.OSMPOI" 
});
