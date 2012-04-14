###############################################
#                                             #
# Makefile to generate a *.sql file For upload#
#                                             #
###############################################

#create a sql-file from an osm-file
PROJECT = bildungsatlas

FRONTEND_SERVER = bastler.bplaced.net
USER_FRONTEND_SERVER = bastler

API_SERVER = bastler.bplaced.net
USER_API_SERVER = bastler

OSM_KEY = wheelchair
OSM_VALUE = *
INPUT = $(OSM_KEY).osm
OUTPUT = upload
UPLOAD = upload.sql

#ablsolute path!!! without terminating '/'
TMP_DIR = $(shell readlink -m tmp/)

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

OLD_DATA = $(TMP_DIR)/filtered_11_11_27.osm
NEW_DATA = $(TMP_DIR)/filtered.osm

KEYLIST = wheelchair,tactile_paving,traffic_signals:sound,information,description:de:blind,amenity,leisure,blind:website:de,blind:audio:de,organic,shop

#alle meist genutzten ausgaben generieren
#getNiedersachsen
all: 
	make filter INPUT=$(TMP_DIR)/nds.osm.pbf
	make convert INPUT=$(TMP_DIR)/filtered.osm
	#make upload UPLOAD=$(OUTPUT).sql

#experimental - not ready to work
incUpdate:
	make filter INPUT=$(TMP_DIR)/nds.osm.pbf
	sleep 2
	make createDiff OLD_DATA=$(shell ls $(TMP_DIR)/filtered_*.osm | tail -n 2 | head -n 1)
	sleep 2
	make upload UPLOAD=update_diff.sql
	sleep 2
	make applyUpload UPLOAD=update_diff.sql

#clears the whole database and fills ist with new data
database_overwrite:
	make filter INPUT=$(TMP_DIR)/nds.osm.pbf
	sleep 2
	make filterAndConvert INPUT=$(TMP_DIR)/filtered.osm
	sleep 2
	make upload
	sleep 2
	make cleanDB
	sleep 2
	make applyUpload


getNiedersachsen:
	wget -O $(TMP_DIR)/nds_$(TODAY).osm.pbf http://download.geofabrik.de/osm/europe/germany/niedersachsen.osm.pbf
	ln -sf $(TMP_DIR)/nds_$(TODAY).osm.pbf $(TMP_DIR)/nds.osm.pbf


#uses this tool: http://wiki.openstreetmap.org/wiki/Osmconvert
#and this tool: https://github.com/k4r573n/osc2sql
#still experimental!
createDiff:
	osmconvert32 $(OLD_DATA) $(NEW_DATA) --diff -o=$(TMP_DIR)/changefile.osc
	osc2sql -i $(TMP_DIR)/changefile.osc -o $(TMP_DIR)/update_diff.sql


convert:
	osmosis --rx $(INPUT) --wmsd $(TMP_DIR)/$(OUTPUT).sql

# 2,3 GB - to big for free hosts!
convert_nds:
	osmosis --read-pbf $(TMP_DIR)/nds.osm.pbf --wmsd $(TMP_DIR)/$(OUTPUT).sql


filter:
	osmosis --read-pbf $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--write-xml $(TMP_DIR)/filtered_$(TODAY).osm
	ln -sf $(TMP_DIR)/filtered_$(TODAY).osm $(TMP_DIR)/filtered.osm


filterAndConvert:
	osmosis --rx $(INPUT) \
		--node-key  keyList="$(KEYLIST)" \
	--wmsd $(TMP_DIR)/upload_all_filt_$(TODAY).sql
	ln -sf $(TMP_DIR)/upload_all_filt_$(TODAY).sql $(TMP_DIR)/upload.sql


#download: 
#	[ -e $(INPUT) ] && rm $(INPUT) || echo ""
#	make input

#doWheelchair:
#	make OSM_KEY=wheelchair VALUE=*

#input: $(INPUT)


#first zip sql-file upload
#Password has to be placed in File ./.ftp_api_pw
upload: 
	zip $(TMP_DIR)/upload.zip $(TMP_DIR)/$(UPLOAD)
	./tools/ftp_upload.sh $(API_SERVER)\
		$(USER_API_SERVER) `cat ./config/.ftp_api_pw`\
		./osm/upload/ \
		$(TMP_DIR)/upload.zip\
		upload.zip
	rm $(TMP_DIR)/upload.zip
	wget -O $(TMP_DIR)/status "http://$(FRONTEND_SERVER)/osm/unzipfile.php?file=upload.zip&dir=./upload/"
	echo "rückgabe:"
	cat $(TMP_DIR)/status
	rm $(TMP_DIR)/status

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
	wget -O $(TMP_DIR)/status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=./upload/$(UPLOAD)"
	echo "rückgabe:"
	cat $(TMP_DIR)/status
	rm $(TMP_DIR)/status
	echo "<?php print '$(shell date +%d.%m.%Y)'; ?>" > $(TMP_DIR)/last_db_update.php
	./tools/ftp_upload.sh $(API_SERVER)\
		$(USER_API_SERVER) `cat ./config/.ftp_api_pw`\
		./osm/config/ \
		$(TMP_DIR)/last_db_update.php\
		last_db_update.php


cleanDB:
	echo "clear DB"
	wget -O $(TMP_DIR)/status "http://$(FRONTEND_SERVER)/osm/insert_sql.php?file=clear_all_tables.sql"
	echo "rückgabe:"
	cat $(TMP_DIR)/status
	rm $(TMP_DIR)/status

#######################################################################
## Upload frontend
###################

#first zip all files of project for upload
#Password has to be placed in File ./.ftp_frontend_pw
upload_project:
	echo "<?php print '$(shell date +%Y-%m-%d)'; ?>" > frontend/last_update.php
	cd frontend && zip $(TMP_DIR)/$(PROJECT).zip js/*.js js/img/* last_update.php\
		js/theme/default/style.css css/style.css img/* ../README index.php -r css/*
	./tools/ftp_upload.sh $(FRONTEND_SERVER)\
		$(USER_FRONTEND_SERVER) `cat ./config/.ftp_frontend_pw`\
		./osm/upload/ \
		$(TMP_DIR)/$(PROJECT).zip\
		$(PROJECT).zip
	rm $(TMP_DIR)/$(PROJECT).zip
	wget -O $(TMP_DIR)/status "http://$(FRONTEND_SERVER)/osm/unzipfile.php?file=$(PROJECT).zip&dir=$(PROJECT)"
	echo "rückgabe:"
	cat $(TMP_DIR)/status
	rm $(TMP_DIR)/status

#######################################################################
## Upload Backend
###################

#first zip all files of project for upload
#Password has to be placed in File ./.ftp_frontend_pw
upload_backend:
	cd backend && zip $(TMP_DIR)/backend.zip *.php clear_all.sql api/* config/.mysql.config.php
	./tools/ftp_upload.sh $(API_SERVER)\
		$(USER_API_SERVER) `cat ./config/.ftp_api_pw`\
		./osm/upload/ \
		$(TMP_DIR)/backend.zip\
		backend.zip
	rm $(TMP_DIR)/backend.zip
	wget -O $(TMP_DIR)/status "http://$(API_SERVER)/osm/unzipfile.php?file=backend.zip&dir=./"
	echo "rückgabe:"
	cat $(TMP_DIR)/status
	rm $(TMP_DIR)/status

clean:
	rm $(TMP_DIR)/*.sql
