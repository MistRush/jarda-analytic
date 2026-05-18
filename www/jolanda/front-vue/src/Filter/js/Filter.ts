import type { FilterItemOperation } from "@/Filter/Types/Filter";
import type { IFilterItem } from "@/Filter/js/FilterItem";
import { FilterItem } from "@/Filter/js/FilterItem";
import { plainToClass, Transform } from "class-transformer";
import "reflect-metadata";

export interface IFilter extends FilterState {
    getItem: (key: string) => IFilterItem | undefined;
    setItem: (key: string, value: IFilterItem) => void;
    getReducedItemsFilters: () => { [key: string]: FilterItemOperation[] };
    getReducedItems: () => { [key: string]: IFilterItem };
    reduceItemsFilters: () => void;
}

export interface FilterState {
    items: { [key: string]: IFilterItem };
}

export class Filter implements IFilter {
    @Transform(({ value }) =>
        Object.keys(value).reduce((acc: any, key) => {
            acc[key] = plainToClass(FilterItem, value[key]);
            return acc;
        }, {}),
        { toClassOnly: true }
    )
    public items: { [key: string]: IFilterItem } = {};

    constructor(filterState: FilterState | null) {
        Object.assign(
            this,
            filterState ?? {
                items: {},
            },
        );

        if(filterState?.items){
            this.items = {};
            Object.entries(filterState.items).forEach(([key, item]) => {
                const newItem = item instanceof FilterItem ? item : new FilterItem(item);
                this.items[key] = newItem;
            });
        }
    }

    public getItem(key: string): IFilterItem | undefined {
        return this.items[key] ?? undefined;
    }

    public setItem(key: string, value: IFilterItem): void {
        this.items[key] = value;
    }

    public reduceItemsFilters(): void {
        this.items = this.getReducedItems();
    }

    public getReducedItemsFilters(): { [key: string]: FilterItemOperation[] } {
        let reducedItemsFilters: { [key: string]: FilterItemOperation[] } = {};

        for (const key in this.items) {
            let reducedItemFilter = this.items[key].getReducedFilters();
            if (reducedItemFilter.length === 0) {
                continue;
            }

            reducedItemsFilters[key] = reducedItemFilter;
        }

        return reducedItemsFilters;
    }

    public getReducedItems(): { [key: string]: IFilterItem } {
        let reducedItems: { [key: string]: IFilterItem } = {};

        for (const key in this.items) {
            let reducedItemFilters = this.items[key].getReducedFilters();
            if (reducedItemFilters.length === 0) {
                continue;
            }

            reducedItems[key] = new FilterItem({
                name: this.items[key].name,
                filters: reducedItemFilters,
            });
        }

        return reducedItems;
    }
}
