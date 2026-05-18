<?php

namespace Jolanda\Latte\Macros;

use Jolanda\Translations\Lang;
use Latte\Compiler\Nodes\Php\Expression\ArrayNode;
use Latte\Compiler\Nodes\Php\ArrayItemNode;
use Latte\Compiler\Nodes\Php\ModifierNode;
use Latte\Compiler\Nodes\StatementNode;
use Latte\Compiler\PrintContext;
use Latte\Compiler\Nodes\Php\ExpressionNode;
use Latte\Compiler\Tag;

final class EditorVarNode extends StatementNode
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
        return $context->format(
            <<<'XX'
                echo "<script>var ".%node."; $(() => {".%node." = " . $editor . ";})</script>" %line;                          
            XX,
            $this->subject,
            $this->subject,
            $this->position
        );
    }

    public function &getIterator(): \Generator
    {
        yield $this->subject;
        yield $this->args;
        yield $this->modifier;
    }

}