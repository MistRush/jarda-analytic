<?php
namespace common\logic\Front;

use common\logic\Helper\RangeFilter;
use common\logic\Helper\RangeFilterType;

class ProductList {

    const DEFAULT_OFFSET = 12;

    const MANUFACTURER_OFFSET = 8;

    const GRID_CLASSIC = 'classic';
    const GRID_LINE = 'line';

    const SORTING_ALPHABETICALLY = 'alphabetically';
    const SORTING_CODE = 'code';
    const SORTING_CHEAPEST = 'cheapest';
    const SORTING_EXPENSIVE = 'expensive';

    /**
     * @var string $slug
     */
    private string $slug;

    /**
     * @var int $page
     */
    private int $page;

    /**
     * @var string $grid
     */
    private string $grid;

    /**
     * @var string $sorting
     */
    private string $sorting;

    /**
     * @var array $filter
     */
    private array $filter = [];

    /**
     * @var string|null $filterParams
     */
    private ?string $filterParams;

    /**
     * @var array $rangeFilter
     */
    private array $rangeFilter = [];

    /**
     * @var string|null $rangeFilterParams
     */
    private string|null $rangeFilterParams;

    public function __construct(\Zend_Controller_Request_Abstract $request) {
        $this->slug = $request->getParam('slug');
        $this->page = intval($request->getParam('page')) ? $request->getParam('page') : 1;

        $this->grid = !isset($_COOKIE['grid']) ? self::GRID_CLASSIC : $_COOKIE['grid'];
        $this->sorting = !isset($_COOKIE['sorting']) ? self::SORTING_ALPHABETICALLY : $_COOKIE['sorting'];

        $this->filter = $this->computeFilters($request->getParam('f'));
        $this->filterParams = $request->getParam('f');
        $this->rangeFilter = $this->computeRangeFilters([
            RangeFilter::handleParams('PriceFrom', 'PriceTo', RangeFilterType::Price),
        ]);
        $this->rangeFilterParams = self::buildRangeFilterParams($this->rangeFilter);
    }

    /**
     * @return string[]
     */
    public static function getGrids(): array {
        return [
            self::GRID_CLASSIC => 'Klasický výpis',
            self::GRID_LINE => 'Řádkový výpis',
        ];
    }

    /**
     * @return string[]
     */
    public static function getSortings(): array {
        return [
            self::SORTING_ALPHABETICALLY => 'Abecedně',
            //self::SORTING_CODE => 'Podle kódu',
            self::SORTING_CHEAPEST => 'Od nejlevnějšího',
            self::SORTING_EXPENSIVE => 'Od nejdražšího',
        ];
    }

    /**
     * @param string $sorting
     * @return string
     */
    public static function getColumnBySorting(string $sorting): string {
        return match ($sorting) {
            self::SORTING_ALPHABETICALLY => 'productLangs.Name ASC',
            self::SORTING_CODE => 'Code ASC',
            self::SORTING_CHEAPEST => 'productEshops.Price ASC',
            self::SORTING_EXPENSIVE => 'productEshops.Price DESC',
            default => 'productLangs.Name DESC'
        };
    }

    /**
     * @param string|null $filters
     * @return array
     */
    private function computeFilters(?string $filters) : array {
        $filtersResult = [];
        if ( $filters ) {
            foreach (explode('|', $filters) as $paramsGroup) {
                $paramGroupArray = explode('-', $paramsGroup);

                foreach (explode(',', $paramGroupArray[1]) as $paramGroupValue) {
                    $filtersResult[$paramGroupArray[0]][] = $paramGroupValue;
                }
            }
        }

        return $filtersResult;
    }

    /**
     * @param array $rangeFilters
     * @return array
     */
    private function computeRangeFilters(array $rangeFilters): array {
        $rangeFiltersResult = [];
        foreach ($rangeFilters as $rangeFilter) {
            if (sizeOf($rangeFilter) > 0) {
                $rangeFiltersResult[$rangeFilter['Type'] . 'RangeFilter'] = $rangeFilter;
            }
        }
        return $rangeFiltersResult;
    }

    /**
     * @param array $rangeFilters
     * @return string
     */
    private function buildRangeFilterParams(array $rangeFilters): string {
        $rangeParams = '';
        foreach ($rangeFilters as $rangeFilter) {
            if (sizeOf($rangeFilter) > 0) {
                $separator = strlen($rangeParams) > 0 ? '&' : '';
                $rangeParams .= $separator . $rangeFilter['Type'] . 'From=' . $rangeFilter['From'] . '&' . $rangeFilter['Type'] . 'To=' . $rangeFilter['To'];
            }
        }
        return $rangeParams;
    }


    /**
     * @return string
     */
    public function getSlug(): string {
        return $this->slug;
    }

    /**
     * @return int
     */
    public function getPage(): int {
        return $this->page;
    }

    /**
     * @return string
     */
    public function getGrid(): string {
        return $this->grid;
    }

    /**
     * @return string
     */
    public function getSorting(): string {
        return $this->sorting;
    }

    /**
     * @return array
     */
    public function getFilter(): array {
        return $this->filter;
    }

    /**
     * @return string|null
     */
    public function getFilterParams(): ?string {
        return $this->filterParams;
    }

    /**
     * @return array
     */
    public function getRangeFilter(): array {
        return $this->rangeFilter;
    }

    /**
     * @return string|null
     */
    public function getRangeFilterParams(): ?string {
        return $this->rangeFilterParams;
    }
}