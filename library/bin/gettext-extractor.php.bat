@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../voda/gettext-extractor/gettext-extractor.php
php "%BIN_TARGET%" %*
