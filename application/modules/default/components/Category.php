<?php
namespace default\components;

use common\logic\Eshop\Eshop;
use common\logic\Latte\LatteEngine;

class Category {

    const FOLDER = __DIR__ . '/../../default/views/latte/components/category/';

    /**
     * @param $currentCategory
     * @param $filterParams
     * @param string $currentUrl
     * @return string
     */
    public static function filter($currentCategory, $filterParams, string $currentUrl, array $products): string {
        $eshop = Eshop::getInstance()->getEshop();

        $query = \Doctrine_Query::create();
        $query->select('object.*, parameterValues.*, productParameters.ID, parameterLangs.Name as ParameterName');
        $query->from('Admin_Model_Parameter object');
        $query->where('object.ToFilter = 1');
        $query->leftJoin('object.parameterValues parameterValues');
        $query->leftJoin('parameterValues.productParameters productParameters');
        $query->leftJoin('productParameters.product product');
        $query->leftJoin('product.categories categories');
        $query->leftJoin('product.productEshops productEshops WITH productEshops.Eshop_ID = ?', $eshop->ID);
        $query->leftJoin('object.parameterLangs parameterLangs WITH parameterLangs.Language_ID = ?', $eshop->Language_ID);
        $query->andWhere('productEshops.Active = ?', true);
        $query->andWhereIn('categories.Category_ID', explode(',', $currentCategory['CategoryIDs']));
        $query->orderBy('parameterValues.Value ASC');
        $query->orderBy('object.ID DESC');
        $parameters = $query->execute(null, \Doctrine_Core::HYDRATE_ARRAY);

        $parameterCounter = [];
        $parameterIDs = [];
        $activeParameterIDs = [];

        // zpracovani parametru a jejich URL
        foreach ($parameters as &$parameter) {
            $parameterIDs[] = $parameter['ID'];

            foreach ( $parameter['parameterValues'] as &$parameterValue ) {
                $finalFilters = $filterParams;
                $parameterValue['IsActive'] = isset($finalFilters[$parameter['ID']]) && in_array($parameterValue['ID'], $finalFilters[$parameter['ID']]);

                // pokud je zrovna aktivní, tak ho vyhod, at muze zneaktivnit
                if ( isset($finalFilters[$parameter['ID']]) && in_array($parameterValue['ID'], $finalFilters[$parameter['ID']]) ) {
                    array_remove_reference($finalFilters[$parameter['ID']], $parameterValue['ID']);
                } else {
                    $finalFilters[$parameter['ID']][] = $parameterValue['ID'];
                }

                // poskladej znova url
                $filterLink = '';
                foreach ( $finalFilters as $finalFilter => $values ) {
                    if ( !$values )
                        continue;

                    if ( $filterLink )
                        $filterLink .= '|';

                    $filterLink .= $finalFilter . '-' . implode(',', $values);
                }

                $parameterValue['FilterLink'] = $filterLink ? '?f=' . $filterLink : '';
                $parameterValue['Counter'] = sizeof($parameterValue['productParameters']);
            }
        }

        foreach ( $parameterIDs as $parameterID ) {
            $query = \Doctrine_Query::create();
            $query->from('Admin_Model_ProductParameter object');
            $query->addSelect('object.Parameter_ID, object.Product_ID, object.ParameterValue_ID, object.Value, count(DISTINCT ID) as ProductsCount');
            $query->leftJoin('object.product product');
            $query->leftJoin('product.categories categories');
            $query->leftJoin('product.productEshops productEshops WITH productEshops.Eshop_ID = ?', $eshop->ID);

            foreach ($filterParams as $filterParam => $values ) {
                if ( $filterParam == $parameterID ) {
                    $activeParameterIDs[] = $filterParam;
                    continue;
                }

                $query->leftJoin('product.parameters parameters'.$filterParam.' WITH parameters'.$filterParam.'.Parameter_ID = ' . $filterParam);
                $query->andWhereIn('parameters' . $filterParam . '.ParameterValue_ID ', $values);
            }

            $query->andWhereIn('categories.Category_ID', explode(',', $currentCategory['CategoryIDs']));
            $query->andWhere('object.Parameter_ID = ?', $parameterID);
            $query->andWhere('productEshops.Active = ?', true);
            $query->addGroupBy('object.ParameterValue_ID');
            $productParameters = $query->execute(null, \Doctrine_Core::HYDRATE_ARRAY);

            foreach ($productParameters as $productParameter) {
                $parameterCounter[$productParameter['Parameter_ID']][$productParameter['ParameterValue_ID']] = $productParameter['ProductsCount'];
            }
        }


        $minMaxPrice = self::getMinMaxPriceByCategories($currentCategory['CategoryIDs']);

        return LatteEngine::getInstance()->renderToString(self::FOLDER . '/filter.latte',
            [
                'eshop' => Eshop::getInstance(),
                'parameters' => $parameters,
                'parameterCounter' => $parameterCounter,
                'activeParameterIDs' => $activeParameterIDs,
                'currentUrl' => $currentUrl,
                'maxMinRangeParams' => $minMaxPrice
            ]
        );
    }

