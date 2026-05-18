<?php

namespace Jolanda\Latte\Macros;

use Latte\Compiler\Nodes\Php\Expression\ArrayNode;
use Latte\Compiler\Nodes\StatementNode;
use Latte\Compiler\PrintContext;
use Latte\Compiler\Nodes\Php\ExpressionNode;
use Latte\Compiler\Tag;


final class NHrefNode extends StatementNode
{
    public ExpressionNode $subject;
    public ArrayNode $args;
    public static function create(Tag $tag): static
    {
        $node = new self;
        $node->subject = $tag->parser->parseUnquotedStringOrExpression();
        $node->args = $tag->parser->parseArguments();

        return $node;
    }

    public function print(PrintContext $context): string
    {
        $modules = str_replace("'", '', $context->format('%node',$this->subject));

        $request = \Zend_Controller_Front::getInstance()->getRequest();
        $url = _bu().'/';
        $modules = explode(':', $modules);

        if ($modules[0] == 'this') {
            $url .= $request->getParam('module') . '/' . $request->getParam('controller') . '/' . $request->getParam('action');
        } else {
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

        foreach ($this->args->items as $item){
            $url .= '/'.$item->key->name.'/'.$item->value->print($context);
        }


        $url = str_replace("'", '', $url);

        return 'echo " href=\'' . $url . '\'";';
    }

    public function &getIterator(): \Generator
    {
        yield $this->args;

    }
}