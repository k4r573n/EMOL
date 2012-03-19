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

TODAY = $(shell date +%Y_%m_%d)

OLD_DATA = filtered_11_11_27.osm
NEW_DATA = filtered.osm

KEYLIST = wheelchair,tactile_paving,traffic_signals:sound,information,description:de:blind,amenity,leisure,blind:website:de,blind:audio:de,organic,shop

#alle meist genutzten ausgaben generieren
#getNiedersachsen
all: 
	make filter INPUT=nds.osm.pbf
	make convert INPUT=filtered.osm
	#make upload UPLOAD=$(OUTPUT).sql

incUpdate:
	make filter INPUT=nds.osm.pbf
	sleep 2
	make createDiff OLD_DATA=$(shell ls filtered_*.osm | tail -n 2 | head -n 1)
	sleep 2
	make upload UPLOAD=update_diff.sql
	sleep 2
	make applyUpload UPLOAD=update_diff.sql

$(INPUT):
	wget -O "$(INPUT)" "http://open.mapquestapi.com/xapi/api/0.6/node[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
		#wget -O "$(INPUT)" "http://jxapi.openstreetmap.org/xapi/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
#oder http://osmxapi.hypercube.telascience.org/api/0.6/*[amenity=shop][bbox=10.492,52.254,10.5551,52.2801]
#oder wget -O "$(INPUT)" "http://www.informationfreeway.org/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"


getNiedersachsen:
	wget -O nds_$(TODAY).osm.pbf http://download.geofabrik.de/osm/europe/germany/niedersachsen.osm.pbf
	ln -sf nds_$(TODAY).osm.pbf nds.osm.pbf


#uses this tool: http://wiki.openstreetmap.org/wiki/Osmconvert
#and this tool: https://github.com/k4r573n/osc2sql
createDiff:
	osmconvert32 $(OLD_DATA) $(NEW_DATA) --diff -o=changefile.osc
	osc2sql -i changefile.osc -o update_diff.sql


convert:
	osmosis --rx $(INPUT) --wmsd $(OUTPUT).sql


filter:
	osmosis --read-pbf $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--write-xml filtered_$(TODAY).osm
	ln -sf filtered_$(TODAY).osm filtered.osm


filterAndConvert:
	osmosis --rx $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--wmsd upload_all_filt_$(TODAY).sql
	ln -sf upload_all_filt_$(TODAY).sql upload.sql


download: 
	[ -e $(INPUT) ] && rm $(INPUT) || echo ""
	make input

doWheelchair:
	make OSM_KEY=wheelchair VALUE=*

input: $(INPUT)


#first zip sql-file upload
#Password has to be placed in File ./.ftp_api_pw
upload: 
	zip upload.zip $(UPLOAD)
	ftp-upload --debug -h $(API_SERVER) --passive --dir ./osm/upload/ \
		-u $(USER_API_SERVER) --password-fd=3 3<./.ftp_api_pw upload.zip
	rm upload.zip
	wget -O status "http://$(FRONTEND_SERVER)/osm/upload/unzipfile.php?file=upload.zip&dir=./"
	echo "rückgabe:"
	cat status
	rm status

#applyUpload:
#	echo "clear DB"
#	wget -O status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=clear_all_tables.sql"
#	echo "rückgabe:"
#	cat status
#	rm status
#	echo "fill DB"
#	wget -O status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=./upload/$(UPLOAD)"
#	echo "rückgabe:"
#	cat status
#	rm status
#	without clearing the tables for incremental uploads
applyUpload:
	echo "fill DB"
	wget -O status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=./upload/$(UPLOAD)"
	echo "rückgabe:"
	cat status
	rm status

cleanDB:
	echo "clear DB"
	wget -O status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=clear_all_tables.sql"
	echo "rückgabe:"
	cat status
	rm status

#######################################################################
## Upload frontend
###################

#first zip all files of project for upload
#Password has to be placed in File ./.ftp_frontend_pw
upload_project:
	cd .. && zip $(PROJECT).zip js/*.js js/img/* \
		js/theme/default/style.css style.css img/* README index.htm -r css/*
	ftp-upload --debug -h $(FRONTEND_SERVER) --passive --dir ./osm/upload/ \
		-u $(USER_FRONTEND_SERVER) --password-fd=3 3<./.ftp_frontend_pw ../$(PROJECT).zip
	rm ../$(PROJECT).zip
	wget -O status "http://$(FRONTEND_SERVER)/osm/upload/unzipfile.php?file=$(PROJECT).zip&dir=../$(PROJECT)"
	echo "rückgabe:"
	cat status
	rm status

clean:
	rm *.sql
