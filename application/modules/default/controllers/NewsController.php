<?php
use Admin_Model_News as News;
use Admin_Model_NewsCategory as NewsCategory;
use common\logic\Eshop\Eshop;
use default\components\Layout as LayoutComponent;

class NewsController extends BaseController {

    public function indexAction() {
        $slug = $this->getRequest()->getParam('slug');

        $category = null;
        if ( $slug )
            $category = NewsCategory::getCategoryBySlug($slug);

        bdump(NewsCategory::getCategories());

        $this->renderLatte([
            'breadcrumb' => LayoutComponent::breadcrumb([
                ['link' => URL::NEWS, 'title' => 'Magazín'],
            ]),
            'news' => News::getActiveNews($category),
            'category' => $category,
            'blogCategories' => NewsCategory::getCategories(),
            'eshop' => Eshop::getInstance(),
            'metaDescription' => translate('Magazín'),
            'metaKeywords' => translate('Magazín'),
            'mainContainer' => false,
        ]);
    }

    public function detailAction() {
        $slug = $this->getRequest()->getParam('slug');

        if ( !$news = News::getNewsBySlug($slug) ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        $relatedNews = News::getRelatedNews($news);

        $this->renderLatte([
            'breadcrumb' => LayoutComponent::breadcrumb([
                ['link' => URL::NEWS, 'title' => translate('Blog')],
                ['link' => URL::NEWS . '/' . $news->slug, 'title' => $news->Headline]
            ]),
            'news' => $news,
            'relatedNews' => $relatedNews,
            'settings' => Eshop::getInstance(),
            'title' => $news->Headline,
            'metaDescription' => $news->Headline,
            'metaKeywords' => $news->Headline,
            'mainContainer' => false,
        ]);
    }
}