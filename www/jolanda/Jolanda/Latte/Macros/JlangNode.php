<?php

namespace Jolanda\Latte\Macros;

use Jolanda\Translations\Lang;
use Latte\Compiler\Nodes\Php\Expression\ArrayNode;
use Latte\Compiler\Nodes\Php\ModifierNode;
use Latte\Compiler\Nodes\StatementNode;
use Latte\Compiler\PrintContext;
use Latte\Compiler\Nodes\Php\ExpressionNode;
use Latte\Compiler\Tag;

final class JlangNode extends StatementNode
{
    public ExpressionNode $subject;
    public ArrayNode $args;
    public ModifierNode $modifier;
    public static function create(Tag $tag): static
    {

        $node = new self;
        $node->subject = $tag->parser->parseUnquotedStringOrExpression();
        $node->args = $tag->parser->parseArguments();
        $node->modifier = $tag->parser->parseModifier();
        return $node;
    }

    public function print(PrintContext $context): string
    {
//        $param = $context->format('%args',[$this->subject]);

//        return "echo '\"' . Jolanda\\Translations\\Lang::getInstance()->translate($param) . '\"';";
//        return Lang::getInstance()->translate($param);

        return $context->format(
            'echo %escape(Jolanda\\Translations\\Lang::getInstance()->translate(%node));',
            $this->subject,
            $this->args
        );
    }

    public function &getIterator(): \Generator
    {
        yield $this->subject;
        yield $this->args;
        yield $this->modifier;
    }

}