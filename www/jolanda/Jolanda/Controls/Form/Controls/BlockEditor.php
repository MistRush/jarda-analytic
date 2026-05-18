<?php

namespace Jolanda\Controls\Form\Controls;

use Jolanda\Latte\Latte;
use Nette\Utils\Html;

/**
* Class BlockEditor
 *
 * @package Jolanda\Controls\Form\Controls
*/
class BlockEditor extends FormControl
{
    /**
     * Pole bloků v editoru
     *
     * @var array
     */
    public $blocks;

    /**
     * Holder editoru
     *
     * @var Html
     */
    private $holder;

    /**
     * Script element pro bloky
     *
     * @var Html
     */
    private $script;

    private $basePath;


    public function __construct($super, string $name, string $takeDataFrom)
    {
        parent::__construct($super, $name . '_editor');
        $this->controlPart = Html::el('div');
        $this->controlPart->setAttribute('class', 'form-control');
        $this->controlPart->setAttribute('class', 'block-editor-holder');
        $this->controlPart->appendAttribute('blockeditordata', $takeDataFrom);
        $this->controlPart->appendAttribute('name', $this->getName());

        $this->holder = $this->controlPart->create('div');
        $this->holder->setAttribute('class', 'block-editor');

        $this->script = $this->controlPart->create('script');
        $this->basePath = $_SERVER["DOCUMENT_ROOT"]._bu().'/../application/modules';
    }

    private function addBlockToElement(): void
    {
        $this->script->setHtml('var ' . $this->name . '_addBlocks = function (editor){');
        foreach ($this->blocks as $block){
            $block = str_replace(['<script>','</script>'], '', $block);
            $this->script->addHtml($block);
        }
        $this->script->addHtml('};');
    }

    /**
     * Přidá block do blogu (editor.BlockManager.add(...))
     *
     * @param string $html editor.BlockManager.add(...)
     */
    public function addBlockAsHTML(string $html): void
    {
        $this->blocks[] = $html;
        $this->addBlockToElement();
    }

    /**
     * Přidá block do blogu ze šablony (blockManager.add(...))
     *
     * @param string $filePath cesta k šabloně (/application/modules + filePath)
     * @param array $params parametry
     */
    public function addBlockFromFile(string $filePath, array $params = []): void
    {
        $latte = Latte::getInstance()->getEngine();

        $html = $latte->renderToString($this->basePath . $filePath, $params);

        $this->addBlockAsHTML($html);
    }
}