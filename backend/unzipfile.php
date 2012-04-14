<?php

//copied from:
//http://www.bjw.co.nz/developer/php/62-php-unzip-an-uploaded-file-using-php

$zip = new ZipArchive;
$dir = "temp/";
if(isset($_GET['dir']))
	$dir = $_GET['dir'];

if(isset($_GET['file']))
{
	$file = $_GET['file'];
	$res = $zip->open($file);

	if ($res === TRUE) {
		$zip->extractTo($dir);
		$zip->close();
		echo "extraction $file to $dir succeded";
	} else {
		echo "extraction $file to $dir FAILED";
	}
}else{
	echo "no file specified use ?file=<file>&dir=<extract directory>";
}

?> 
