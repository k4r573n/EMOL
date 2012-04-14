<html>
<head>
   <title>EASY Map Overlays - Demo</title>
   <link rel="stylesheet" href="css/style.css" type="text/css" />
   <!-- bring in the OpenLayers javascript library
        (here we bring it from the remote site, but you could
        easily serve up this javascript yourself) -->
   <script src="js/OpenLayers.js"></script>


   <!-- bring in the OpenStreetMap OpenLayers layers.
        Using this hosted file will make sure we are kept up
        to date with any necessary changes -->
   <script src="js/OpenStreetMap.js"></script>
   <script src="js/jquery-1.6.2.min.js"></script>
   <script src="js/jquery.scrollTo-min.js"></script>
	 <script src="js/jquery.json-2.2.min.js"></script>
  <script src="js/jquery-ui-1.8.15.custom.min.js"></script>
	<script type="text/javascript" src="js/format_hitch.js"></script>
	<script type="text/javascript" src="js/layer_hitch.js"></script>
	<script type="text/javascript" src="js/layer_accessebillty.js"></script>
	<script type="text/javascript" src="js/layer_organic.js"></script>
	<script type="text/javascript" src="js/layer_edu.js"></script>
  <script type="text/javascript" src="js/map_functions.js"></script>
  <script type="text/javascript" src="js/main.js"></script>
  <script type="text/javascript" src="js/search.js"></script>
	<link type="text/css" href="css/smoothness/jquery-ui-1.8.15.custom.css" rel="stylesheet" />	
	
		<style>
			a.test { font-weight: bold; }

      .ui-icon-custom {
        background-image: url(log.png) !important; 
      }

			.icon.magnifier {
				background-image: url("img/icons/search.png");
			}

			.icon {
				background-position: left center;
				background-repeat: no-repeat;
				padding-bottom: 4px;
				padding-left: 20px;
				padding-top: 3px;
			}

      #format { margin-top: 2em; }

			#map {
					/* background-color: #93B3CD; */
					bottom: 25px;
					/* color: #E5F0F9; */
					left: 0;
					min-width: 600px;
					position: absolute;
					right: 0;
					/* text-align: center; */
					top: 80px;
			}

			div.InfoPanel {
					background: none repeat scroll 0 0 #FAF9F3;
					border-left: 1px solid #CCC4A0;
					bottom: 25px;
					display: block;
					overflow-y: auto;
					/* overflow-x: hidden; */
					/* padding: 0; */
					padding-left:10px;
					padding-right:10px;
					position: absolute;
					right: 0;
					top: 80px;
					width: 230px;
			}

      #log {
          background: none repeat scroll 0 0 #000000;
          border-radius: 3px 3px 3px 3px;
          color: #FFFFFF;
          display: block;
          font-family: Courier,serif;
          font-size: 10px;
          height: 320px;
          line-height: 12px;
          margin: 0;
          max-height: 620px;
          max-width: 700px;
          padding: 0;
          width: 450px;
      }

      /*#log .handle {*/
      .handle {
          background: none repeat scroll 0 0 #004B61;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          color: #FFFFFF;
          cursor: move;
          display: block;
          height: 10px;
          padding: 5px;
      }

      #log ol {
          display: block;
          height: 280px;
          margin-right: 0;
          max-height: 580px;
          max-width: 680px;
          overflow-x: hidden;
          overflow-y: auto;
          padding-right: 0;
          width: 410px;
      }

      .floatingPanel {
          -moz-border-bottom-colors: none;
          -moz-border-image: none;
          -moz-border-left-colors: none;
          -moz-border-right-colors: none;
          -moz-border-top-colors: none;
          /*background: url("../gfx/bg.png") repeat-x scroll left bottom #EDCA50;*/
          background-color: #999999;/* #C9AB22;*/
          border-color: #C9AB22 #C9AB22 transparent;
          border-radius: 3px 3px 3px 3px;
          border-style: solid solid none;
          border-width: 1px 1px medium;
          box-shadow: 0 0 5px #CCCCCC;
          color: #000000;
          display: block;
          font-size: 11px;
          margin: 0;
          padding: 0 7px 7px;
          position: absolute;
          text-align: left;
          width: 230px;
          z-index: 99998;
      }

      .align_right {
          float: right;
      }

			#locationList .ui-selecting { background: #FECA40; }
			#locationList .ui-selected { background: #F39814; color: white; }
			#locationList {
					list-style-type: none;
					margin: 0;
					padding: 0;
					width: 100%;
			}
			#locationList li {
          border-radius: 10px 10px 10px 10px;
          /*border-color: #C9AB22 #C9AB22 transparent;*/
					margin: 4px 10px 4px 10px;
					padding: 0px 10px 5px 10px;
					font-size: 13px;
					line-height: 8px;
					/*h3 {font-size: 0.5em; }*/
					/*height: 18px; */
					/*width: 100%;*/
			}
			#locationList li {
					/*margin: 5px 10px 5px 10px;*/
					margin-top: 0px;
      }
          
      #search #q {
        background: none repeat scroll 0 0 transparent;
        border: 0 none;
        display: block;
        float: left;
        font-size: 13px;
        height: 20px;
        line-height: 20px;
        margin: 0 0 0 3px;
        padding: 0;
        width: 170px;
      }

      #search_form {
        background: none repeat scroll 0 0 #FFFFFF;
        border-radius: 10px 10px 10px 10px;
        box-shadow: 1px 1px 4px #DBB42A;
        clear: both;
        display: block;
        height: 20px;
        margin: 0 0 5px;
        padding: 3px;
        width: 200px;
      }

      .search_submit {
        background: none repeat scroll 0 0 transparent;
        border: 0 none;
        display: block;
        float: right;
        font-size: 13px;
        height: 20px;
        line-height: 13px;
        margin: 0;
        padding: 0;
        width: 20px;
      }

      .hidden {display:none;}

			.h3 {
				font-family: "Trebuchet MS","Lucida Grande","Bitstream Vera Sans",Helvetica,Arial,sans-serif;
			}
			#mapper {
				font-weight: bold;
			}

			body, input, textarea, button, .button {
				    color: #111111;
						font-family: arial,helvetica,sans-serif;
						font-size: 13px;
						line-height: 18px;
			}

		</style>

