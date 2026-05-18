<?php

/**
 * Class that represents FileBox
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Form_FileBox extends Clevis_View_Form_TextBox {

    /**
     * File upload url
     *
     * @var url
     */
    private $fileUploadUrl = null;

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
        $this->setType('clevis.view.form.FileBox');
        $this->setTag('input');
        $this->setReadOnly(true);
    }

    /**
     * Set file upload url
     *
     * @param $fileUploadUrl
     */
    public function setFileUploadUrl($fileUploadUrl) {
        $this->fileUploadUrl = $fileUploadUrl;
    }

    /**
     * Pre render
     *
     * @return string
     */
    public function preRender() {
        if ($this->fileUploadUrl != null) {
            $this->setDojoAttribute('fileUploadUrl', Clevis_Helper::formatUrl($this->fileUploadUrl));
        }
        return parent::preRender();
    }

    /**
     * Render item
     *
     * @return string
     */
    public function render() {
        $output = '<div style="width: 350px;">' . PHP_EOL;
        $output .= '<table cellpadding="0" cellspacing="0"><tr style="height: 25px;">' . PHP_EOL;
        $output .= '<td valign="top" style="padding-top:2px; display: none;">' . parent::render() . '</input></td>' . PHP_EOL;
        $output .= '<td valign="top" style="width: 160px; padding-left:5px; padding:2px;" id="' . $this->getId() . '.place"></td>' . PHP_EOL;
        $output .= '<td valign="top" style="padding-top:2px;"></td>' . PHP_EOL;
        $output .= '</tr></table>' . PHP_EOL;
        $output .= '<div><a id="' . $this->getId() . '.show">Zobrazit</a></div>' . PHP_EOL;
        $output .= '</div>' . PHP_EOL;

        return $output;
    }

}

?>