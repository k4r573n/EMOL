/* der layer für die Hitch Api */

	//irgendeinen hüpschen styl 
	var colors = [    
							"#ffffff", // rate 0 (white)
							"#00ad00", // rate 1 (green)
							"#96ad00", // rate 2
							"#ffff00", // rate 3
							"#ff8d00", // rate 4
							"#ff0000"  // rate 5 (red)
					];


/**
 * Class: OpenLayers.Layer.Vector.WheelChair
 * Instances of OpenLayers.Layer.Vector.WheelChair are used to render vector data from
 *     a variety of sources. Create a new vector layer with the
 *     <OpenLayers.Layer.Vector.WheelChair> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */
OpenLayers.Layer.Vector.WheelChair = OpenLayers.Class(OpenLayers.Layer.Vector, {
    /** 
     * APIProperty: style
     * {Object} Default style for the layer
     */
    /**
     * Property: strategies
     * {Array(<OpenLayers.Strategy>)} Optional list of strategies for the layer.
     */


    /**
     * Constructor: OpenLayers.Layer.HitchSpots
     * Create a new vector layer
     *
     * Parameters:
     * name - {String} A name for the layer
     * options - {Object} Optional object with non-default properties to set on
     *           the layer.
     *
     * Returns:
     * {<OpenLayers.Layer.HitchSpots>} A new vector layer
     */
    initialize: function(name, options) {

        options = OpenLayers.Util.extend({
						projection: proj4326,
						maxResolution: 360.0,//wichtig - sonst gibts ne falsche bbox - stellt ein ab wann die api abgefragt wird
						visibility: true,
						transitionEffect: 'resize',
						strategies: 
						[
							new OpenLayers.Strategy.BBOX({ratio: 1.5})
							//new OpenLayers.Strategy.BBOX()
						],
						protocol: 
						new OpenLayers.Protocol.Script({
								//url: "http://hitchwiki.org/maps/api/",//Problem: api will bounds - OL fragt nach bbox
								url: "http://bastler.bplaced.net/osm/api_tests.php",
								params: 
								{
									who: "k4", 
								},
								format: new OpenLayers.Format.GeoJSON()
						}),
						styleMap: new OpenLayers.StyleMap({
								"default": new OpenLayers.Style({
										externalGraphic: "${getIcon}",
										graphicWidth:"32",//"${getSize}",
										graphicHeight:"32",//"${getSize}",
										graphicOpacity:0.90,
										graphicZIndex: 1,
										cursor: "pointer",
								},
								{
									 context: 
									 {
											getIcon: function(feature) {
													 if((feature.attributes["v"] == "yes")||
															(feature.attributes["v"] == "no")||
															(feature.attributes["v"] == "only"))
															return "./img/wheelchair/wheelchair_" + feature.attributes["v"] + ".png";
														else
															return "./img/wheelchair/wheelchair_unknown.png";
											}
									 }
								}),
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
				}, options);

        var newArguments = [name, options];
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, newArguments);
    },

    CLASS_NAME: "OpenLayers.Layer.Vector.WheelChair"
});




