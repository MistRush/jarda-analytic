<?php
namespace Jolanda\Latte\ParamsTemplate;

use PhpParser\Error;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitorAbstract;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;
use ReflectionClass;
use ReflectionException;
use ReflectionUnionType;

// Vlastní visitor pro získání informací o typech
class TypeAnalysisVisitor extends NodeVisitorAbstract
{

    public $variableTypes = [];
    public $importedClasses = [];

    public string $class = '';

    private $classUses = [];

    public function enterNode(Node $node)
    {
        $this->processEnterNode($node);
    }

    //TODO vracet array
    private function processAssignNode($node)
    {
        try{
            if($node instanceof Node\Expr\ArrayItem){
                $variableName = $node->key->value;

                if($variableName instanceof  Node\Identifier) {
                    return;
                }
            }
            else if($node->var instanceof Node\Expr\ArrayDimFetch){
                //TODO $category_prize[0]['PrizeRepair'] = asdf...;
                if(!isset($node->var->var->name)){
                    return;
                }
                $variableName = $node->var->var->name;

                //TODO $this->yxcyx['asd'] = xyc..;
                if($variableName instanceof  Node\Identifier) {
                    return;
                }

                $this->addVariableTypes($variableName, ['array']);
                return;
            }else{
                $variableName = $node->var->name;

                if($variableName instanceof  Node\Identifier) {
                    return;
                }
            }
        }catch (\Exception $e) {
            return;
        }

        $returnTypes = $this->processNode($node);
        $this->addVariableTypes($variableName, $returnTypes);
    }

