#!/bin/bash

mkdir js
cd js
wget http://openlayers.org/dev/OpenLayers.js
wget http://www.openstreetmap.org/openlayers/OpenStreetMap.js
wget http://code.jquery.com/jquery-1.6.2.min.js
wget https://jquery-json.googlecode.com/files/jquery.json-2.2.min.js

mkdir theme
mkdir theme/default
cd theme/default
wget http://openlayers.org/dev/theme/default/style.css
