<?php

namespace Jolanda\Controls\Form\Controls\Renderers;

use Doctrine_Query;
use Jolanda\libs\simplehtmldom\dom;
use Jolanda\libs\simplehtmldom\dom as simple_html_dom;
use Jolanda\libs\simplehtmldom\domNode as simple_html_dom_node;

class BlockEditorRenderer
{
    private bool $_debug = false;
    private bool $_clearAttributes = true;

    private array $formatFunctions;
    private string|int $lang_id;


    public function __construct($debug = false){
        $this->formatFunctions = [];
        $this->setDebug($debug);
    }

    /**
     * Nastaví rendrování v debug módu
     *
     * @param bool $debug
     *
     * @return self
     */
    public function setDebug(bool $debug = true): self
    {
        $this->_debug = $debug;
        return $this;
    }

    /**
     * Nastaví mazání html atributů po renderu
     *
     * @param bool $clearAttributes
     *
     * @return self
     */
    public function clearAttributesAfterRender(bool $clearAttributes = true): self
    {
        $this->_clearAttributes = $clearAttributes;
        return $this;
    }

    /**
     * Nastaví funkci pro formátování ceny
     * alias pro setColumnTypeFormatFunction('price', $priceFormatFunction)
     *
     * @param ?callable $priceFormatFunction function($object, $column, $blockAttributes, $columnParams){...}
     *
     * @return self
     */
    public function setPriceFormatFunction(?callable $priceFormatFunction = null): self
    {
        return $this->setColumnTypeFormatFunction('price', $priceFormatFunction);
    }

    /**
     * Nastaví formatovací funkci pro column-type
     *
     * @param string $type storeblock-column-type attribut
     * @param ?callable $formatFunction function($object, $column, $blockAttributes, $columnParams){...}
     *
     * @return self
     */
    public function setColumnTypeFormatFunction(string $type, ?callable $formatFunction): self
    {
        $this->formatFunctions[$type] = $formatFunction;
        return $this;
    }

    /**
     * Funkce pro rendrování z blockEditoru
     *
     * @param Object|string $json json blockEditoru z databáze
     * @param int|string $lang_id id jazyka pro renderování
     *
     * @return array Vrací vyrenderované pole ['html' => 'Vyrenderovány content jako html string', 'css' => 'CSS styly']
     */
    public function render(Object|string $json, int|string $lang_id = null, bool $applyInlineCss = false): array
    {
        $this->lang_id = $lang_id;

        if(is_string($json)){
            $json = json_decode($json);

            if(json_last_error() !== JSON_ERROR_NONE){
                return [
                    'content' => 'ERROR: String is not json',
                    'css' => '',
                ];
            }
        }
        $content = !empty($json->html) ? $json->html : '<div></div>';
        $css = $json->css ?? '';

        $html = new simple_html_dom($content);

        $this->renderStoreBlocks($html);

        if (method_exists($this, 'renderCustomBlocks')) {
            $this->renderCustomBlocks($html);
        }

        if($applyInlineCss)
            $html = self::applyInlineCss($html, $css);

        return[
            'content' => $html->__toString(),
            'css' => $css,
        ];
    }

