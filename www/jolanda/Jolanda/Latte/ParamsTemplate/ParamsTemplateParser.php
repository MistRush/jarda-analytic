<?php

namespace Jolanda\Latte\ParamsTemplate;

use ReflectionClass;
use ReflectionUnionType;

class ParamsTemplateParser
{
    public function __construct()
    {
    }

    public function parse(string $class, bool $fromComment = false)
    {
        if(!class_exists($class)){
            return [];
        }

        try{
            $reflectionClass = new ReflectionClass($class);
            $properties = ($reflectionClass->getProperties());
            $types = [];

            foreach ($properties as $property){
                if($property->class === $class){
                    $result = [];
                    if($fromComment){
                        $comment = $property->getDocComment();
                        if($comment){
                            $result = $this->getReturnTypeFromComment($comment);
                        }
                    }

                    if ($property->getType() instanceof ReflectionUnionType) {
                        foreach ($property->getType()->getTypes() as $t) {
                            $type =  $t->getName();

                            $result[] = $type;
                        }
                    } else {
                        if($property->getType()){
                            $result[] = $property->getType()->getName();

                            if($property->getType()->allowsNull()){
                                if(!in_array('null', $result)){
                                    $result[] = 'null';
                                }
                            }
                        }else{

                        }

                    }
                    $types[$property->getName()] = $result;
                }

            }

            return $types;
        }catch (\Exception $e) {
            return [];
        }


    }

    private function getReturnTypeFromComment($comment){
        $pattern = '/@var\s+([^\s]+)/';
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

        return $returnTypes;
    }

}