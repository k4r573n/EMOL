#!/bin/bash

wget http://jqueryui.com/download/jquery-ui-1.8.16.custom.zip
unzip jquery-ui-1.8.16.custom.zip
rm jquery-ui-1.8.16.custom.zip

mkdir js
cd js
wget http://openlayers.org/dev/OpenLayers.js
wget http://www.openstreetmap.org/openlayers/OpenStreetMap.js
wget http://code.jquery.com/jquery-1.6.2.min.js
wget https://jquery-json.googlecode.com/files/jquery.json-2.2.min.js

wget http://plugins.jquery.com/files/jquery.scrollTo-1.4.2.zip
unzip jquery.scrollTo-1.4.2.zip
rm jquery.scrollTo-1.4.2.zip


mkdir theme
mkdir theme/default
cd theme/default
wget http://openlayers.org/dev/theme/default/style.css
