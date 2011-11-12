###############################################
#                                             #
# Makefile to generate a *.sql file For upload#
#                                             #
###############################################

#create a sql-file from an osm-file

OSM_KEY = wheelchair
OSM_VALUE = *
#OSM_VALUE = cafe
INPUT = $(OSM_KEY).osm
OUTPUT = $(OSM_VALUE)

##location
LEFT = 10.492
BOTTOM = 52.2407
RIGHT = 10.7551
TOP = 52.4801
#LEFT = 6.43
#BOTTOM = 50.32
#RIGHT = 14.43
#TOP = 54.27

#alle meist genutzten ausgaben generieren
all: convert

$(INPUT):
	wget -O "$(INPUT)" "http://open.mapquestapi.com/xapi/api/0.6/node[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
		#wget -O "$(INPUT)" "http://jxapi.openstreetmap.org/xapi/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"
#oder http://osmxapi.hypercube.telascience.org/api/0.6/*[amenity=shop][bbox=10.492,52.254,10.5551,52.2801]
#oder wget -O "$(INPUT)" "http://www.informationfreeway.org/api/0.6/*[$(OSM_KEY)=$(OSM_VALUE)][bbox=$(LEFT),$(BOTTOM),$(RIGHT),$(TOP)]"

convert:
	osmosis --rx $(INPUT) --wmsd $(OSM_KEY).sql


download: 
	[ -e $(INPUT) ] && rm $(INPUT) || echo ""
	make input

dowheelchair:
	make OSM_KEY=wheelchair VALUE=*

input: $(INPUT)

edit:
	vim $(OSM_KEY).sql

osm: $(INPUT)
	josm $(INPUT)

clean:
	rm *.sql
