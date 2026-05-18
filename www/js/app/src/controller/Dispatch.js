class Dispatch {
    constructor(page) {
        this.page = page;
        this.dispatch();
    }

    dispatch() {
        let className = page.controller + 'Controller';
        let functionName = this.prepareAction(page.action + 'Action');

        try {
            let checkClass = eval(`new ${className}()`);

            if ( typeof checkClass[functionName] === 'function')
                eval(`checkClass.${functionName}()`);

        } catch (e) { }
    }

    prepareAction(action) {
        return action.replace('-', '');
    }
}