    /**
     * @param $currentUrl
     * @param $filterParams
     * @return string
     */
    public static function activeFilter($currentUrl, $filterParams): string {
        if ( !$filterParams )
            return '';

        $eshop = Eshop::getInstance()->getEshop();
        $filterParamValueIDs = [];

        foreach ($filterParams as $filterParam => $values ) {
            foreach ( $values as $value) {
                $filterParamValueIDs[] = $value;
            }
        }

        $query = \Doctrine_Query::create();
        $query->from('Admin_Model_Parameter object');
        $query->select('object.*, parameterValues.*, parameterLangs.Name as ParameterName');
        $query->leftJoin('object.parameterValues parameterValues');
        $query->leftJoin('object.parameterLangs parameterLangs WITH parameterLangs.Language_ID = ?', $eshop->Language_ID);
        $query->whereIn('parameterValues.ID', $filterParamValueIDs);
        $parameters = $query->execute()->toArray();

        // zpracovani parametru a jejich URL
        foreach ($parameters as &$parameter) {
            foreach ( $parameter['parameterValues'] as &$parameterValue ) {
                $finalFilters = $filterParams;

                // pokud je zrovna aktivní, tak ho vyhod, at muze zneaktivnit
                if ( isset($finalFilters[$parameter['ID']]) && in_array($parameterValue['ID'], $finalFilters[$parameter['ID']]) ) {
                    array_remove_reference($finalFilters[$parameter['ID']], $parameterValue['ID']);
                } else {
                    $finalFilters[$parameter['ID']][] = $parameterValue['ID'];
                }

                // poskladej znova url
                $filterLink = '';
                foreach ( $finalFilters as $finalFilter => $values ) {
                    if ( !$values )
                        continue;

                    if ( $filterLink )
                        $filterLink .= '|';

                    $filterLink .= $finalFilter . '-' . implode(',', $values);

                }

                $parameterValue['FilterLink'] = $filterLink ? '?f=' . $filterLink : '';
            }
        }

        return LatteEngine::getInstance()->renderToString(self::FOLDER . '/active-filter.latte',
            [
                'eshop' => Eshop::getInstance(),
                'parameters' => $parameters,
                'currentUrl' => $currentUrl,
            ]
        );
    }

    public static function getMinMaxPriceByCategories(string $CategoryIDs) {
        $query = \Doctrine_Query::create();
        $query->from('Admin_Model_Product object');
        $query->addSelect('MIN(productPriceA.Price) as MinPrice');
        $query->addSelect('MAX(productPriceA.Price) as MaxPrice');
        $query->leftJoin('object.productEshops productPriceA WITH productPriceA.ProductPriceTypeCode = ?','A');
        $query->leftJoin('object.categories categories');
        $query->whereIn('categories.Category_ID', explode(',', $CategoryIDs));
        $query->andWhere('productPriceA.Active = ?', true);
        $result = $query->fetchOne();
        if ($result) {
            return ['MinPrice' => floor($result->MinPrice), 'MaxPrice' => floor($result->MaxPrice + 1)];
        } else {
            return ['MinPrice' =>0, 'MaxPrice' => 0];
        }

    }
}