    private function processNode($node): array
    {
        $returnTypes = [];

        try {
            // Získání názvu třídy a metody
            if($node instanceof Node\Expr\ArrayItem){
                $exprNode = $node->value;
            }else{
                if(!isset($node->expr)){
                    $exprNode = $node;
                }else{
                    $exprNode = $node->expr;
                }

            }

            if ($exprNode instanceof Node\Expr\StaticCall) {
                $classNameNode = $exprNode->class;
                $methodName = $exprNode->name;

                // Získání názvu třídy z příkazu use
                if ($classNameNode instanceof Node\Name) {
                    $classNameAlias = $classNameNode->getLast();
                    $className = $this->importedClasses[$classNameAlias] ?? $classNameNode->toString();
                } else {
                    $className = $this->resolveClassName($classNameNode);
                }

                if($className === 'unknown'){
                    $returnTypes[] = 'unknown';
                    return $returnTypes;
                }

                // Získání typu návratové hodnoty
                $returnTypes = $this->getReturnType($className, $methodName);

                return $returnTypes;
            } elseif ($exprNode instanceof Node\Expr\MethodCall || $exprNode instanceof Node\Expr\NullsafeMethodCall) {
                $methodName = $exprNode->name;
                if($methodName instanceof Node\Identifier){
                    $methodName = $methodName->name;
                }

                $methodVarName = $exprNode->var->name;

                if($exprNode instanceof Node\Expr\NullsafeMethodCall){
                    $returnTypes[] = 'null';
                }

                if($methodVarName instanceof Node\Identifier){
                    if($exprNode instanceof Node\Expr\MethodCall || $exprNode instanceof Node\Expr\NullsafeMethodCall){
                        $returnTypes = array_merge($returnTypes, $this->processMethodCallOrPropertyChain($exprNode));

                        return $returnTypes;
                    }else{
                        $returnTypes[] = 'unknown';
                        return $returnTypes;
                    }
                }

                if($methodVarName === 'this'){
                    $methodVarName = $this->class;

                    $returnTypes = array_merge($returnTypes, $this->getReturnType($methodVarName, $methodName));

                    return $returnTypes;
                }else{
                    if(!isset($this->variableTypes[$methodVarName])){
                        $returnTypes[] = 'unknown';
                        return $returnTypes;
                    }

                    foreach ($this->variableTypes[$methodVarName] as $variableType){
                        $returnTypes = array_merge($returnTypes, $this->getReturnType($variableType, $methodName));

                        return $returnTypes;
                    }
                }
            }
            elseif ($exprNode instanceof Node\Expr\Variable) {
                $assignedVariable = $exprNode->name;

                // Získání typů proměnné, ke které se přiřazuje
                if (isset($this->variableTypes[$assignedVariable])) {
                    $assignedVariableTypes = $this->variableTypes[$assignedVariable];
                    $returnTypes = $assignedVariableTypes;
                    return $returnTypes;
                }
            }
            // Přiřazení hodnoty null
            elseif ($exprNode instanceof Node\Expr\ConstFetch && $exprNode->name->toLowerString() === 'null') {
                $returnTypes[] = 'null';
                return $returnTypes;
            }
            // Přiřazení hodnoty boolean
            elseif ($exprNode instanceof Node\Expr\ConstFetch
                && ($exprNode->name->toLowerString() === 'true' || $exprNode->name->toLowerString() === 'false')
            ) {
                $returnTypes[] = 'bool';
                return $returnTypes;
            }
            // Přiřazení hodnoty string
            elseif ($exprNode instanceof Node\Scalar\String_) {
                $returnTypes[] = 'string';
                return $returnTypes;
            }
            // Přiřazení hodnoty integer nebo float
            elseif ($exprNode instanceof Node\Scalar\LNumber || $exprNode instanceof Node\Scalar\DNumber) {
                $returnTypes[] = 'int';
                $returnTypes[] = 'float';

                return $returnTypes;
            }
            // Přiřazení hodnoty array
            elseif ($exprNode instanceof Node\Expr\Array_) {
                $returnTypes[] = 'array';

                if(!$exprNode->items){
                    return $returnTypes;
                }

                foreach ($exprNode->items as $item){
                    if(!$item instanceof Node\Expr\ArrayItem){
                        continue;
                    }

                    $returnTypes['arrayItems'][$item->key->value] = $this->processNode($item);
                }

                return $returnTypes;
            }
            // Přiřazení hodnoty new
            elseif ($exprNode instanceof Node\Expr\New_) {
                if($node->var instanceof Node\Expr\Variable){
                    $variableName = $node->var->name;
                } else {
                    // Pro složitější případy, kde nemusí být proměnná přímo dostupná
                    // zde by bylo třeba implementovat další logiku
                    return $returnTypes;
                }

                // Získání názvu třídy
                $classNameNode = $exprNode->class;
                if ($classNameNode instanceof Node\Name) {
                    $classNameAlias = $classNameNode->getLast();
                    $className = $this->importedClasses[$classNameAlias] ?? $classNameNode->toString();
                } else {
                    $className = $this->resolveClassName($classNameNode);
                }

                if($className === 'unknown'){
                    $returnTypes[] = 'unknown';
                    return $returnTypes;
                } else {
                    $returnTypes[] = $className;
                    return $returnTypes;
                }
            }
            // Přiřazení hodnoty property
            elseif ($exprNode instanceof Node\Expr\PropertyFetch || $exprNode instanceof Node\Expr\NullsafePropertyFetch) {
                $methodVarName = $exprNode->var->name;
                $propertyName = $exprNode->name->name;

                if($propertyName instanceof Node\Identifier){
                    $propertyName = $propertyName->name;
                }

                if($exprNode instanceof Node\Expr\NullsafePropertyFetch){
                    $returnTypes[] = 'null';
                }

                if($methodVarName instanceof Node\Identifier){
                    if($exprNode instanceof Node\Expr\PropertyFetch || $exprNode instanceof Node\Expr\NullsafePropertyFetch){
                        $returnTypes = $this->processMethodCallOrPropertyChain($exprNode);

                        return $returnTypes;
                    }else{
                        $returnTypes[] = 'unknown';
                        return $returnTypes;
                    }
                }

                if($methodVarName === 'this'){
                    $methodVarName = $this->class;

                    $returnTypes = $this->getPropertyReturnType($methodVarName, $propertyName);

                    return $returnTypes;
                }else{
                    if(!isset($this->variableTypes[$methodVarName])){
                        $returnTypes[] = 'unknown';
                        return $returnTypes;
                    }

                    foreach ($this->variableTypes[$methodVarName] as $variableType){
                        $returnTypes = array_merge($returnTypes, $this->getPropertyReturnType($variableType, $propertyName));

                        return $returnTypes;
                    }
                }
            } // Přiřazení hodnoty ternárního operátoru
            elseif ($exprNode instanceof Node\Expr\Ternary){
                $ifNode = $exprNode->if;
                $elseNode = $exprNode->else;

                if($ifNode instanceof Node){
                    $returnTypes = array_merge($returnTypes, $this->processNode($ifNode));
                }

                if($elseNode instanceof Node){
                    $returnTypes = array_merge($returnTypes, $this->processNode($elseNode));
                }

                return $returnTypes;
            }
        }catch (\Exception $e) {
        }


        return $returnTypes;
    }

