<?php

namespace Jolanda\Latte;

use Jolanda\Tracy\Extensions\Extensions;
use Jolanda\Tracy\Extensions\Latte\LatteExtension;
use Latte\Engine;

class Latte {
    /** Single instance */
    private static $instance;

    private $engine;

    private function __construct() {
        $this->engine = new Engine;
        $this->engine->setTempDirectory('../data/cache/latte');

        if(version_compare(\Latte\Engine::VERSION, '3', '<')) {
            LatteMacrosOld::install($this->engine->getCompiler());
            Extensions::initializeLatte($this->engine);

            $this->engine->addFilter('translate', function ($message, ?array $params = null, int|string|null $locale = null) {
                $message = translate($message, $locale, $params);

                if (is_array($params)) {
                    foreach ($params as $key => $value) {
                        $message = str_replace("[$key]", $value, $message);
                    }
                }

                return $message;
            });
        }else{
            $this->engine->addExtension(new LatteMacros());

            if (isDevelopment()) {
                $this->engine->setStrictParsing();
                $this->engine->addExtension(new LatteExtension(''));
            }
        }

    }

    /**
     * @return Engine
     */
    public function getEngine(): Engine {
        return $this->engine;
    }


    public static function getInstance() : Latte {
        if (!isset(self::$instance))
            self::$instance = new Latte();

        return self::$instance;
    }

    public function lint(string $path){
        $linter = new \Latte\Tools\Linter($this->getEngine(), debug: true, strict: true);
        $ok = $linter->scanDirectory($path);
        return $ok ? 0 : 1;
    }
}
