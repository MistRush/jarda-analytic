class pageController {
    indexAction() {
        new MainContactForm();
    }

    getPageSlug() {
        const u = location.href;
        return u.replace(/(^\w+:|^)\/\//, '').replace(location.host + '/page/', '').replace(location.search, '');
    }
}