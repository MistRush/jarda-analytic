<?php
namespace common\logic\Email;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use Latte\Engine;

abstract class TemplateFactory {

    const IMG_LOGO = '/img/front/logo.png';
    const EMAIL_DIR = '/img/email-icons';

    /**
     * Render latte file
     *
     * @param string|null $template Name of template
     * @param array $params Latte parameters
     * @param EshopModel|null $eshop
     * @return string Returns rendered latte file
     */
    final protected static function render(?string $template = null, array$params = [], ?EshopModel $eshop = null): string {
        $latte = new Engine();
//        $latte->setTempDirectory($_SERVER['DOCUMENT_ROOT']._bu(). '/../data/latte/cache');

        if ( !$eshop )
            $eshop = Eshop::getInstance()->getEshop();

        $baseParams = [
            'web_url' => $eshop->URL,
            'web_name' => $eshop->Name,
            'footer_email' => $eshop->settings->ContactEmail,
            'logo' => $eshop->settings->ProjectURL . self::IMG_LOGO,
            'email_dir' => self::EMAIL_DIR,
            'locale' => $eshop->language->Code,
            'locale_id' => $eshop->Language_ID,
            'eshop' => $eshop,
        ];

        $params = array_merge($baseParams,$params);

        $latte->addFilter('translate', function ($message) use ($eshop) {
            return translate($message, $eshop->language->Code);
        });

        $latte->addFilter('replaceVars', function ($textToReplace, $replace = []) use ($eshop) {
            $textToReplace = str_replace('[ESHOP_NAME]', $eshop->Name, $textToReplace);
            $textToReplace = str_replace('[eshop_url]', $eshop->URL, $textToReplace);

            if (is_array($replace)) {
                foreach ($replace as $key => $value) {
                    $textToReplace = str_replace('[' . $key . ']', $value, $textToReplace);
                }
            }

            return $textToReplace;
        });

        $latte->addFilter('toLink', function ($text, $link = null, $prefix = null) {
            $blue_color = '#F7925A';
            $link = $prefix . ($link??$text);
            return "<a style=\"color:{$blue_color};\" href=\"{$link}\">{$text}</a>";
        });
        
        $latte->addFilter('formatUrl', function ($url, $name = null, $color = '#FF4D9B') {
            $name = ($name != null)? $name : $url;
            $url = (preg_match('/^\w*[.]\w*/', $url) > 0) ? ('https://'.$url): $url;
            return '<a href="' . $url . '" style="text-decoration:none;color:' . $color . ';">' . $name . '</a>';
        });

        $latte->addFilter('extUrl', function ($url) {
            return preg_replace('/^(?!http[s]?:\/\/|\/|mailto:|tel:).*$/', 'https://$0', $url);
        });

        if (empty($template))
            $template = strtolower(preg_replace('/^render(.+)$/', '$1', debug_backtrace()[1]['function']));

        return $latte->renderToString(__DIR__ . "/templates/" . $template . ".latte", $params);
    }

    /**
     * Generate Image path
     *
     * @param string $name Filename without suffix (.png, .jpg, .gif, ...)
     * @param string $suffix Suffix (png, jpg, gif, ...)
     *
     * @return string
     */
    final protected static function eimg(string $name, string $suffix = 'png'):string {
        $eshop = Eshop::getInstance()->getEshop();

        return $eshop->settings->ProjectURL . self::EMAIL_DIR . '/' . $name . '.' . $suffix;
    }

    /**
     * Nastaví předmět a vyplní proměnné části
     * @param string $subject
     * @param array $params
     * @param EshopModel|null $eshop
     * @return string
     */
    final public static function subject(string $subject, array $params = [], ?EshopModel $eshop = null): string {
        if ( !$eshop )
            $eshop = Eshop::getInstance()->getEshop();

        $baseParams = [
            'URL' => $eshop->URL,
            'SHOP' => '[' . $eshop->Name . ']',
        ];

        $params = array_merge($baseParams, $params);

        foreach ($params as $param=>$value) {
            $subject = str_replace("[$param]", $value, $subject);
        }

        return $subject;
    }
}