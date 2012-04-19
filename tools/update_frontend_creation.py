#! /usr/bin/env python

# this file replaces var with current date

from string import Template 
import time

filein = "frontend/index.html"
#filein = sys.argv[1]
fileout = "frontend/index.htm"

today = time.strftime("%Y-%m-%d")
today_nice = time.strftime("%d.%m.%Y")

templateFile = open(filein,"r")
content = templateFile.readlines()
templateFile.close()

t = Template("".join(content))
newContent = t.safe_substitute(date=today, nice_date=today_nice)

f = open(fileout, "w")
f.writelines(newContent)
f.close()

