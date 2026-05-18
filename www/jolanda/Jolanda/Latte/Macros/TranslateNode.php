<?php

namespace Jolanda\Latte\Macros;

use Jolanda\Translations\Lang;
use Latte\Compiler\Nodes\Php\Expression\ArrayNode;
use Latte\Compiler\Nodes\Php\ModifierNode;
use Latte\Compiler\Nodes\StatementNode;
use Latte\Compiler\PrintContext;
use Latte\Compiler\Nodes\Php\ExpressionNode;
use Latte\Compiler\Tag;

final class TranslateNode extends StatementNode
{
    public $subject;
    public ArrayNode $args;
    public ModifierNode $modifier;
    public static function create(Tag $tag): static
    {

        $node = new self;
        $node->subject = $tag->parser->parseUnquotedStringOrExpression();
        $node->args = $tag->parser->parseArguments();
        $node->modifier = $tag->parser->parseModifier();
        $node->modifier->escape = true;

        return $node;
    }

    public function print(PrintContext $context): string
    {
        return $context->format(
            'echo %modify(translate(%node, %args));',
            $this->modifier,
            $this->subject,
            $this->args,
        );
    }

    public function &getIterator(): \Generator
    {
        yield $this->subject;
        yield $this->args;
        yield $this->modifier;
    }

}