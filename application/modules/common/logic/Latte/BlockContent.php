<?php
namespace common\logic\Latte;

use Admin_Model_Block as Block;

/**
 * BlockContent 
 */
class BlockContent {

    /** Single instance */
    private static self $instance;

    /**
     * @var array $blocks
     */
    private array $blocks;
    
    /**
     * BlockContent constructor.
     */
    public function __construct() {
        $this->blocks = Block::getBlocks();
    }

    /**
     * @param string $code
     * @return string
     */
    public function getBlockContent(string $code): string{
        if ( $this->blocks[$code] )
            return $this->blocks[$code];
        else
            return '';
    }

    /**
     * Get single instace
     *
     * @return self
     */
    public static function getInstance(): self {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }
}