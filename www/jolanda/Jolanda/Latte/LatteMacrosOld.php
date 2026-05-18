<?php

namespace Jolanda\Latte;

use Latte\Compiler;
use Latte\MacroNode;
use Latte\Macros\MacroSet;
use Latte\PhpWriter;

/**
 * Class LatteMacros
 * @package Jolanda
 */
class LatteMacrosOld extends MacroSet {

    /**
     * @param Compiler $compiler
     */
    public static function install(Compiler $compiler): void {
        $set = new static($compiler);
        $set->addMacro("lang", [$set, 'lang']);
        $set->addMacro("jlang", [$set, 'jlang']);
        $set->addMacro("dialog", [$set, 'dialogBegin'], [$set, 'dialogEnd']);
        $set->addMacro('href', array($set, 'href'), array($set, 'hrefEnd'), array($set, 'hrefAttr'));
    }

    /**
     * @param MacroNode $node
     * @param PhpWriter $writer
     *
     * @return string
     */
    public function jlang(MacroNode $node, PhpWriter $writer): string {
        $param = strtoupper($node->args);

        return "echo Jolanda\\Translations\\Lang::getInstance()->translate($param)";
    }

    /**
     * @param MacroNode $node
     * @param PhpWriter $writer
     *
     * @return string
     */
    public function dialogBegin(MacroNode $node, PhpWriter $writer): string {
        return $writer->write(' echo \'
            <div class="modal fade " id="\'.%node.word.\'" tabindex="-1" role="dialog" aria-labelledby="dialogLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="dialogLabel">\'.%node.array[0].\'</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="ci ci-times"></i></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            \'');
    }

    /**
     * @param MacroNode $node
     * @param PhpWriter $writer
     *
     * @return string
     */
    public function dialogEnd(MacroNode $node, PhpWriter $writer): string {
        return $writer->write(' echo \'
        </div>\'.(!isset(%node.array[2])?\'\':\'\').\'
                    </div>
                </div>
            </div>    
        \' ');
    }

    public function hrefAttr(MacroNode $node, PhpWriter $writer) {
        $param = $node->args;

        $request = \Zend_Controller_Front::getInstance()->getRequest();
        $url = '';
        $parts = explode(' ', $param);

        if ($parts[0] == 'this') {
                $url .= $request->getParam('module') . '/' . $request->getParam('controller') . '/' . $request->getParam('action');
        } else {
            $modules = explode(":", $parts[0]);

            if (in_array($modules[0], ['default', 'admin', 'user', 'common'])) {
                $module = array_shift($modules);
                $url .= $module.'/';
            } else
                $url .= $request->getParam('module').'/';

            if (count($modules) > 0) {
                $controller = array_shift($modules);
                $url .= $controller.'/';
            } else
                $url .= 'index/index';

            if (count($modules) > 0) {
                $action = array_shift($modules);
                $url .= $action;
            } else
                $url .= 'index';
        }
        if (isset($parts[1])) {
            $args = explode(",", $parts[1]);
            foreach ($args as $arg) {
                $arg = explode('=', $arg);
                $url .= '/'.$arg[0].'/'.$arg[1];
            }
        }

        return 'echo " href=\'" . _bu() . "' . '/' . $url . '\'"';
    }

}