    private function processEnterNode(Node $node)
    {
        if($node instanceof \PhpParser\Node\Stmt\Class_){
            $this->class = $node->name->name;
        }

        // Zpracování příkazu use
        if ($node instanceof Node\Stmt\Use_) {
            foreach ($node->uses as $use) {
                if($use->alias){
                    $alias = $use->alias->name;
                }else{
                    $tmp = explode('\\', $use->name->toString());
                    $alias = end($tmp);
                }
                $this->importedClasses[$alias] = $use->name->toString();
            }
        }

        // Kontrola přiřazení hodnoty od funkce Test::create() nebo TestA::create()
        if ($node instanceof Node\Expr\Assign) {
            $this->processAssignNode($node);
        }
    }

    private function resolveClassName($classNameNode)
    {
        if ($classNameNode instanceof Node\Name) {
            // Přímý název třídy
            return $classNameNode->toString();
        } elseif ($classNameNode instanceof Node\Expr\ClassConstFetch) {
            // Název třídy z konstanty
            return $classNameNode->class->toString() . '::' . $classNameNode->name;
        } elseif ($classNameNode instanceof Node\Expr\Variable) {
            // Název třídy z proměnné (pouze zjednodušený přístup)
            return $classNameNode->name;
        } elseif ($classNameNode instanceof Node\Expr) {
            // Nějaký jiný typ, můžete upravit podle potřeby
            return $classNameNode->getAttribute('resolvedName') ?? "unknown";
        }

        return "unknown";
    }

    private function getReturnType($className, $methodName)
    {
        if(in_array($className, $this->getBaseTypes())){
            return [];
        }

        $commentReturnTypes = [];

        // Příklad: Detekce návratového typu pomocí reflection
        try {
            if ($className === 'self' || $className === 'static') {
                $className = $this->class;
            }


            $reflectionClass = new ReflectionClass($className);
            $reflectionMethod = $reflectionClass->getMethod($methodName);

            $comment = $reflectionMethod->getDocComment();
            if($comment){
                $commentReturnTypes = $this->getReturnTypeFromComment($comment, $reflectionMethod->getFileName());

                foreach ($commentReturnTypes as &$t){
                    if($t === 'self' || $t === 'static'){
                        $t = $className;
                    }
                }
            }

            $result = [];
            $result = array_merge($result, $commentReturnTypes);

            if ($reflectionMethod->getReturnType() instanceof ReflectionUnionType) {
                foreach ($reflectionMethod->getReturnType()->getTypes() as $t) {
                    $type =  $t->getName();

                    if($type === 'self' || $type === 'static') {
                        $type = $className;
                    }

                    if(!in_array($type, $result)){
                        $result[] = $type;
                    }
                }

                return $result;
            } else {
                if($reflectionMethod->getReturnType()){
                    $type = $reflectionMethod->getReturnType()->getName();

                    if($type === 'self' || $type === 'static'){
                        $type = $className;
                    }

                    if(!in_array($type, $result)){
                        $result[] = $type;
                    }

                    if($reflectionMethod->getReturnType()->allowsNull()){
                        if(!in_array('null', $result)){
                            $result[] = 'null';
                        }
                    }
                }else{
                    $result[] = "unknown";
                }

                return $result;
            }
        } catch (ReflectionException $e) {
//            tdmp($e->getMessage());
            return ["unknown"];
        }
    }

