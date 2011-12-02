<?php

//copied from:
//http://www.bjw.co.nz/developer/php/62-php-unzip-an-uploaded-file-using-php

$zip = new ZipArchive;
$res = $zip->open(’my_zip_file.zip’);

if ($res === TRUE) {
	$zip->extractTo(’my_extract_to_dir/’);
	$zip->close();
	echo ‘ok’;
} else {
	echo ‘failed’;
}

?> 
