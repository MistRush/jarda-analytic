<?php

namespace Jolanda\Latte\ParamsTemplate\Tests;

use Admin_Model_Currency as Currency;

class TestClass
{
    public \Admin_Model_OrderRepair $repair;
    public self $selff;

    public function returnBlog(): \Admin_Model_Blog
    {
        return new \Admin_Model_Blog();
    }

    public function returnSelf(): self
    {
        return new self;
    }

    public static function returnCurrencyOrFalse() : Currency|false
    {
        return 'asd';
    }
}