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

final class JsVarNode extends StatementNode
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
        $node->modifier->escape = true;

        return $node;
    }

    public function print(PrintContext $context): string
    {
        return $context->format(
            <<<'XX'
                $ʟ_tmp = %node;              
                if(isset($ʟ_tmp["print"]) && $ʟ_tmp["print"]){
                    echo %modify(%node) %line;
                }                               
                if(isset($ʟ_tmp["var"])){
                    echo "<script>var ".$ʟ_tmp["var"]."; $(() => {".$ʟ_tmp["var"]." = " . %node . ";})</script>" %line;
                }                               
            XX,
            $this->args,
            $this->modifier,
            $this->subject,
            $this->position,
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