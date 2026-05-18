class Radio extends Input{
    constructor(element, form = null) {
        super(element, form);

        this.rootElement = this.$element.closest('[id*="_group"]').find('div');
        this.onChange = null;
        this.bindEvents();
    }

    bindEvents() {
        this.rootElement.find('input[type="radio"]').on('change', (e) => {
            if(this.onChange)
                this.onChange(e, this);
        });
    }

    addOption(label, value){
        let newOption = `
            <label class="radiobox">
                <input type="radio" name="${this.name}" value="${value}">
                <span class="checkmark"></span><span>${label}</span>
            </label>
        `;

        this.rootElement.append(newOption);
        return this;
    }

    getValue(){
        let checked = this.rootElement.find('input[type="radio"]:checked');

        if(checked.length === 0)
            return null;

        return checked.val();
    }

    setValue(val) {
        this.checkByValue(val);
        return this;
    }

    checkByValue(value){
        this.rootElement.find('input[type="radio"][value="' + value + '"]').prop('checked', true);
        return this;
    }

}