    private function getPropertyReturnType($className, $propertyName)
    {
        if(in_array($className, $this->getBaseTypes())){
            return [];
        }

        // Příklad: Detekce návratového typu pomocí reflection
        try {
            $reflectionClass = new ReflectionClass($className);
            $reflectionProperty = $reflectionClass->getProperty($propertyName);

            $result = [];
            if ($reflectionProperty->getType() instanceof ReflectionUnionType) {
                foreach ($reflectionProperty->getType()->getTypes() as $t) {
                    $type =  $t->getName();

                    $result[] = $type;
                }

                return $result;
            } else {
                if($reflectionProperty->getType()){
                    $result[] = $reflectionProperty->getType()->getName();

                    if($reflectionProperty->getType()->allowsNull()){
                        if(!in_array('null', $result)){
                            $result[] = 'null';
                        }
                    }
                }else{
                    $result[] = "unknown";
                }

                return $result;
            }
        } catch (ReflectionException $e) {
//            tdmp($e->getMessage());
            return ["unknown"];
        }
    }

    private function addVariableTypes($variableName, array $types){
        if(!isset($this->variableTypes[$variableName])){
            $this->variableTypes[$variableName] = [];
        }

        $this->addVariableType($this->variableTypes[$variableName], $types);
    }

    private function addVariableType(array &$var, array $types){
        foreach ($types as $key => $t){
            if($key === 'arrayItems'){
                if(!isset($var['arrayItems'])){
                    $var['arrayItems'] = [];
                }

                foreach ($t as $arrayItemKey => $arrayItemTypes){
                    if(!isset($var['arrayItems'][$arrayItemKey])){
                        $var['arrayItems'][$arrayItemKey] = [];
                    }

                    if(array_key_exists('arrayItems', $arrayItemTypes)){
                        $this->addVariableType($var['arrayItems'][$arrayItemKey], $arrayItemTypes);
                    }else{
                        foreach ($arrayItemTypes as $arrayItemType){
                            if(!in_array($arrayItemType, $var['arrayItems'][$arrayItemKey])){
                                $var['arrayItems'][$arrayItemKey][] = $arrayItemType;
                            }
                        }
                    }
                }
            }else{
                if(!in_array($t, $var)){
                    $var[] = $t;
                }
            }
        }
    }

    private function processMethodCallOrPropertyChain(Node\Expr\MethodCall|Node\Expr\NullsafeMethodCall|Node\Expr\PropertyFetch|Node\Expr\NullsafePropertyFetch $lastNode){
        $tree = [];
        $methodVarName = null;
        $nullSafe = false;

        $this->getMethodCallOrPropertyChainTree($lastNode, $tree, $methodVarName, $nullSafe);

        if(!count($tree) || !$methodVarName){
            return [];
        }

        $tmpTree = $tree;

        $firstNode = $tree[0];

        //TODO xyz::static->method()
        if(!is_string($methodVarName)){
            return [];
            tdmp($methodVarName);
            die;
        }


        if(!isset($this->variableTypes[$methodVarName])){
            return [];
        }

        $firstNodeTypes = [];
        foreach ($this->variableTypes[$methodVarName] as $variableType){
            if($firstNode instanceof Node\Expr\NullsafeMethodCall || $firstNode instanceof Node\Expr\MethodCall){
                $returnType = $this->getReturnType($variableType, $firstNode->name->name);
            }elseif ($firstNode instanceof Node\Expr\PropertyFetch || $firstNode instanceof Node\Expr\NullsafePropertyFetch){
                $returnType = $this->getPropertyReturnType($variableType, $firstNode->name->name);
            }


            if(is_string($returnType)){
                $returnType = [$returnType];
            }

            foreach ($returnType as $type){
                if(!in_array($type, $firstNodeTypes)){
                    $firstNodeTypes[] = $type;
                }
            }
        }

        unset($tmpTree[0]);

        if(!count($tmpTree)){
            return $firstNodeTypes;
        }

        $lastNodeTypes = $firstNodeTypes;
        foreach ($tmpTree as $node){
            $tmpReturnTypes = [];
            foreach ($lastNodeTypes as $lType){
                if($node instanceof Node\Expr\NullsafeMethodCall || $node instanceof Node\Expr\MethodCall){
                    $returnType = $this->getReturnType($lType, $node->name->name);
                }elseif ($node instanceof Node\Expr\PropertyFetch || $node instanceof Node\Expr\NullsafePropertyFetch){
                    $returnType = $this->getPropertyReturnType($lType, $node->name->name);
                }

                if(is_string($returnType)){
                    $returnType = [$returnType];
                }

                foreach ($returnType as $type){
                    if(!in_array($type, $tmpReturnTypes)){
                        $tmpReturnTypes[] = $type;
                    }
                }
            }

            $lastNodeTypes = $tmpReturnTypes;
        }

        if($nullSafe){
            if(!in_array('null', $lastNodeTypes)){
                $lastNodeTypes[] = 'null';
            }
        }

        return $lastNodeTypes;
    }