    private static function applyInlineCss(dom $html, string $css): dom {
        $idRules = [];
        $classRules = [];

        preg_match_all('/#([\w\-]+)\s*\{([^}]+)\}/', $css, $idMatches, PREG_SET_ORDER);
        foreach ($idMatches as $match)
            $idRules[$match[1]] = trim($match[2]);

        preg_match_all('/\.block-[\w\-]+\s*\{([^}]+)\}/', $css, $classMatches, PREG_OFFSET_CAPTURE);
        preg_match_all('/(\.block-[\w\-]+)\s*\{([^}]+)\}/', $css, $classMatches, PREG_SET_ORDER);

        foreach ($classMatches as $match) {
            $className = ltrim($match[1], '.');
            $classRules[$className] = trim($match[2]);
        }

        foreach ($html->find('*[class]') as $node) {
            $classes = explode(' ', $node->class);
            $accumulated = '';

            foreach ($classes as $class) {
                if (isset($classRules[$class])) {
                    $accumulated .= $classRules[$class] . '; ';
                }
            }

            if ($accumulated) {
                $existing = rtrim($node->getAttribute('style') ?? '', '; ');
                $merged = $existing ? "$existing; $accumulated" : $accumulated;
                $node->setAttribute('style', trim($merged, '; '));
            }
        }

        foreach ($html->find('*[id]') as $node) {
            $id = $node->id;
            if (isset($idRules[$id])) {
                $existing = rtrim($node->getAttribute('style') ?? '', '; ');
                $merged = $existing ? "$existing; {$idRules[$id]}" : $idRules[$id];
                $node->setAttribute('style', trim($merged, '; '));

                unset($idRules[$id]);
            }
        }

        return $html;
    }

    private function renderStoreBlocks(simple_html_dom $html): void
    {
        $storeBlocks = $html?->find('*[storeblock]');

        /** @var simple_html_dom_node $block **/
        foreach ($storeBlocks as $block){
            $this->renderStoreBlock($block);
        }
    }

