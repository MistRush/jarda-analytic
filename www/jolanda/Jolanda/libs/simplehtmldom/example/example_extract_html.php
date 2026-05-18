<?php
include_once('../dom.php');

echo file_get_html('http://www.google.com/')->plaintext;
?>