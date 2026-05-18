<?php

/**
 * Helper class for cleaning the dojo release.
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_DojoReleaseCleaner
{
    /**
     * @param $dir
     * @return true if given $dir is empty,
     *         false otherwise
     */
    private static function isDirEmpty($dir) {
        if (!is_readable($dir)) return NULL;
        return (count(scandir($dir)) == 2);
    }

    /**
     * @param $releasePath to be cleaned
     * @return array
     */
    public static function clean($releasePath)
    {
        // Pattern for files which should be kept
        $keepPatterns = array(
            'jquery.min.js$',
            'clevis.js$',
            'clevis_cs.js$',
            'clevis.css$',
            'dojo/dojo.js$',
            'themes/claro/claro.css$',
            'themes/claro/document.css$',
            'claroGrid.css$',
            'FileInput.css$',
            'Lightbox.css$',
            '.png$',
            '.gif$',
            '.jpg$',
        );
        // Pattern for files which should be deleted (but they match $keepPattern)
        $keepDeletePatterns = array(
            'themes/(?!.*?claro).*/',
            'dojox/gantt',
            'dojox/geo',
        );
        // Pattern for files which should be kept (but they match $keepDeletePatterns)
        $keepDeleteKeepPatterns = array(
            'indeterminate_progress.gif$'
        );

        // Patterns for matching files
        $keepPattern = '/(' . str_replace('/', '\\/', implode(')|(', $keepPatterns)) . ')/';
        $keepDeletePattern = null;
        if ( count($keepDeletePatterns) > 0 ) {
            $keepDeletePattern = '/(' . str_replace('/', '\\/', implode(')|(', $keepDeletePatterns)) . ')/';
        }
        $keepDeleteKeepPattern = null;
        if ( count($keepDeleteKeepPatterns) > 0 ) {
            $keepDeleteKeepPattern = '/(' . str_replace('/', '\\/', implode(')|(', $keepDeleteKeepPatterns)) . ')/';
        }

        $result = array(
            'keep-file' => array(),
            'delete-file' => array(),
            'delete-folder' => array()
        );

        // Find all files
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($releasePath),
            RecursiveIteratorIterator::SELF_FIRST
        );
        foreach($files as $name => $file){
            $fileName = $file->getPathname();
            $fileName = str_replace($releasePath, '', $fileName);
            $fileName = str_replace('\\', '/', $fileName);
            if ( !$file->isFile() ) {
                continue;
            }
            if ( preg_match($keepPattern, $fileName) ) {
                if ( $keepDeletePattern == null || !preg_match($keepDeletePattern, $fileName) ) {
                    // Keep file
                    $result['keep-file'][] = $fileName;
                    continue;
                }
                else if ( $keepDeleteKeepPattern != null && preg_match($keepDeleteKeepPattern, $fileName) ) {
                    $result['keep-file'][] = $fileName;
                    continue;
                }
            }

            // Delete file
            $result['delete-file'][] = $fileName;
            unlink($file->getPathname());
        }

        $iterator = new RecursiveDirectoryIterator($releasePath);
        $iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
        $directories = new ParentIterator($iterator);
        foreach (new RecursiveIteratorIterator($directories, RecursiveIteratorIterator::CHILD_FIRST) as $dir) {
            $dirName = $dir->getPathname();
            $dirName = str_replace($releasePath, '', $dirName);
            if (self::isDirEmpty($dir->getPathname())) {
                $result['delete-folder'][] = $dirName;
                rmdir($dir->getPathname());
            }
        }

        return $result;
    }
}
