###############################################
#                                             #
# Makefile to generate a *.sql file For upload#
#                                             #
###############################################

#create a sql-file from an osm-file

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

#Password has to be placed in File ./ftp_pw
upload: 
	ftp-upload --debug -h bastler.bplaced.net --passive --dir ./osm -u bastler --password-fd=3 3<./ftp_pw $(UPLOAD)



edit:
	vim $(OSM_KEY).sql

osm: $(INPUT)
	josm $(INPUT)

clean:
	rm *.sql
