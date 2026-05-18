<?php

/**
 * Application version
 *
 * The major number is increased when there are significant jumps in functionality,
 * the minor number is incremented when only minor features or significant fixes
 * have been added, and the revision number is incremented when minor bugs are fixed.
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Version {

    const ALPHA = 0;
    const BETA = 1;
    const RELEASE_CANDIDATE = 2;
    const PUBLIC_RELEASE = 3;

    private static $major = 0;

    private static $minor = 0;

    private static $build = null;

    private static $revision = 0;

    public static function setMajor($major) {
        Clevis_Version::$major = $major;
    }

    public static function setMinor($minor) {
        Clevis_Version::$minor = $minor;
    }

    public static function setBuild($build) {
        Clevis_Version::$build = $build;
    }

    public static function setRevision($revision) {
        Clevis_Version::$revision = $revision;
    }
    
    public static function getMajor() {
        return Clevis_Version::$major;
    }

    public static function getVersion() {
        $version = '';
        $version .= Clevis_Version::$major;
        $version .= '.' . Clevis_Version::$minor;
        if ( Clevis_Version::$build !== null )
            $version .= '.' . Clevis_Version::$build;
        if ( Clevis_Version::$revision !== null )
            $version .= '.' . Clevis_Version::$revision;

        switch ( Clevis_Version::$build ) {
            case 0:
                $version .= ' Alpha';
                break;
            case 1:
                $version .= ' Beta';
                break;
            case 2:
                $version .= ' RC';
                break;
            case 3:
                $version .= ' Plná verze';
                break;
            default:
                break;
        }
        return $version;
    }
}
?>