<?php

namespace Jolanda\Latte\ParamsTemplate;

use Error;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;

class TypeAnalysis
{
    public function __construct()
    {

    }

    public function getTypes($code)
    {
        // Vytvoření parseru
        $parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);

        try {
            // Parsování kódu
            $ast = $parser->parse($code);
        } catch (Error $error) {
            echo "Parse error: {$error->getMessage()}\n";
            exit(1);
        }

        $typeVisitor = new TypeAnalysisVisitor;
        // Vytvoření NameResolveru pro práci s jmenným prostředím
        try{
            $traverser = new NodeTraverser;
            $traverser->addVisitor(new NameResolver);

            // Vytvoření a použití vlastního visitoru

            $traverser->addVisitor($typeVisitor);
            $traversedAst = $traverser->traverse($ast);
        }catch (\Exception $e) {
        }


        return $typeVisitor->getVariableTypes();
    }


}