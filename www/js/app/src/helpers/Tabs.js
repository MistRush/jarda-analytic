class Tabs {
    constructor(tabcontainer_id) {
        this.tabcontainerID = '#' + tabcontainer_id;

        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        $(this.tabcontainerID + ' ul.tabs li').click((e) => {
            let $this = $(e.target);
            this.changeTab($this);
        });
    }

    changeTab(tab) {
        $(this.tabcontainerID + ' ul.tabs li').removeClass('current');
        $(this.tabcontainerID + ' .tab-content').removeClass('current');

        tab.addClass('current');
        $("#" + tab.attr('data-tab')).addClass('current');
    }
}