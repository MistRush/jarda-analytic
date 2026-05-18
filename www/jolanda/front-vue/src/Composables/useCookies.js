const useCookies = () => {
    const setCookie = (cname, cvalue, exdays) => {
        const date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));

        const expires = "expires=" + date.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    const getCookie = (cname) => {
        const name = cname + "=";
        const cookieString = document.cookie.split(';');
        for (let i = 0; i < cookieString.length; i++) {
            let cookie = cookieString[i];
            while (cookie.charAt(0) === ' ')
                cookie = cookie.substring(1);

            if (cookie.indexOf(name) === 0)
                return cookie.substring(name.length, cookie.length);
        }

        return undefined;
    }

    return {
        setCookie,
        getCookie,
    }
}

export {useCookies};