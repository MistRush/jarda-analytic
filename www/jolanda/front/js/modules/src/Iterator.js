class Iterator{
    constructor(items = [], startRelativeIndex = 0, totalLength = null, offset = 0, url = {
        params: [],
        url: null,
    }) {
        this.url = url;
        this.items = [];
        this.startIndex = startRelativeIndex;
        this.offset = offset;
        this.currentIndex = this.startIndex + this.offset;
        this.totalLength = totalLength ?? this.items.length;

        this.lockScreenOnAjax = false;

        this.initItems(items);
    }

    setItems(items, totalLength = null, offset = 0){
        this.totalLength = totalLength ?? items.length;
        this.offset = offset;
        this.initItems(items);

        return this;
    }

    setCurrentIndex(index) {
        if (index < 0 && index >= this.totalLength)
            return false;

        this.currentIndex = index;

        if(this.url.url) {
            this.getData();
        }

        return true;
    }



    appendItems(items){
        items.forEach((item, index) => {
            this.items[index + this.items.length] = item;
        });

        if(this.items.length > this.totalLength){
            this.totalLength = this.items.length;
        }

        return this;
    }

    prependItems(items){
        this.offset -= items.length;

        if(this.offset < 0){
            this.items.forEach((item, index) => {
                this.items[index + Math.abs(this.offset)] = item;
            });
            this.offset = 0;
            this.totalLength += Math.abs(this.offset);
            this.currentIndex += Math.abs(this.offset);
        }

        items.forEach((item, index) => {
            this.items[index + this.offset] = item;
        });

        return this;
    }

    getAbsoluteIndex(){
        return this.currentIndex;
    }

    getRelativeIndex(){
        return this.currentIndex - this.offset;
    }

    initItems(items){
        this.items = [];

        items.forEach((item, index) => {
            this.items[index + this.offset] = item;
        });
    }

    next(){
        this.currentIndex++;
        if(!Object.keys(this.items).includes(this.currentIndex.toString()) && this.currentIndex < this.totalLength){
            if(this.url.url)
                this.getNextData();
            else
                return false;
        }else if(!Object.keys(this.items).includes(this.currentIndex.toString()))
            return false;


        return this.items[this.currentIndex];
    }

    prev(){
        this.currentIndex--;
        if(!Object.keys(this.items).includes(this.currentIndex.toString()) && this.currentIndex >= 0){
            if(this.url.url)
                this.getPrevData();
            else
                return false;
        }else if(!Object.keys(this.items).includes(this.currentIndex.toString()))
            return false;


        return this.items[this.currentIndex];
    }

    current(){
        if(!Object.keys(this.items).includes(this.currentIndex.toString()))
            return false;
        return this.items[this.currentIndex];
    }

    getNextData(){
        this.url.params.start = this.getItemsLastIndex()+1;

        if(this.url.params.start >= this.totalLength)
            this.url.params.start = this.totalLength;

        let ajax = Helpers.ajax({
            url: this.url.url,
            data: this.url.params,
            async: false,
            success: (data) => {
                data = JSON.parse(data);

                const items = data.items.map((item) => {return item.ID});
                this.appendItems(items);
            }
        }, this.lockScreenOnAjax);

        return ajax;
    }

    getData(){
        this.url.params.start = this.currentIndex - (this.url.params.count/2);
        if(this.url.params.start < 0)
            this.url.params.start = 0;

        let ajax = Helpers.ajax({
            url: this.url.url,
            data: this.url.params,
            async: false,
            success: (data) => {
                data = JSON.parse(data);

                const items = data.items.map((item) => {return item.ID});
                this.setItems(items, this.totalLength, this.url.params.start);
            }
        }, this.lockScreenOnAjax);

        return ajax;
    }

    getPrevData(){
        this.url.params.start = this.offset - this.url.params.count;
        if(this.url.params.start < 0)
            this.url.params.start = 0;

        let ajax = Helpers.ajax({
            url: this.url.url,
            data: this.url.params,
            async: false,
            success: (data) => {
                data = JSON.parse(data);

                const items = data.items.map((item) => {return item.ID});
                this.prependItems(items);
            }
        }, this.lockScreenOnAjax);

        return ajax;
    }

    getItemsLastIndex(){
        return parseInt(Object.keys(this.items)[Object.keys(this.items).length-1]);
    }

    getItemsFirstIndex(){
        return parseInt(Object.keys(this.items)[0]);
    }

    hasNext(){
        const nextIndex = this.currentIndex + 1;
        if(!Object.keys(this.items).includes(nextIndex.toString()) && nextIndex  < this.totalLength){
            return true;
        }else if(!Object.keys(this.items).includes(nextIndex.toString()))
            return false;

        return true;
    }

    hasPrev(){
        const prevIndex = this.currentIndex - 1;
        if(!Object.keys(this.items).includes(prevIndex.toString()) && prevIndex >= 0){
            return true;
        }else if(!Object.keys(this.items).includes(prevIndex.toString()))
            return false;

        return true;
    }



}