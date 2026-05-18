<?php

namespace Jolanda\Latte;

use Jolanda\Latte\Macros\EditorVarNode;
use Jolanda\Latte\Macros\JsVarNode;
use Jolanda\Latte\Macros\NHrefNode;
use Jolanda\Latte\Macros\DialogNode;
use Jolanda\Latte\Macros\JlangNode;
use Jolanda\Latte\Macros\TranslateNode;
use Jolanda\Latte\Macros\RenderNode;
use Latte\Extension;
use Latte\Runtime\FilterInfo;
use Latte\Compiler\Tag;

class LatteMacros extends Extension
{
    public function getTags(): array
    {
        return [
            'lang' => [JlangNode::class, 'create'],
            '_' => [TranslateNode::class, 'create'],
            'jlang' => [JlangNode::class, 'create'],
            'n:href' => [NHrefNode::class, 'create'],
            'dialog' => [DialogNode::class, 'create'],
            'render' => [RenderNode::class, 'create'],
            'jsVar' => [JsVarNode::class, 'create'],
            'editorVar' => [EditorVarNode::class, 'create'],
        ];
    }
}