</head>

<!-- body.onload is called once the page is loaded (call the 'init' function) -->
<body>

   <!-- define a DIV into which the map will appear. Make it take up the whole window -->
   <div id="map" class="olMap" style="right : 250px;"></div>

	 <div id="LocationPanel" class="InfoPanel" style="display: none;">
		 <h3>Location Favourits</h3>
		 <a href="#" id="loadLocations">load </a> - 
		 <div border="1px" style="margin: 10px;">
			 Name:<br>
			 <input id="name" type="text" style="width : 100%"/><br>
			 Describtion:<br>
			 <input id="desc" type="text" style="width : 100%"/><br>
			 <br>
			 <a href="#" id="saveLocation">save </a> - 
			 <hr>
		 </div>
		 <ol id="locationList">
			 <!--<li class="ui-widget-content">Item 1</li>-->
		 </ol>
	 </div>

	 <div id="PointInfoPanel" class="InfoPanel" style="display: none;">
		 <h3 style="margin: 2px 0px 2px;">Selected Point</h3>
		 selected features:
		 <span id="counter">0</span><br>
		 <a href="#" id="goto">goto </a><br>
		 lat: <span id="lat">0.00</span>
		 lon: <span id="lon">0.00</span><br>
		 <hr>
		 <h3 style="margin: 1px 0px 2px;">Last change</h3> 
		 <span id="mapper">user</span>
		 <span id="last_change">date</span>
		 <hr>
		 <h3 style="margin: 1px 0px 3px;">Describtion:</h3>
		 <div id="describtion">desc</div>
		 <hr>
	 </div>

	 <div id="StartInfoPanel" class="InfoPanel" style="display: block;">
		 <h3 style="margin: 1px 0px 2px;">Willkommen auf dieser Experimentellen Karte</h3>
		 z.Z. sind nur POIs aus niedersachsen Importiert
		 <hr>
		 <b>Last Update Database: </b>
		 <span id="last_update_db"><?php include "../config/last_db_update.php" ?></span>
		 <br>
		 <b>Last Update Frontend: </b>
		 <span id="last_update_fe">$$last_frontend_update$$</span>
		 <br>
		 <b>Last Update Code: </b>
		 <span id="last_update_cd">maybe Today^^ see code</span>
		 <hr>
		 <h3 style="margin: 1px 0px 2px;">Infos:</h3>
		 comming soon<br>
		 <hr>
		 bei Fragen oder Anregungen schreibt mir eine Mail an
		 <h3 style="margin: 1px 0px 2px;">Kontakt:</h3>
		 <b>Mail:</b><a href="mailto:k4r573n(at)gmail.de">k4r573n(at)gmail.de</a><br>
		 <b>Jabber:</b> <a href="jabber:k4r573n@jabber.ccc.de">k4r573n@jabber.ccc.de</a><br>
		 <b>OSM-Wiki:</b> <a href="http://wiki.openstreetmap.org/wiki/User:K4r573n">k4r573n</a><br>
		 <br><b>Code:</b><br>
		 <a href="https://github.com/k4r573n/EMOL">https://github.com/k4r573n/EMOL</a>
	 </div>

	 <div id="header" style="position: absolute; top:0px;right: 0px; left:0px; border-size: 2px; height:70px; margin: 10px 10px 10px 10px; /*background-color: #eebb33;*/">
    <div id="search" class="align_right">
      <form method="get" action="#" id="search_form" name="search" role="search">
      <div class="ui-widget">
        <input type="text" value="" id="q" name="q" />
        <button type="submit" class="search_submit button" title="Search">
          <span class="icon magnifier">&nbsp;</span>
          <span class="hidden">Search</span>
        </button>
        <div class="clear"></div>
      </div>
      </form>
    </div>

		 <a href="#" id="toggleLog" class="toggle_log">Debug</a> - 
		 <a href="#" id="toggleMeasure" class="toggle_tools">Measure</a> - 
		 <a href="#" id="braunschweig">goto bs</a>
		 <h1>EMOL - Easy Map OverLays</h1>
		 <!--
		 <a href="#" id="test">test</a> - 
		 <a href="#" id="showLocationPanel">Locations</a> - 
		 <input type="checkbox" name="move" id="moveFeatures" onclick="toggleMoveFeatures(this);" />
		 <label for="moveFeatures">move Feature</label>
		 - <a href="#" id="braunschweig">goto bs</a>
		 <input type="checkbox" id="toggleLog" class="toggle_log"/><label for="toggleLog">show log</label>
		 <input type="checkbox" id="toggleMeasure" class="toggle_tools" /><label for="toggleMeasure">measure</label>
		 -->
		 <div id="zoom" style="position: absolute; right: 10px;"></div>

    <div id="drawing_tools" style="display: none;">
                <input type="radio" name="type" value="none" id="noneDrawToggle"
                       onclick="toggleDrawControl(this);" checked="checked" />
                <label for="noneDrawToggle">navigate</label>
                <input type="radio" name="type" value="point" id="pointToggle" onclick="toggleDrawControl(this);" />
                <label for="pointToggle">draw point</label>
                <input type="radio" name="type" value="line" id="lineToggle" onclick="toggleDrawControl(this);" />
                <label for="lineToggle">draw line</label>
                <input type="radio" name="type" value="polygon" id="polygonToggle" onclick="toggleDrawControl(this);" />
                <label for="polygonToggle">draw polygon</label>
    </div>

	 </div>



   <div id="measureTools" class="floatingPanel draggable hidden ui-draggable" style="display: none;">
        <b class="handle">
            ToolBox <a href="#" class="close ui-icon ui-icon-closethick align_right" title="Close">Close</a>
        </b>

                <input type="radio" name="type" value="none" id="noneToggle"
                       onclick="toggleMeasureControl(this);" checked="checked" />
                <label for="noneToggle">navigate</label>
                <input type="radio" name="type" value="line" id="lineToggle" onclick="toggleMeasureControl(this);" />
                <label for="lineToggle">measure distance</label>

                <input type="radio" name="type" value="polygon" id="polygonToggle" onclick="toggleMeasureControl(this);" />
                <label for="polygonToggle">measure area</label>

        <div id="output">messung:</div>
    </div>

    <!-- for debugging -->
    <div id="log" class="hidden ui-draggable ui-resizable" style="display: none;">
        <b class="handle">
            Log <a href="#" class="close ui-icon ui-icon-closethick align_right" title="Close">Close</a>
        </b>
        <ol><li>Testing Maps log started Sun, 14 Aug 2011 23:04:07 +0200</li></ol>
    </div>

<iframe id="josm_call_iframe" src="#" style="visibility:hidden;"></iframe>
</body>

</html>