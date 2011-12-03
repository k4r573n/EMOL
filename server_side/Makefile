###############################################
#                                             #
# Makefile to generate a *.sql file For upload#
#                                             #
###############################################

#create a sql-file from an osm-file
PROJECT = emol
FRONTEND_SERVER = bastler.bplaced.net
USER_FRONTEND_SERVER = bastler
API_SERVER = bastler.bplaced.net
USER_API_SERVER = bastler

OSM_KEY = wheelchair
OSM_VALUE = *
INPUT = $(OSM_KEY).osm
OUTPUT = upload
UPLOAD = upload.sql

##location
LEFT = 10.492
BOTTOM = 52.2407
RIGHT = 10.7551
TOP = 52.4801
#LEFT = 6.43
#BOTTOM = 50.32
#RIGHT = 14.43
#TOP = 54.27

KEYLIST = wheelchair,tactile_paving,traffic_signals:sound,information,description:de:blind,amenity,leisure,blind:website:de,blind:audio:de,organic,shop

#alle meist genutzten ausgaben generieren
#getNiedersachsen
all: 
	make filter INPUT=/tmp/nds.osm
	make convert INPUT=filtered.osm
	make upload UPLOAD=$(OUTPUT).sql

$(INPUT):
	wget -O "$(INPUT)" "http://open.mapquestapi.com/xapi/api/0.6/node[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
		#wget -O "$(INPUT)" "http://jxapi.openstreetmap.org/xapi/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
#oder http://osmxapi.hypercube.telascience.org/api/0.6/*[amenity=shop][bbox=10.492,52.254,10.5551,52.2801]
#oder wget -O "$(INPUT)" "http://www.informationfreeway.org/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"

getNiedersachsen:
	wget -O /tmp/nds.osm.bz2 http://download.geofabrik.de/osm/europe/germany/niedersachsen.osm.bz2
	bzip2 -d /tmp/nds.osm.bz2


convert:
	osmosis --rx $(INPUT) --wmsd $(OUTPUT).sql

filter:
	osmosis --rx $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--write-xml filtered.osm

filterAndConvert:
	osmosis --rx $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--wmsd upload.sql


download: 
	[ -e $(INPUT) ] && rm $(INPUT) || echo ""
	make input

doWheelchair:
	make OSM_KEY=wheelchair VALUE=*

input: $(INPUT)

#Password has to be placed in File ./ftp_api_pw
upload: 
	ftp-upload --debug -h $(API_SERVER) --passive --dir ./osm/upload/ \
		-u $(USER_API_SERVER) --password-fd=3 3<./ftp_api_pw $(UPLOAD)

#######################################################################
## Upload frontend
###################

#first zip all files of project for upload
#Password has to be placed in File ./ftp_frontend_pw
upload_project:
	cd .. && zip $(PROJECT).zip js/*.js js/img/* \
		js/theme/default/style.css img/* README index.htm -r css/*
	ftp-upload --debug -h $(FRONTEND_SERVER) --passive --dir ./osm/upload/ \
		-u $(USER_FRONTEND_SERVER) --password-fd=3 3<./ftp_frontend_pw ../$(PROJECT).zip
	rm ../$(PROJECT).zip
	wget -O status "http://$(FRONTEND_SERVER)/osm/upload/unzipfile.php?file=$(PROJECT).zip&dir=../$(PROJECT)"
	echo "rückgabe:"
	cat status
	rm status

clean:
	rm *.sql