    private function renderStoreBlock(simple_html_dom_node $block): void
    {
        $blockAttributes = [
            'tablename' => $block->hasAttribute('storeblock-tablename') ? $block->getAttribute('storeblock-tablename') : null,
            'identifyby' => $block->hasAttribute('storeblock-identifyby') ? $block->getAttribute('storeblock-identifyby') : 'ID',
            'value' => $block->hasAttribute('storeblock-value') ? $block->getAttribute('storeblock-value') : null,
            'params' => $block->hasAttribute('storeblock-params') ? $block->getAttribute('storeblock-params') : null,
        ];

        if($blockAttributes['tablename'] && $blockAttributes['value']) {
            $query = Doctrine_Query::create();
            $query->from($blockAttributes['tablename']);
            $query->where($blockAttributes['identifyby'] . ' = ?', $blockAttributes['value']);
            $object = $query->fetchOne();
        }else{
            $object = null;
        }

        $items = $block->find('*[storeblock-column]');

        /** @var simple_html_dom_node $item **/
        foreach($items as $item){
            $column = $item->getAttribute('storeblock-column');
            $columnType = $item->hasAttribute('storeblock-column-type') ? $item->getAttribute('storeblock-column-type') : 'default';
            $columnParams = $item->hasAttribute('storeblock-column-params') ? $item->getAttribute('storeblock-column-params') : null;
            $columns = explode('.', $column);


            $value = $object;
            $errorMsg = null;

            $previousColumn = null;
            foreach($columns as $c){
                if($columnType === 'default'){
                    if(!$object){
                        if($blockAttributes['tablename'] && $blockAttributes['value'])
                            $errorMsg = 'ERROR: Entity from ' . $blockAttributes['tablename'] . ' for  idetifyby=' . $blockAttributes['identifyby'] . '  value=' . $blockAttributes['value'] . ' not found';
                        else if($blockAttributes['tablename'])
                            $errorMsg = 'ERROR: Entity from ' . $blockAttributes['tablename'] . ' for  idetifyby=' . $blockAttributes['identifyby'] . '  attribute value is not set';
                        else if($blockAttributes['value'])
                            $errorMsg = 'ERROR: Attribute tablename is not set for  idetifyby=' . $blockAttributes['identifyby'] . '  value=' . $blockAttributes['value'] . ' not found';
                        else
                            $errorMsg = 'ERROR: Attribute tablename is not set for  idetifyby=' . $blockAttributes['identifyby'] . '  attribute value is not set';
                        break;
                    }

                    if($c === 'getLang') {
                        if($this->lang_id && $this->hasLangReference($value))
                            $value = $value->getLang($this->lang_id);
                        else{
                            if(!$this->lang_id){
                                $errorMsg = 'ERROR: lang_id is null';
                                break;
                            }

                            if($previousColumn)
                                $errorMsg = 'ERROR: ' . $previousColumn . ' has no lang reference';
                            else
                                $errorMsg = 'ERROR: ' . $blockAttributes['tablename'] . ' has no lang reference';
                            break;
                        }
                    }else{
                        if(isset($value->{$c}) || $value->getTable()->hasRelation($c)){
                            $value = $value->{$c};
                        }else{
                            if(!$value->getTable()->hasRelation($c)) {
                                if($previousColumn)
                                    $errorMsg = 'ERROR: ' . $previousColumn . ' has no relation ' . $c;
                                else
                                    $errorMsg = 'ERROR: ' . $blockAttributes['tablename'] . ' has no relation ' . $c;
                            }else if(!isset($value->{$c})) {
                                if($previousColumn)
                                    $errorMsg = 'ERROR: ' . $previousColumn . ' has no column ' . $c;
                                else
                                    $errorMsg = 'ERROR: ' . $blockAttributes['tablename'] . ' has no column ' . $c;
                            }
                            break;
                        }
                    }
                }else{
                    if(isset($this->formatFunctions[$columnType]) && !is_null($this->formatFunctions[$columnType])){
                        try{
                            $value = call_user_func($this->formatFunctions[$columnType], $value, $c, $blockAttributes, $columnParams);
                        }catch (Exception $e){
                            $errorMsg = $e->getMessage();
                        }
                    }else{
                        $errorMsg = 'ERROR: format function for column-type=' . $columnType . ' is not set';
                    }
                    break;
                }

                $previousColumn = $c;
            }

            if(isset($item->nodes[0]))
                $node = $item->nodes[0];
            else{
                $node = $item;
            }

            if ($item->nodeName() === 'img'){
                if(is_null($errorMsg))
                    $item->setAttribute('src', $value);
            }else if($item->nodeName() === 'a'){
                if(is_null($errorMsg))
                    $item->setAttribute('href', $value);
            }else{
                if(!$this->_debug && is_null($errorMsg)) {
                    $node->_[HDOM_INFO_TEXT] = $value;
                }else if($this->_debug){
                    if(is_null($errorMsg))
                        $node->_[HDOM_INFO_TEXT] = $value;
                    else
                        $node->_[HDOM_INFO_TEXT] = $errorMsg;
                }
            }


            if(!is_null($errorMsg)){
                $item->setAttribute('storeblock-error', $errorMsg);
            }

            if(!$this->_debug && $this->_clearAttributes){
                $item->removeAttribute('storeblock-column');
                $item->removeAttribute('storeblock-column-type');
                $item->removeAttribute('storeblock-column-params');
            }
        }

        if(!$this->_debug && $this->_clearAttributes) {
            $block->removeAttribute('storeblock-tablename');
            $block->removeAttribute('storeblock-identifyby');
            $block->removeAttribute('storeblock-value');
            $block->removeAttribute('storeblock');
            $block->removeAttribute('storeblock-params');
        }
    }

    /**
     * Kontrola jestli má entita referenci na lang
     *
     * @param Object $object kontrolovaná entita
     *
     * @return bool
     */
    private function hasLangReference(Object $object): bool
    {
        $pendings = $object->getTable()->getRelationParser()->getPendingRelations();
        $reference = array_filter(array_keys($pendings), function ($item) {
            if (str_contains($item, 'Langs'))
                return $item;
            else
                return null;
        });
        if ($reference == null) {
            $pendings = $object->getTable()->getRelationParser()->getRelations();
            $reference = array_filter(array_keys($pendings), function ($item) {
                if (str_contains($item, 'Langs'))
                    return $item;
                else
                    return null;
            });
        }

        return (bool)$reference;
    }

    public function isDebug(): bool
    {
        return $this->_debug;
    }

    public function isClearAttributes(): bool
    {
        return $this->_clearAttributes;
    }

    public function getFormatFunctions(): array
    {
        return $this->formatFunctions;
    }

}