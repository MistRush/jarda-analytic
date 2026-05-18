<?php
use Admin_Model_SearchLog as SearchLog;
use common\logic\Search\Search as Search;

class SearchController extends BaseController {

    /**
     * @throws Exception
     */
    public function indexAction() {
        $searchTerm = trim($this->getRequest()->getParam('SearchTerm'));
        if (!$searchTerm) {
            $this->forward('not-found', 'error', 'default');
            return;
        }
        SearchLog::createSearchLog($searchTerm);

        $search = new Search($searchTerm);
        $this->renderLatte($search->renderProperSearchResults());
    }

    /**
     * @throws Exception
     */
    public function quickAction() {
        $searchTerm = trim($this->getRequest()->getParam('searchTerm'));
        $search = new Search($searchTerm);

        $this->renderLatte($search->renderProperQuickSearchResults());
    }
}