    private function getMethodCallOrPropertyChainTree(Node\Expr\MethodCall|Node\Expr\NullsafeMethodCall|Node\Expr\PropertyFetch|Node\Expr\NullsafePropertyFetch $node, array &$tree, &$varName = null, bool &$nullSafe = false){
        if($node->var instanceof Node\Expr\MethodCall || $node->var instanceof Node\Expr\NullsafeMethodCall || $node->var instanceof Node\Expr\PropertyFetch || $node->var instanceof Node\Expr\NullsafePropertyFetch){
            if($node instanceof Node\Expr\NullsafeMethodCall || $node instanceof Node\Expr\NullsafePropertyFetch){
                $nullSafe = true;
            }

            $this->getMethodCallOrPropertyChainTree($node->var, $tree, $varName, $nullSafe);
        }else{
            $varName = $node->var->name;
        }

        $tree[] = $node;
    }

    private function getReturnTypeFromComment($comment, $filePath){
        $pattern = '/@return\s+([^\s]+)/';
        preg_match($pattern, $comment, $matches);

        $returnType = $matches[1] ?? null;

        if(!$returnType){
            return [];
        }

        $returnTypes = explode('|', $returnType);

        foreach ($returnTypes as &$type){
            $type = trim($type);
            if(str_starts_with($type, '\\')){
                $type = substr($type, 1);
            }
        }

        if(!array_key_exists($filePath, $this->classUses)){
            $classUses = $this->loadUsesFromFile($filePath);
            $this->classUses[$filePath] = $classUses;
        }else{
            $classUses = $this->classUses[$filePath];
        }

        if($classUses){
            foreach ($classUses as $use){
                foreach ($returnTypes as &$type){
                    if($use['alias'] === $type){
                        $type = $use['source'];
                    }
                }

            }
        }

        return $returnTypes;
    }

    private function loadUsesFromFile($filePath){
        $source = file_get_contents($filePath);

        $pattern = '/^\s*use\s+[a-zA-Z0-9\\\\_]+(\s+as\s+[a-zA-Z0-9_]+)?;/m';

        preg_match_all($pattern, $source, $matches);

        $uses = array_map('trim', $matches[0]);

        $parsedUses = [];

        foreach ($uses as $use) {
            $pattern = '/^use\s+([a-zA-Z0-9\\\\_]+)(\s+as\s+([a-zA-Z0-9_]+))?;$/';
            if (preg_match($pattern, $use, $matches)) {
                $source = $matches[1];
                $alias = $matches[3] ?? $source;
                $parsedUses[$source] = ['source' => $source, 'alias' => $alias];
            }
        }

        return $parsedUses;
    }

    public function getBaseTypes(){
        return [
            'int',
            'float',
            'string',
            'bool',
            'array',
            'null',
            'unknown',
        ];
    }

    public function getVariableTypes(){
        return $this->variableTypes;
    }

}