<?php

namespace Jolanda\Latte\Macros;

use Latte\Compiler\Nodes\StatementNode;
use Latte\Compiler\PrintContext;
use Latte\Compiler\Nodes\Php\ExpressionNode;
use Latte\Compiler\Tag;
use Latte\Compiler\Nodes\FragmentNode;

class DialogNode extends StatementNode
{
    public ExpressionNode $args;
    public Tag $tag;
    public bool $capture = false;
    public FragmentNode $content;
    public ExpressionNode $condition;

    public static function create(Tag $tag): \Generator
    {
        $node = new static;

        if (!$tag->parser->isEnd()) {
            $node->args = $tag->parser->parseArguments();
        }

        [$node->content, $nextTag] = yield;
        return $node;
    }

    public function print(PrintContext $context): string
    {
        $params = explode(',', $context->format('%args', $this->args));

        $params[0] = $params[0] ?? '';
        $params[1] = $params[1] ?? '';

        return 'echo \'
            <div class="modal fade " id="\'; echo '.$params[0].'; echo \'" tabindex="-1" role="dialog" aria-labelledby="dialogLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="dialogLabel">\'; echo '.$params[1].'; echo \'</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="ci ci-times"></i></span>
                            </button>
                        </div>
                        <div class="modal-body">\';'.$context->format('%node', $this->content).'
                        echo \'</div>
                    </div>
                </div>
            </div>   
        \';';
    }

    public function &getIterator(): \Generator
    {
        yield $this->content;
    }

}