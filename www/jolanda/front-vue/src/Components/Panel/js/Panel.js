import {useAlertStore} from "@/Components/Panel/stores/panelStore";

export default class Panel{
    /**
     * Panel constructor
     */
    constructor() {
        this.showed = false;
        this.content = '';
        this.header = '';
        this.title = '';
        this.footer = '';
        this.buttons_content = '';
        this.classes = '';
        this.uid = 'panel' + Math.random().toString(36).substring(7);
        this.prevUrl = null;
        this.buttons = [];
        // panels[this.uid] = this;
        this.entityEditor = null;
        this.onBeforeHide = null;
        this.onAfterHide = null;
        this.onBeforeShow = null;
        this.onAfterShow = null;
        this.chache = false;
        this.panelStore = useAlertStore(window.pinia);
    }

    /**
     * Zavře panel
     */
    close() {
        if (this.onBeforeHide != null)
            this.onBeforeHide();
        window.history.replaceState('page2', 'Title', this.prevUrl);

        // //TODO zatím nechat, pak blbost
        // if (this.panelStore.getPanels() == 0)
        //     $('#main').show();
        // ///TODO


        if (this.onAfterHide != null)
            this.onAfterHide(arguments);
        breadcrumb.popItem();
        $(window).unbind('popstate');

        if(this.entityEditor && !this.cache){
            $('#panel-' + this.uid).remove();
            // this.panelStore.remove(this);
            let id = this.entityEditor.editor_id;
            $(window).off('beforeunload');
            delete this.entityEditor;
            window[id] = null;
        }else{
            this.showed = false;
            $('#panel-' + this.uid).css('display', 'none');
        }
    };

    /**
     * Nastavuje titulek tabu
     * @param {string} title Titulek
     */
    setTitle(title) {
        this.title = title;
        // if (this.showed)
        //     $('#panel-' + this.uid).find('[data-content="title"]').html(title);
    };

    /**
     * Nastavuje obsah
     * @param {string} content Obsah
     */
    setContent(content) {
        this.content = content;
        // if (this.showed)
        //     $('#panel-' + this.uid).find('[data-content="content"]').html(content);
    };

    /**
     * Nastavuje obsah v prostoru pro tlačítka
     * @param content Obsah
     */
    setButtonsContent(content) {
        this.buttons_content = content;
        // if (this.showed)
        //     $('#panel-' + this.uid).find('[data-content="buttons"]').html(content);
    };

    /**
     * Nastavuje patičku
     * @param {string} footer Patička
     */
    setFooter(footer) {
        this.footer = footer;
        // if (this.showed)
        //     $('#panel-' + this.uid).find('[data-content="footer"]').html(footer);
    };

    /**
     * Nastavuje hlavičku
     * @param {string} header Hlavička
     */
    setHeader(header) {
        this.header = header;
        // if (this.showed)
        //     $('#panel-' + this.uid).find('[data-content="header"]').html(header);
    };

    /**
     * Načítá panel z URL
     * @param {string} url Url pro načtení obsahu
     * @param {Object} data Parametry
     */
    showFromUrl(url, data=null) {
        Helpers.ajax({
            url: url,
            data: data,
            success: (data) => {
                let tmp = $('<div></div>');
                tmp.html(data)
                this.setHeader(tmp.find("[data-panel='header']").html() ?? '');
                this.setContent(tmp.find("[data-panel='content']").html() ?? '');
                this.setFooter(tmp.find("[data-panel='footer']").html() ?? '');
                this.setTitle(tmp.find("[data-panel='title']").html() ?? '');
                this.setButtonsContent(tmp.find("[data-panel='buttons']").html() ?? '');
                this.show();
                tmp.remove();
            }
        })
    }

    // TODO: dodělat minimalizace
    /*saveState() {
        sessionStorage.setItem(uid, $element);
    };

    minimize() {
        saveState();
        $element.remove();
    };

    maximize() {
        sessionStorage.getItem(uid);
    };
    */

    /**
     * Přidá tlačítko do pole tlačítek
     * @param {string} button HTML s tlačítkem
     */
    addToButtonArea(button) {
        this.buttons.push(button);
    };

    /**
     * Nastavuje URL
     * @param {string} editAction Editační URL
     * @param {int} entityID ID upravované entity
     */
    setUrl(editAction, entityID = null, replace = false) {
        if(!replace)
            this.prevUrl = window.location.href;
        if (entityID != null){
            if(editAction.includes('?')){
                editAction += '&entity_ID='+entityID
            }else{
                editAction += '?entity_ID='+entityID
            }
        }

        if(!replace)
            window.history.pushState('editor', 'Editor', editAction);
        else
            window.history.replaceState('editor', 'Editor', editAction);
    }

    /**
     * Zobrazuje panel
     */
    show() {
        // if (Object.values(panels).filter((obj) => obj.showed === true).length > 0){
        //     console.warn('There is one panel already opened!');
        //     delete panels[this.uid];
        //     return null;
        // }
        if (this.panelStore.getShowedPanels().length > 0){
            console.warn('There is one panel already opened!');
            return null;
        }

        // this.panelStore.add(this);

        if (this.onBeforeShow != null)
            this.onBeforeShow();
        // let buttons_html = this.buttons.join('');
        // buttons_html += this.buttons_content;
        // let template = `
        //     <div id="panel-${this.uid}" class="${this.classes}">
        //         <div class="panel-heading row">
        //             <div class="col-12 col-md-auto">
        //                 <button class="btn btn-icon" onclick="panels['${this.uid}'].close()"><i class="fa fa-arrow-left"></i> </button> <h1 class="d-inline-block" data-content="title">${this.title}</h1>
        //             </div>
        //             <div class="col-12 col-md text-right" data-content="buttons">
        //                 ${buttons_html}
        //             </div>
        //             <div class="col-12" data-content="header">
        //                 ${this.header}
        //             </div>
        //         </div>
        //         <div class="panel-content" data-content="content">
        //             ${this.content}
        //         </div>
        //         <div data-content="footer">
        //             ${this.footer}
        //         </div>
        //     </div>
        // `;

        // if(this.appendSelector === 'main #content'){
        //     $('main #content').children().each(function () {
        //         $(this).hide();
        //     });
        // }
        // $('main #content > #main').children().each(function () {
        //     $(this).hide();
        // });

        // $('main #content > #main').hide();

        // if((!this.entityEditor && this.cache) || !this.cache){
        //     $(this.appendSelector).append(template);
        //     plugins.initPlugins();
        // }else{
        //     $('#panel-' + this.uid).css('display', 'block');
        // }

        this.showed = true;
        $(window).on('popstate', (event) => {
            if (document.location.href === this.prevUrl)
                this.close();
        });
        if (this.onAfterShow != null)
            this.onAfterShow();
    }

    get buttons_html(){
        let buttons_html = this.buttons.join('');
        buttons_html += this.buttons_content;
        return buttons_html;
    }
}