<?php

namespace Jolanda\ErrorHandler;

use Jolanda\Latte\Latte;

class ErrorHandler {
    public static function renderVueErrorHTML(array $vueError, ?string $user = null): string {
        $latte = Latte::getInstance()->getEngine();
        return $latte->renderToString(__DIR__ . '/vue-error.latte', [
            'error' => $vueError,
            'user' => $user,
        ]);
    }
}