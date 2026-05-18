<?php

namespace Jolanda\Latte\ParamsTemplate;

use ReflectionClass;
use ReflectionMethod;

class AnalyseLatteParams
{
    public ?string $className = null;
    public ?string $methodName = null;
    public array $params;

    public function __construct(array $params, $backTraceLvl)
    {
        if(!$backTraceLvl){
            throw new \Exception('Backtrace level is not set.');
        }

        $callerInfo = debug_backtrace()[$backTraceLvl];
        $this->params = $params;

        if (isset($callerInfo['class']) && isset($callerInfo['function'])) {
            $this->className = $callerInfo['class'];
            $this->methodName = $callerInfo['function'];
        } else {
            throw new \Exception('Unable to determine calling class and method.');
        }
    }

    private function getClassDeclaration($code)
    {
        preg_match('/class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w\s,]+))?/', $code, $matches);

        $className = isset($matches[1]) ? $matches[1] : null;
        $extends = isset($matches[2]) ? ' extends ' . $matches[2] : null;
        $implements = isset($matches[3]) ? ' implements ' . $matches[3] : null;

        return $className . $extends . $implements;
    }

    private function getClassCode(ReflectionClass $classReflection)
    {
        $file = $classReflection->getFileName();
        $code = file_get_contents($file);

        return $code;
    }

    private function getUseStatements($code)
    {
        $useStatements = [];
        preg_match_all('/use\s+(.+?);/i', $code, $matches);

        if (isset($matches[1])) {
            foreach ($matches[1] as $useStatement) {
                $useStatements[] = "use $useStatement;";
            }
        }

        return $useStatements;
    }

    private function getMethodCode(ReflectionMethod $method)
    {
        $file = $method->getFileName();
        $startLine = $method->getStartLine();
        $endLine = $method->getEndLine();
        $code = implode('', array_slice(file($file), $startLine - 1, $endLine - $startLine + 1));

        return $code;
    }

    public function analyzeCode()
    {
        try{
            $controllerReflection = new ReflectionClass($this->className);

            // Získání celého kódu třídy
            $classCode = $this->getClassCode($controllerReflection);

            // Získání deklarace třídy
            $classDeclaration = $this->getClassDeclaration($classCode);

            // Získání všech 'use' pro danou třídu
            $useStatements = $this->getUseStatements($classCode);

            // Získání kódu metody
            $method = $controllerReflection->getMethod($this->methodName);
            $methodCode = $this->getMethodCode($method);

            // Přidání deklarace třídy a 'use' bloku před kód metody
            $code = "<?php\n\n" . implode("\n", $useStatements) . "\n\nclass $classDeclaration\n{\n" . $methodCode . "\n}";

            // Provedení analýzy kódu funkce
            $analysis = new TypeAnalysis();
            $types = $analysis->getTypes($code);
        }catch (\Exception $e) {
            $types = [];
        }

        return $types;
    }

    public function getParams()
    {
        return $this->params;
    }
}