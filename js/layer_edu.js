/* A Layer for visualising education locations */


/**
 * Class: OpenLayers.Layer.Vector.Edu
 * Instances of OpenLayers.Layer.Vector.Edu are used to render vector data from
 *     a special API. Create a new vector layer with the
 *     <OpenLayers.Layer.Vector.Vector.Edu> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */
OpenLayers.Layer.Vector.Edu = OpenLayers.Class(OpenLayers.Layer.Vector, {

    /**
     * Constructor: OpenLayers.Layer.Vector.Edu
     * Create a new vector layer
     *
     * Parameters:
     * name - {String} A name for the layer
     * options - {Object} Optional object with non-default properties to set on
     *           the layer.
     *
     * Returns:
     * {<OpenLayers.Layer.Vector.Edu>} A new vector layer
     */
    initialize: function(name, options) {

        options = OpenLayers.Util.extend({
						projection: proj4326,
						maxResolution: 160.0,//wichtig - sonst gibts ne falsche bbox - stellt ein ab wann die api abgefragt wird
						visibility: true,
						transitionEffect: 'resize',
						strategies: 
						[
							new OpenLayers.Strategy.BBOX({ratio: 1.5})
						],
						protocol: 
						new OpenLayers.Protocol.Script({
								url: "http://bastler.bplaced.net/osm/api",
								params: 
								{
									who: "k4", 
						//TODO check if this is working!
									filter:"amenity=school,amenity=university,amenity=kindergarden,amenity=college"
								},
								format: new OpenLayers.Format.GeoJSON()
						}),
						rendererOptions: {
							  zIndexing: true
					  },
						styleMap: new OpenLayers.StyleMap({
								"default": new OpenLayers.Style({
										//externalGraphic: "${getIcon}",
										fillColor: "#aa0000",
										pointRadius: 20,
										//graphicWidth:"32",//"${getSize}",
										//graphicHeight:"32",//"${getSize}",
										graphicOpacity:0.70,
										graphicZIndex: 0,
										cursor: "pointer",
								},
								{
									 context: 
									 {
											getIcon: function(feature) {
//													 if((feature.attributes["v"] == "yes")||
//															(feature.attributes["v"] == "no")||
//															(feature.attributes["v"] == "only"))
//															return "./img/wheelchair/wheelchair_" + feature.attributes["v"] + ".png";
//														else
															return "./img/wheelchair/wheelchair_unknown.png";
											}
									 }
								}),
								"select": new OpenLayers.Style({
										//externalGraphic: null,
										fillColor: "#00ff00",
										graphicOpacity:1,
										graphicZIndex: 1,
										//graphicWidth: 48,
										//graphicHeight: 48
								}),
								"hover": new OpenLayers.Style({
										graphicZIndex: 1,
										fillColor: "#3399ff"
								})
						}), //stylemap end
						eventListeners: {
								'featureselected': onFeatureSelect,
								'featureunselected': onFeatureUnselect
						},
				}, options);

        var newArguments = [name, options];
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
    },

    CLASS_NAME: "OpenLayers.Layer.Vector.Edu"
});




