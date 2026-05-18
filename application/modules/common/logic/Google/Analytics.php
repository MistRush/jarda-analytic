<?php
namespace common\logic\Google;

/**
 * Module constants
 */
class Analytics {

    private $analytics;

    //
    private $profile;

    /**
     * Constructor
     */
    public function __construct() {
        $this->initializeAnalytics();

        // momentalne na tvrdo djzd.cz
        $this->setProfile(176522293);
        //$this->initializeProfile();
    }

    private function initializeAnalytics() {
        $KEY_FILE_LOCATION = '../data/keys/googleapi/service-account-credentials.json';

        // Create and configure a new client object.
        $client = new \Google_Client();
        $client->setApplicationName('Admin dashboard');
        $client->setAuthConfig($KEY_FILE_LOCATION);
        $client->setScopes(['https://www.googleapis.com/auth/analytics.readonly']);
        $analytics = new \Google_Service_Analytics($client);

        $this->setAnalytics($analytics);
    }

    private function initializeProfile() {
        $analytics = $this->getAnalytics();

        // Get the user's first view (profile) ID.
        $accounts = $analytics->management_accounts->listManagementAccounts();

        if (count($accounts->getItems()) > 0) {
            $items = $accounts->getItems();
            $firstAccountId = $items[0]->getId();
            $properties = $analytics->management_webproperties ->listManagementWebproperties($firstAccountId);

            if (count($properties->getItems()) > 0) {
                $items = $properties->getItems();
                $firstPropertyId = $items[0]->getId();

                $profiles = $analytics->management_profiles->listManagementProfiles($firstAccountId, $firstPropertyId);

                if (count($profiles->getItems()) > 0) {
                    $items = $profiles->getItems();
                    $this->setProfile($items[0]->getId());
                } else {
                    throw new Exception('No views (profiles) found for this user.');
                }
            } else {
                throw new Exception('No properties found for this user.');
            }
        } else {
            throw new Exception('No accounts found for this user.');
        }
    }

    public function getResults($from, $to, $metrics) {
        $results = $this->getAnalytics()->data_ga->get('ga:' . $this->getProfile(), $from, $to, $metrics);

        if (count($results->getRows()) > 0) {
            $rows = $results->getRows();
            $sessions = $rows[0][0];

            return $sessions;
        }
    }

    /**
     * @return mixed
     */
    public function getAnalytics() {
        return $this->analytics;
    }

    /**
     * @param mixed $analytics
     */
    public function setAnalytics($analytics): void {
        $this->analytics = $analytics;
    }

    /**
     * @return mixed
     */
    public function getProfile() {
        return $this->profile;
    }

    /**
     * @param mixed $profile
     */
    public function setProfile($profile): void {
        $this->profile = $profile;
    }

    /** Single instance */
    private static $instance;

    /**
     * Get single instace
     *
     * @return Analytics
     */
    public static function getInstance() {
        if (!isset(self::$instance))
            self::$instance = new Analytics();

        return self::$instance;
    }
}