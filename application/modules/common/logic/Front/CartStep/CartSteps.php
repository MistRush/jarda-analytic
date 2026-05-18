<?php
namespace common\logic\Front\CartStep;

/**
 * Module constants
 */
class CartSteps {

    /**
     * cartSteps
     *
     * @var array
     */
    private $cartSteps;

    /**
     * currentCartStep
     *
     * @var int
     */
    private $currentCartStep;

    /**
     * CartSteps constructor.
     * @param int $currentCartStep
     */
    public function __construct(int $currentCartStep) {
        $this->setCurrentCartStep($currentCartStep);

        $this->initCartSteps();
    }

    /**
     * init cart steps
     */
    private function initCartSteps() {
        $cartSteps = [];
        $cartSteps[] = new CartStep(1, translate('Nákupní košík'), _bu() . '/cart/');
        $cartSteps[] = new CartStep(2, translate('Informace o Vás'), _bu() . '/order/step-1/');
        $cartSteps[] = new CartStep(3, translate('Doprava a platba'), _bu() . '/order/step-2/');
        $cartSteps[] = new CartStep(4, translate('Objednávka dokončena'));

        $this->setCartSteps($cartSteps);
    }

    /**
     * @return string
     */
    public function render() : string {
        $view = new \Zend_View();
        $view->setScriptPath(APPLICATION_PATH.'/modules/default/views/scripts/cart/');
        $view->cartSteps = $this->getCartSteps();
        $view->currentCartStep = $this->getCurrentCartStep();

        return $view->render('cart-step.phtml');
    }

    /**
     * @return array
     */
    public function getCartSteps(): array {
        return $this->cartSteps;
    }

    /**
     * @param array $cartSteps
     */
    public function setCartSteps(array $cartSteps) {
        $this->cartSteps = $cartSteps;
    }

    /**
     * @return int
     */
    public function getCurrentCartStep(): int {
        return $this->currentCartStep;
    }

    /**
     * @param int $currentCartStep
     */
    public function setCurrentCartStep(int $currentCartStep) {
        $this->currentCartStep = $currentCartStep;
    }
}