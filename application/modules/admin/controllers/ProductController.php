<?php
use Admin_Model_Category as Category;
use Admin_Model_Product as Product;
use Admin_Model_ProductLang as ProductLang;
use Admin_Model_ProductInCategory as ProductInCategory;
use Admin_Model_ProductParameter as ProductParameter;
use Admin_Model_ProductSimiliar as ProductSimiliar;

class Admin_ProductController extends Admin_Controller_Action {

    public function productAction() {
        $this->renderVue();
    }

    public function editProductAction() {
        $this->renderVue([], false);
    }

    public function categoryAction() {
        $this->renderVue();
    }

    public function editCategoryAction() {
        $this->renderVue([], false);
    }

    public function loadCategoryTreeAction() {
        echo json_encode(Category::formatCategoryTree());
    }

    public function copyProductAction() {
        $productID = $this->getRequest()->getParam('Product_ID');
        $productOld = Product::getProductForCopy($productID);

        if ( $productOld ) {
            $product = new Product();
            $product->Manufacturer_ID = $productOld->Manufacturer_ID;
            $product->Video = $productOld->Video;
            $product->OnStock = $productOld->OnStock;
            $product->Code = $productOld->Code;
            $product->Weight = $productOld->Weight;
            $product->Manufacturer_ID = $productOld->Manufacturer_ID;
            $product->save();

            foreach ( $productOld->productLangs as $productLangOld ) {
                $productLang = new ProductLang();
                $productLang->Product_ID = $product->ID;
                $productLang->Language_ID = $productLangOld->Language_ID;
                $productLang->Name = $productLangOld->Name;
                $productLang->Description = $productLangOld->Description;
                $productLang->ShortDescription = $productLangOld->ShortDescription;
                $productLang->Title = $productLangOld->Title;
                $productLang->MetaDescription = $productLangOld->MetaDescription;
                $productLang->MetaKeywords = $productLangOld->MetaKeywords;
                $productLang->save();
            }

            foreach ( $productOld->categories as $categoryOld ) {
                $productInCategory = new ProductInCategory();
                $productInCategory->Product_ID = $product->ID;
                $productInCategory->Category_ID = $categoryOld->Category_ID;
                $productInCategory->save();
            }

            foreach ( $productOld->parameters as $parameterOld ) {
                $productParameter = new ProductParameter();
                $productParameter->Product_ID = $product->ID;
                $productParameter->Parameter_ID = $parameterOld->Parameter_ID;
                $productParameter->ParameterValue_ID = $parameterOld->ParameterValue_ID;
                $productParameter->save();
            }

            foreach ( $productOld->productSimiliars as $similiarOld ) {
                $productSimiliar = new ProductSimiliar();
                $productSimiliar->Product_ID = $product->ID;
                $productSimiliar->ProductSimiliar_ID = $similiarOld->ProductSimiliar_ID;
                $productSimiliar->save();
            }
        }
    }
}