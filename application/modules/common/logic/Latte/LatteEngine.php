<?php
namespace common\logic\Latte;

use Latte\Engine;

/**
 * Module constants
 */
class LatteEngine {

    /** Single instance */
    private static Engine $instance;

    /**
     * Get single instace
     *
     * @param string|null $locale
     * @return Engine
     */
    public static function getInstance(string $locale = null): Engine {
        if (!isset(self::$instance)) {
            $latte = new Engine();
            $latte->setTempDirectory($_SERVER["DOCUMENT_ROOT"]._bu().'/../data/cache/latte');

            $latte->addFilter('translate', function ($message) use ($locale)  {
                return translate($message, $locale);
            });

            $latte->addFilter('instagramCollection', function ($collectionID) {
                $collectionMedia = \Admin_Model_InstagramMedia::getCollectionByID(intval($collectionID));
                if(sizeof($collectionMedia) > 0) {
                    $output = '<div class="instagram-collection-post instagram-carousel owl-carousel owl-theme">';
                    foreach ($collectionMedia as $collection) {
                        $output.= '<a target="_blank" href="'.$collection['Permalink'].'"> 
                    <div class="instagram-image" style="background-image:url('.$collection['Cdnpath'].')"></div></a>';
                    }
                    $output .='</div>';
                    return $output;
                }
            });

            $latte->addFilter('cleanEntities', function ($s) {
                $s = str_replace('&&#x23;x26;', '&', $s);
                $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                return $s;
            });

            $latte->addFilter('cryptedmail', function ($email) {
                $domain = '';
                $tld = '';
                $emailArray = explode('@', $email);
                $name = $emailArray[0];

                if ( isset($emailArray[1]) ) {
                    $emailArray2 = explode('.', $emailArray[1]);
                    $domain = $emailArray2[0];

                    if (isset($emailArray2[1]))
                        $tld = $emailArray2[1];
                }

                return '<a href="#" class="cryptedmail"
                                       data-name="' . $name . '" 
                                       data-domain="' . $domain . '"  
                                       data-tld="' . $tld . '" 
                                       onclick="window.location.href = \'mailto:\' + this.dataset.name + \'@\' + this.dataset.domain + \'.\' + this.dataset.tld; return false;"></a>';
            });

            $latte->addFilter('customBLock', function ($blockCode) {
                $blockContent = BlockContent::getInstance()->getBlockContent($blockCode);

                return $blockContent;
            });

            self::$instance = $latte;
        }

        return self::$instance;
    }

}