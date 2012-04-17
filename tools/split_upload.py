#! /usr/bin/env python
import string
import getopt
import sys

print("Splits the <infile> in smaller files!")



def parse_and_convert(infile, outdir, part_size):
	print("start parsing")

	count = 0
	fooder = "COMMIT;"
	header1 = "set character set utf8;"
	header2 = "SET AUTOCOMMIT=0;"

	fin = open(infile, "r")
	while 1: 
		line = fin.readline()
		count = count + 1

		#print(line)

		print("create new file: '"+outdir+"/upload_part_%d.sql'"%(count))
		fout = open(outdir+"/upload_part_%d.sql"%(count), "w") 
		#head
		fout.write(header1+"\n") 
		fout.write(header2+"\n") 

		j = 0
		while j < part_size:
			j = j + 1
			if ( not line ) or ( line.rstrip().lower() == fooder.lower() ) :
				#fooder
				fout.write(fooder+"\n") 
				
				fout.close()
				fin.close()
				print("finish")
				sys.exit()
				
			elif ( line.rstrip().lower() == header1.lower() ) or ( line.rstrip().lower() == header2.lower() ) :
				j = j - 1
				line = fin.readline()
				continue
			else :
				#data left
				fout.write(line) 
				line = fin.readline()

		fout.write(fooder+"\n") 
		fout.close()
	fin.close()
	print("finish")


def main(argv):

	infile = "../tmp/upload.sql"
	outdir = "../tmp"
	part_size = 200000

	try:
		opts, args = getopt.getopt(argv, "i:o:s:h", ["infile=", "outdir=", "partsize="])
	except getopt.GetoptError:
		print("Wrong Syntax!!! Try to use \n"+sys.argv[0]+" -i <infile> -o <outdir> -s <part size (lines count)>")
		sys.exit(2)

	for opt, arg in opts:
		if opt == '-h':
			 print(sys.argv[0]+" -i <infile> -o <outdir>")
			 sys.exit()
		elif opt in ("-i", "--infile"):
			 infile = arg
		elif opt in ("-o", "--outdir"):
			outdir = arg
		elif opt in ("-s", "--outsize"):
			part_size = int(arg)

	parse_and_convert(infile, outdir, part_size)


if __name__ == "__main__":
    main(sys.argv[1:])

