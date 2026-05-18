class Layout {
    // static UTM_COOKIE = 'filokalistaUtm';
    // static REFERER_COOKIE = 'filokalistaReferer';
    constructor() {
        $(() => {
            this.bindEvents();

            if (page.controller === 'index' && page.action === 'index')
                this.initSlider();
        });

        //new Newsletter();
    }

    async bindEvents() {
        const me = this;

        $(window).scroll(function() {
          me.sticker();
        });

        me.menuSticker();

        $("#currency-menu .dropdown-item").click(function () {
            me.setCookie("currencyMark", $(this).data("currencyMark"), 30);
            me.setCookie("currencyName", $(this).data("currencyName"), 30);
            location.reload();
        });

        CartHeader.quantityChangeListener();

        $(".quantity-change").click(function (e) {
            var quantity = $(e.currentTarget).siblings('.quantity').val();

            if ( $(e.currentTarget).hasClass('down') && quantity != 1 )
                $(e.currentTarget).siblings('.quantity').val(quantity - 1);

            if ( $(e.currentTarget).hasClass('up') ) {
                $(e.currentTarget).siblings('.quantity').val(quantity - (-1));
            }
            $(e.currentTarget).siblings('.quantity').trigger('change');
        });

        this.toggleLeftSide();
        this.processUtmParams(window.location.href);
        this.processReferer();

        $('.back-to-top').click((e) => {
            e.preventDefault();
            this.backToTop();
        });

        $('.mobile-search').click((e) => {
            this.toggleSearch();
        });

        // $('.mobile-menu').click((e) => {
        //     this.toggleMenu();
        // });

        $('.filter .heading').click((e) => {
            this.toggleFilter();
        });



        $('#menuToggle').click((e) => {
            $('#header').toggleClass('white-menu');
            $('.mobile-menu').toggleClass('open');
        });

        $('#menu1 a').click(function() {
            $('#menuToggle input').prop('checked', false);

            $('#header').removeClass('white-menu');
            $('.mobile-menu').removeClass('open');
        });

        $('#toggle-menu').click((e) => {
            this.toggleMenu();

            if ($(window).width() < 992) {

            }
        });

        $('#toggleMenu').click((e) => {
            // this.toggleMenu();
            console.log(sss)
        });

        // $('#menu1 li').click((e) => {
        //     this.toggleMenu();
        // });

        if (location.hash === '#prihlaseni') {
            await layout.openLoginDialog();
        }

        // mobile menu section
        var mobileBreakpoint = 992;

        function isMobile() {
            return $(window).width() < mobileBreakpoint;
        }

        $('.category-wrapper .item img').on('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation();

                var categoryWrapper = $(this).closest('.category-wrapper');
                var itemLink = $(this).closest('.item');
                var categoryId = itemLink.data('category-id');

                $('.category-wrapper .item').not(itemLink).removeClass('open');

                itemLink.toggleClass('open');

                $('.subcategory-preview').not('[data-category-id="' + categoryId + '"]').removeClass('active');

                var targetSubcategory = $('.subcategory-preview[data-category-id="' + categoryId + '"]');
                targetSubcategory.toggleClass('active');
            }
        });

        $('.subcategory-item .subcategory-name a img').on('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation();

                var subcategoryItem = $(this).closest('.subcategory-item');
                var subcategoryId = subcategoryItem.data('subcategory-id');

                $('.subcategory-item').not(subcategoryItem).removeClass('open');
                subcategoryItem.toggleClass('open');
            }
        });

        $(window).resize(function() {
            if (!isMobile()) {
                $('.category-wrapper .item').removeClass('open');
                $('.subcategory-preview').removeClass('active');
                $('.subcategory-item').removeClass('open');
            }
        });
        // end mobile menu section


        $('.category-menu .headline').click((e) => {
            this.toggleHeaderCategoryMenu();
        });

        $('.product-catalogue .link-holder').click((e) => {
            this.toggleProductCatalogue();
        });

        $('.header-main-menu-container .menu-item').each(function(e) {
            /*
                let $this = $(this);
                if ( $this.data('sub-loaded') == 0 ) {
                    $this.data('sub-loaded', 1);

                    this.running = $.ajax(projectVars.basePath + '/default/index/get-main-menu-sub-category', {
                        data: {
                            Category_ID: $this.data('category-id')
                        },
                        method: 'GET',
                        success: (data) => {
                            $this.append(data);
                            if ($(window).outerWidth() <= 768) {
                                me.mobileMenuInit();
                                me.mobileMenuSubMenuInit();
                            }
                            $(window).resize(function(){
                                if ($(window).outerWidth() <= 768) {
                                    me.mobileMenuInit();
                                    me.mobileMenuSubMenuInit();
                                }
                            });
                        }
                    });
                }

             */
        });

        // if ($(window).outerWidth() < 768) {
        //     me.mobileMenuInit();
        // }
        //
        // $(window).resize(function(){
        //     if ($(window).outerWidth() < 768) {
        //         me.mobileMenuSubMenuInit();
        //     }
        // });


        if ($('#announcement[data-announcement]').length) {
            $('#announcement .close').unbind().bind('click', (e) => {
                this.setAnnouncementRead($(e.currentTarget).parents('#announcement').data('announcement'));
                $(e.currentTarget).parents('#announcement').stop().fadeOut(300, function () {
                    //$(this).remove();
                });
            });
        }

        $(() => {
            /*
            let el = document.querySelector(".instagram-posts");
            let x = 0, y = 0, top = 0, left = 0;

            let draggingFunction = (e) => {
                document.addEventListener('mouseup', () => {
                    document.removeEventListener("mousemove", draggingFunction);
                });

                el.scrollLeft = left - e.pageX + x;
                el.scrollTop = top - e.pageY + y;
            };

            el.addEventListener('mousedown', (e) => {
                e.preventDefault();

                y = e.pageY;
                x = e.pageX;
                top = el.scrollTop;
                left = el.scrollLeft;

                document.addEventListener('mousemove', draggingFunction);
            });*/
        });
    }

    backToTop() {
        $('html, body').animate({scrollTop: 0}, 350);
    }

    toggleSearch() {
        $('.search-block').toggle('slow');
    }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle();
    //     $('.header-main-container').toggleClass('open');
    // }

    // toggleMenu() {
    //     console.log('toggle menu .. tady by se na mobilu melo otevřít menu');
    //     $('#header .menu-container').toggle('medium');
    //     // $('.mobile-menu').toggleClass('active');
    //     $('#toggle-menu.mobile-menu').toggleClass('active');
    // }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle('medium');
    //     $('.mobile-menu').toggleClass('active');
    //     $('#toggleMenu').toggleClass('active');
    // }

    toggleHeaderCategoryMenu() {
        $('#header .category-menu').toggleClass('active');
        this.toggleLeftSide();
    }

    toggleLeftSide() {
        if ($(window).width() > 991) {
            $('#content .left-side').css('padding-top', ($('#header .category-menu').height() - 20) + 'px');
        }
    }

    toggleFilter() {
        $('.filter .block').toggle('medium');
    }

    toggleProductCatalogue() {
        $('.product-catalogue .categories').toggle();
    }

    cookiePopup() {
        var cookie_popup = Cookie.getCookie('cookie-popup');
        if ( cookie_popup === undefined || !cookie_popup ) {
            $('#cookieBar').css('display','flex');
        }
        $('#cookieBar button').click(function () {
            Cookie.setCookie('cookie-popup', true, 900);
            $('#cookieBar').hide();
        });
    }

    doScroll(targetNode) {
        var target = $(targetNode);
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }

    initSlider() {
        $("#slider").responsiveSlides({
            auto: true,
            pager: false,
            nav: false,
            speed: 800,
            namespace: "centered-btns",
            manualControls: '.slider-pager',
        });
    }

    setAnnouncementRead(Hash) {
        let announcements = Cookie.getCookie('announcement');

        if (announcements.length)
            announcements = JSON.parse(announcements);
        else
            announcements = [];

        announcements.push(Hash);

        Cookie.setCookie('announcement', JSON.stringify(announcements), '10');
    }

    processUtmParams(href) {
        let isVisitorFromExternalCampaign;
        let isCookieExists;
        if (!Layout.checkCookieName(Layout.UTM_COOKIE)) {
            isCookieExists = false;
            isVisitorFromExternalCampaign = !!href.match(/(?:utm_source|utm_medium|utm_name|utm_content)/i);
        } else {
            isCookieExists = true;
            isVisitorFromExternalCampaign = true;
        }

        if(!isCookieExists && isVisitorFromExternalCampaign) {
            const utmParams = this.prepareUtmParams(href);
            this.setCookie(Layout.UTM_COOKIE, utmParams, 1);
        }
    }

    processReferer() {
        let isCookieExists = Layout.checkCookieName(Layout.REFERER_COOKIE);
        const referer = document.referrer;
        if(!isCookieExists && referer) {
            const refererValue = this.prepareRefererValue(referer);
            if(refererValue !== 'vamot')
            this.setCookie(Layout.REFERER_COOKIE, refererValue, 1);
        }
    }

    static checkCookieName(name)
    {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
        else{
            return false
        }
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static deleteCookie(cname) {
            document.cookie = cname +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    sticker() {
        const header = $('#header');
        const headerHeight = header.height();
        const content = $('#content');
        const winScroll = $(window).scrollTop();
        header.toggleClass('fixed', 0 - winScroll <= 0 );
        //content.css('padding-top', headerHeight + 20);
        /*
        if(0 - winScroll <= 0) {
            content.css('padding-top', headerHeight + 20);
        } else {
            content.css('padding-top', 0);
        }*/
    }

    prepareUtmParams(href) {
        let params = href.split('?');
        let paramValues = params[1].split('&');
        let finalParamsString = [];
        for(const paramValue of paramValues) {
            let data = paramValue.split('=');
            if(data[0].match(/(utm_source|utm_medium|utm_name|utm_content)/i))
                finalParamsString.push(`${data[0]}=${data[1]}`);
        }
        return finalParamsString.join('&');
    }
    prepareRefererValue(referer) {
        let dataWithoutSubdomain = referer.replace('www.', '').replace('search.', '');
        let dataWithoutProtocol = dataWithoutSubdomain.split('://')[1];
        return dataWithoutProtocol.split('.')[0]
    }

    mobileMenuInit() {
        $('.menu-item[data-category-id] > a').click(function(e) {
            e.preventDefault();
            $(this).parent('[data-category-id]').children('.sub-menu').addClass('show');
        })
    }
    mobileMenuSubMenuInit() {
        $('.menu-item[data-category-id] .sub-menu .back-item').each(function(e) {
            $(this).click(function(e) {
                e.preventDefault();
                $(this).closest('.sub-menu').removeClass('show');
            })
        })
    }

    async openLoginDialog() {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._modalClass = 'login';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/login');

        new LoginForm();
    }

    menuSticker(threshold = 200 ) {
        const me = this;
        $('.category-wrapper').hover(function() {
            if(window.scrollY >= threshold) {
                const subcategoryPreview = $(this).find('.subcategory-preview');
                const rightOffset = me.rightSpaceCalculationForFixedMenu('.container');
                subcategoryPreview.addClass('fixed');
                if (rightOffset > 0) {
                    subcategoryPreview.css('right', rightOffset);
                } else {
                    const leftOffset = me.leftSpaceCalculationForFixedMenu('.container');
                    subcategoryPreview.css('left', leftOffset);
                }
            } else {
                $(this).find('.subcategory-preview').removeClass('fixed');
                $(this).find('.subcategory-preview').css({
                    'right': '',
                    'left': ''
                });
            }
        })
    }

    async openRegistrationInfoDialog(title, content)  {
        console.log('openRegistrationInfoDialog', title, content);
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog.modalClass = 'registration-info';
        this.dialog._title = title;
        await this.dialog.openFromUrl(projectVars.basePath + '/customer/registration-info', {content} );
    }

    rightSpaceCalculationForFixedMenu(selector) {
        const content = document.querySelector(selector);
        if (content) {
            const rect = content.getBoundingClientRect();
            const spaceRight = window.innerWidth - rect.right;
            if (spaceRight < 100) {
                return 0;
            }
            return spaceRight+'px';
        }
    }

    leftSpaceCalculationForFixedMenu(selector) {
        const content = document.querySelector(selector);
        if (content) {
            const rect = content.getBoundingClientRect();
            const spaceLeft =  rect.left;
            const categoryMenuWidth = $('.category-menu.active').width();
            return (spaceLeft+categoryMenuWidth)+'px';
        }
    }
}