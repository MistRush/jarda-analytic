import type {FilterItemOperation} from "@/Filter/Types/Filter";

export interface IFilterItem extends FilterItemState{
    addFilter: (filter: FilterItemOperation) => void;
    removeFilter: (index: number) => void;
    addNoneOperation: () => void;
    getReducedFilters: () => FilterItemOperation[];
    reduceFilters: () => void;
}

export interface FilterItemState {
    name?: string,
    filters: FilterItemOperation[],
}

export class FilterItem implements IFilterItem
{
    public name?: string;
    public filters: FilterItemOperation[];

    constructor(filterItemState: FilterItemState|null){
        this.name = filterItemState?.name ?? '';
        this.filters = filterItemState?.filters ?? [];
    }

    public addFilter(filter: FilterItemOperation): void{
        this.filters = [
            ...this.filters,
            filter,
        ];
    };

    public removeFilter(index: number): void{
        this.filters = this.filters.filter((_, i) => i !== index);
    };

    public addNoneOperation(){
        const noneOperation: FilterItemOperation = {
            operation: 'none',
            value: '',
        };

        this.addFilter(noneOperation);
    }

    public reduceFilters(): void{
        this.filters = this.getReducedFilters();
    }

    public getReducedFilters(): FilterItemOperation[]{
        return this.filters.reduce((acc2: FilterItemOperation[], operation: FilterItemOperation) => {
            if (operation.operation === 'none' || operation.value === '')
                return acc2;

            acc2.push(operation);
            return acc2;
        }, []);
    }

}