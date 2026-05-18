class Cookie {
    /**
     * Nastavuje cookie
     * @param {string} cname Název cookie
     * @param {string} cvalue Hodnota cookie
     * @param {int} exdays Doba expirace ve dnech
     */
    static setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * Vrací hodnotu v cookie
     * @param {string} cname Název cookie
     * @return {string|undefined}
     */
    static getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    }
}