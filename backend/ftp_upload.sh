#!/bin/sh 
FTP_HOST=$1 
FTP_NAME=$2 
FTP_PASS=$3 

FTP_DIR=$4
SRC_FILE=$5 
DST_FILE=$6 
  
#PROXY_SERVER=192.168.1.1 
  
TMPFILE=`mktemp /tmp/ftptrans_remotels.XXXXXXXXXX` 
  
if [ "$5" = "" ] ;  then 
        echo Ftp File Transfer via MAERSK proxy 
        echo 
        echo Usage: 
        echo ftptrans.sh [FTP_HOST] [FTP_NAME] [FTP_PASS] [FTP_DIR] [SRC_FILE] [DST_FILE] 
        echo note that DST_FILE must be a file name without directories 
        exit 
fi 
  
echo "FTP TRANSFER to $FTP_NAME@$FTP_HOST identified by $FTP_PASS" 
echo "tmp file is $TMPFILE" 
  
#ftp -n  $PROXY_SERVER <<EOF 
ftp -n  <<EOD 
open $FTP_HOST
user $FTP_NAME $FTP_PASS 
passive
cd $FTP_DIR
binary 
put $SRC_FILE $DST_FILE
ls . $TMPFILE 
bye 
EOD
  
cat $TMPFILE | if grep $DST_FILE ; then 
	echo Done 
	exit 0 
else 
	echo Error 
	exit 1 
fi 

