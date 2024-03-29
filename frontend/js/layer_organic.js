/* A Layer for visualising Organic and scond_hand tags */


/**
 * Class: OpenLayers.Layer.Vector.Organic
 * Instances of OpenLayers.Layer.Vector.Organic are used to render vector data from
 *     a special API. Create a new vector layer with the
 *     <OpenLayers.Layer.Vector.Vector.Organic> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */
OpenLayers.Layer.Vector.Organic = OpenLayers.Class(OpenLayers.Layer.Vector, {

    /**
     * Constructor: OpenLayers.Layer.Vector.Organic
     * Create a new vector layer
     *
     * Parameters:
     * name - {String} A name for the layer
     * options - {Object} Optional object with non-default properties to set on
     *           the layer.
     *
     * Returns:
     * {<OpenLayers.Layer.Vector.Organic>} A new vector layer
     */
    initialize: function(name, options) {

        options = OpenLayers.Util.extend({
						projection: proj4326,
						maxResolution: 14160.0,//wichtig - sonst gibts ne falsche bbox - stellt ein ab wann die api abgefragt wird
						visibility: true,
						transitionEffect: 'resize',
						strategies: 
						[
							new OpenLayers.Strategy.BBOX({ratio: 1.5})
							//new OpenLayers.Strategy.BBOX()
						],
						protocol: 
						new OpenLayers.Protocol.Script({
								url: "http://bastler.bplaced.net/osm/api",
								params: 
								{
									who: "k4", 
									filter:"organic,second_hand,shop=organic,shop=second_hand"
								},
								format: new OpenLayers.Format.GeoJSON()
						}),
						rendererOptions: {
							  zIndexing: true
					  },
						styleMap: new OpenLayers.StyleMap({
								"default": new OpenLayers.Style({
										externalGraphic: "${getIcon}",
										fillColor: "#ffff00",
										pointRadius: 10,
										graphicWidth:"48",//"${getSize}",
										graphicHeight:"48",//"${getSize}",
										graphicOpacity:0.90,
										graphicZIndex: 0,
										cursor: "pointer",
								},
								{
									 context: 
									 {
											getIcon: function(feature) {
													 if((feature.attributes["k"] == "organic")&&(feature.attributes["v"] == "yes"))
															return "./img/icons/organic2_48px.png";
													 else if((feature.attributes["k"] == "organic")&&(feature.attributes["v"] == "only"))
															return "./img/icons/organic2_48px.png";
													 else if((feature.attributes["k"] == "second_hand")&&(feature.attributes["v"] == "yes"))
															return "./img/icons/second_hand2_48px.png";
													 else if((feature.attributes["k"] == "second_hand")&&(feature.attributes["v"] == "only"))
															return "./img/icons/second_hand2_48px.png";
													 //deprecated
													 else if((feature.attributes["k"] == "shop")&&(feature.attributes["v"] == "organic"))
															return "./img/icons/bug_48px.png";
													 // still ok (see wiki)
													else if((feature.attributes["k"] == "shop")&&(feature.attributes["v"] == "second_hand"))
															return "./img/icons/second_hand2_48px.png";
													 else
															return "./img/icons/question_48px.png";
											}
									 }
								}),
								"select": new OpenLayers.Style({
										//externalGraphic: null,
										fillColor: "#00ff00",
										graphicOpacity:1,
										graphicZIndex: 1,
										graphicWidth: 48,
										graphicHeight: 48
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

    CLASS_NAME: "OpenLayers.Layer.Vector.Organic"
});




