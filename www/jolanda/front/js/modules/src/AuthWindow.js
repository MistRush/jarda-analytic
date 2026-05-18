class AuthWindow {
    static instance = {};
    constructor(OAuthServer, url) {
        this.url = url;
        this.OAuthServer = OAuthServer;
        this.window = null;
        AuthWindow.instance[OAuthServer] = this;
        this._timer = null;
        this.onAfterClose = null;
    }

    open() {
        if(!this.window || this.window.closed) {
            this.window = open(this.url + '?OAuthServer=' + this.OAuthServer, '__top', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350,popup=true');

            this._timer = setInterval(() => {
                if(this.window.closed) {
                    clearInterval(this._timer);

                    if(typeof this.onAfterClose === 'function'){
                        this.onAfterClose();
                        this.window = null;
                    }
                }
            }, 1000);
        }
    }

    static open(OAuthServer) {
        if(typeof AuthWindow.instance[OAuthServer] !== "undefined" && AuthWindow.instance[OAuthServer])
            AuthWindow.instance[OAuthServer].open();
    }
}