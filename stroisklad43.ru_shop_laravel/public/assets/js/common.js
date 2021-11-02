$(document).ready(function() {
    //lazyload -->
    var lazy = $(".lazy-load").lazy({
        attribute: "data-src",
        effect: "fadeIn",
        effectTime: 800,
        threshold: 600,
        visibleOnly: true,
        chainable: false
    });

    function update_lazy() {
        lazy.update([true]);
    }
    //lazyload <--

    //reviews more btn -->>
    $(".reviews__read").on("click", function() {
        $(this)
            .parent()
            .find(".reviews__description")
            .addClass("show_element_true");
        $(this).hide();
    });
    //reviews more btn <<--

    //maps -->>
    var map = {
        map_block: "#map_content",
        map_pos: 0,
        map_block_display: "",
        map_state: 0,
        getWindowWidth: function() {
            let div = document.createElement("div");

            div.style.overflowY = "scroll";
            div.style.width = "50px";
            div.style.height = "50px";

            document.body.append(div);
            let scrollWidth = div.offsetWidth - div.clientWidth;

            div.remove();

            let window_width = $(window).width() + scrollWidth;

            return window_width;
        },
        yamapsInit: function(self) {
            var self = self;

            var myMap;

            var windowWidth = self.getWindowWidth();

            if (windowWidth >= 991) {
                mapPositionY = 58.578119;
                mapPositionX = 49.588343;
            } else {
                mapPositionY = 58.578119;
                mapPositionX = 49.595223;
            }

            myMap = new ymaps.Map("map_content", {
                center: [mapPositionY, mapPositionX],
                zoom: 15,
                controls: []
            });

            var myPlacemark = new ymaps.Placemark(
                [58.578119, 49.595223],
                {
                    iconCaption:
                        "Россия, Киров, Ленинский район, улица Щорса, 105",
                    hintContent:
                        "Россия, Киров, Ленинский район, улица Щорса, 105"
                },
                {
                    iconLayout: "default#image"
                    //iconImageHref: 'catalog/view/image/map_pointer.svg',
                    //iconImageSize: [76, 86],
                    //iconImageOffset: [-38, -43]
                }
            );

            myMap.geoObjects.add(myPlacemark);

            myMap.behaviors.disable("scrollZoom");
            //myMap.behaviors.disable('drag');
            //map.behaviors.disable('multiTouch');
            //myMap.controls.add('zoomControl');

            $(".payship_block_left_item_see_btn").bind("click", function() {
                myMap.container.fitToViewport();
            });
        },
        mapRun: function() {
            var self = this;

            if (window.ymaps != undefined) {
                if (ymaps.Map != undefined) {
                    ymaps.ready(self.yamapsInit(self));
                } else {
                    setTimeout(function() {
                        self.mapRun();
                    }, 100);
                }
            } else {
                setTimeout(function() {
                    self.mapRun();
                }, 100);
            }
        },
        checkMapState: function() {
            var self = this;

            if (self.map_state == 0) {
                self.map_block_display = $(self.map_block).css("display");

                if (self.map_block_display != "none") {
                    self.map_pos = $(self.map_block).offset().top;

                    if ($(window).scrollTop() > self.map_pos - 1800) {
                        var element = document.createElement("script");
                        element.src =
                            "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
                        document.body.appendChild(element);

                        self.map_state = 1;
                        self.mapRun();
                    }
                }
            }
        },
        mapInit: function() {
            var self = this;

            if (self.map_block) {
                self.checkMapState();

                $(window).bind("scroll", function() {
                    self.checkMapState();
                });
            }
        }
    };

    map.mapInit();
    //maps <<--

    //sliders -->>
    var reviews_slider = $(".reviews__container .rows").owlCarousel({
        margin: 40,
        responsiveClass: true,
        dots: false,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 2,
                nav: true
            }
        }
    });

    reviews_slider.on("changed.owl.carousel", function(event) {
        update_lazy();
    });

    const width = window.innerWidth;
    if (width < 991) {
        var mobile_slider = $(".grid-mobile-slider").owlCarousel({
            margin: 10,
            responsiveClass: true,
            dots: false,
            items: 1,
            nav: false,
            stagePadding: 30,
            responsive: {
                0: {
                    items: 1
                },
                500: {
                    items: 2
                },
                700: {
                    items: 3
                }
            }
        });

        mobile_slider.on("changed.owl.carousel", function(event) {
            update_lazy();
        });
    }
    //slders <<--

    //mob catalog menu -->>
    $(".menu__mob-nav-menu").on("click", function() {
        $(".navbar-wrapper").addClass("navbar-wrapper-show");
    });
    $(".navbar-wrapper__mob-close-btn").on("click", function() {
        $(".navbar-wrapper").removeClass("navbar-wrapper-show");
    });
    //mob catalog menu <<--

    //basket
    var cartObject = {
        formState: true,
        legalPerson: false,
        changeCurrentPageSum: function() {
            var self = this;

            var general_sum = 0;

            var products_collection = {};

            $(".product-content__count").each(function() {
                var inp_elem = $(this).find("input[type=number]");
                var product_sum_result = $(this).find(
                    ".product-content__count-sum-result"
                );

                var id = $(inp_elem).attr("data-product-id");
                var price = $(inp_elem).attr("data-price");
                var count = $(inp_elem).val();

                var sum = (price * 100 * count) / 100;

                sum = parseFloat(sum).toFixed(2);

                $(product_sum_result).text(sum + " ₽");

                general_sum += parseFloat(sum);

                products_collection[id] = count;
            });

            self.saveProductsToLocaleStorage(products_collection);

            $(".product-content__weight-price-sum").text(general_sum + " ₽");
        },
        saveProductsToLocaleStorage: function(products_collection) {
            var products = {};

            if (localStorage.getItem("products")) {
                products = JSON.parse(localStorage.getItem("products"));
            }

            for (let key in products_collection) {
                if (products_collection[key] > 0) {
                    products[key] = products_collection[key];
                } else {
                    delete products[key];
                }
            }

            localStorage.setItem("products", JSON.stringify(products));
        },
        updateProductsFromLocaleStorage: function() {
            var self = this;

            var products = JSON.parse(localStorage.getItem("products"));

            $(".product-content__count").each(function() {
                var inp_elem = $(this).find("input[type=number]");
                var inp_id = $(inp_elem).attr("data-product-id");

                $(inp_elem).val(0);

                for (let key in products) {
                    var id = key;
                    var count = products[key];

                    if (inp_id == id) {
                        $(inp_elem).val(count);
                    }
                }
            });

            self.changeCurrentPageSum();
        },
        doBuy: function(btn_elem) {
            var self = this;

            var btn_elem = btn_elem;
            var form_elem = $(btn_elem).parent();

            var csrf_token = $('meta[name="csrf-token"]').attr("content");
            var sxrf_token = $.cookie("XSRF-TOKEN");

            var products = localStorage.getItem("products");
            if (!products || products == "" || products == "{}") {
                alert("Корзина пустая");
                return false;
            } else {
                products = JSON.parse(localStorage.getItem("products"));
            }

            const name = $(form_elem).find('input[name="name"]');
            const phone = $(form_elem).find('input[name="phone"]');
            const email = $(form_elem).find('input[name="email"]');

            if ($(name).val().length < 3) {
                $(name).css("border", "1px solid red");
                return false;
            } else {
                $(name).css("border", "0");
            }

            if (
                $(phone).val().length < 18 ||
                $(phone)
                    .val()
                    .search("_") !== -1
            ) {
                $(phone).css("border", "1px solid red");
                return false;
            } else {
                $(phone).css("border", "0");
            }

            var reg_email = /^[\.\-\w+]{3,25}@[a-zA-Z0-9\-]{2,15}\.[a-zA-Z]{2,10}$/i;
            if ($(email).val().length < 5 || !reg_email.test($(email).val())) {
                $(email).css("border", "1px solid red");
                return false;
            } else {
                $(email).css("border", "0");
            }

            var pay_type = "";
            pay_type = $(".basket-wrapper__form-checkbox.active").attr(
                "data-pay-type"
            );

            var pay_type_text = "";
            pay_type_text = $(".basket-wrapper__form-checkbox.active").attr(
                "data-pay-type-text"
            );

            var pay_agent = "";
            if (self.legalPerson) {
                const pay_agent_field = $(form_elem).find(
                    'input[name="pay-agent"]'
                );

                pay_agent = $(pay_agent_field).val();

                if (pay_agent.length < 8) {
                    $(pay_agent_field).css("border", "1px solid red");
                    return false;
                } else {
                    $(pay_agent_field).css("border", "0");
                }
            }

            if (self.formState) {
                self.formState = false;

                $.ajax({
                    url: "/add_order",
                    type: "post",
                    data: {
                        name: $(name).val(),
                        phone: $(phone).val(),
                        email: $(email).val(),
                        _token: $('meta[name="csrf-token"]').attr("content"),
                        products: products,
                        pay_type: pay_type,
                        pay_type_text: pay_type_text,
                        pay_agent: pay_agent
                    },
                    success: function(data) {
                        if (data !== "false") {
                            window.location.href = data["formUrl"];
                        } else {
                            alert("Произошла ошибка");
                        }

                        self.formState = true;
                    },
                    error: function(error) {
                        console.log(error);

                        self.formState = true;
                    }
                });
            }
        },
        changeCartSum: function() {
            var self = this;

            var products_collection = {};

            var general_sum = 0;

            $(".basket-wrapper__products-content-row").each(function() {
                var count_elem = $(this).find(".basket-wrapper__count");

                var id = $(count_elem).attr("data-product-id");
                var count = parseInt($(count_elem).text());
                var price = $(count_elem).attr("data-price");

                products_collection[id] = count;

                var sum = count * price;

                general_sum += sum;
            });

            general_sum = parseFloat(general_sum).toFixed(2);

            $(".basket-wrapper__sum span").text(general_sum);

            self.saveProductsToLocaleStorage(products_collection);
        },
        closeCart: function() {
            var self = this;

            self.updateProductsFromLocaleStorage();

            $(".basket-popup").removeClass("active");
        },
        openCart: function() {
            var self = this;

            var token = $('meta[name="csrf-token"]').attr("content");

            $(".basket-popup").addClass("active");

            var products = JSON.parse(localStorage.getItem("products"));

            $.ajax({
                url: "/get_order",
                type: "post",
                data: {
                    products: products,
                    _token: token
                },
                success: function(data) {
                    $(".basket-wrapper__products-content").html(data);

                    self.changeCartSum();
                }
            });
        },
        cartInit: function() {
            var self = this;

            $(
                ".catalog__item-order_do-open, .basket, .menu__mob-nav-basket"
            ).on("click", function() {
                self.openCart();
            });

            $(".basket-wrapper__close").on("click", function() {
                self.closeCart();
            });

            $(".basket-wrapper__products").on(
                "click",
                ".basket-wrapper__delete",
                function() {
                    var count_elem = $(this)
                        .parent()
                        .parent()
                        .find(".basket-wrapper__count");
                    var count = 0;

                    $(count_elem).text(count);
                    $(count_elem)
                        .parent()
                        .parent()
                        .hide();

                    self.changeCartSum();
                }
            );

            $(".basket-wrapper__products").on(
                "click",
                ".basket-wrapper__minus",
                function() {
                    var count_elem = $(this)
                        .parent()
                        .find(".basket-wrapper__count");
                    var count = parseInt($(count_elem).text());

                    var price = $(count_elem).attr("data-price");

                    var step = $(count_elem).attr("data-step-sell");

                    var min = $(count_elem).attr("data-min-sell");

                    count -= parseInt(step);

                    if (count < min) {
                        count = 0;
                    }

                    if (count > 0) {
                        $(count_elem).text(count);

                        let sum = price * count;
                        sum = parseFloat(sum).toFixed(2);

                        $(count_elem)
                            .parent()
                            .parent()
                            .find(".basket-wrapper__price")
                            .text(sum + " ₽");
                    } else {
                        count = 0;
                        $(count_elem).text(count);
                        $(count_elem)
                            .parent()
                            .parent()
                            .hide();
                    }

                    self.changeCartSum();
                }
            );

            $(".basket-wrapper__products").on(
                "click",
                ".basket-wrapper__plus",
                function() {
                    var count_elem = $(this)
                        .parent()
                        .find(".basket-wrapper__count");
                    var count = parseInt($(count_elem).text());

                    var price = $(count_elem).attr("data-price");

                    var step = $(count_elem).attr("data-step-sell");

                    var min = $(count_elem).attr("data-min-sell");

                    count += parseInt(step);

                    if (count < min) {
                        count = min;
                    }

                    $(count_elem).text(count);

                    let sum = price * count;
                    sum = parseFloat(sum).toFixed(2);

                    $(count_elem)
                        .parent()
                        .parent()
                        .find(".basket-wrapper__price")
                        .text(sum + " ₽");

                    self.changeCartSum();
                }
            );

            $(".basket-wrapper__form-btn").on("click", function() {
                var btn_elem = $(this);

                self.doBuy(btn_elem);
            });

            $(".basket-wrapper__form-checkbox").on("click", function() {
                $(".basket-wrapper__form-checkbox").removeClass("active");

                var pay_type = $(this).attr("data-pay-type");

                if (pay_type == "urlica") {
                    $(".basket-wrapper__form-pay-agent-wrapper").addClass(
                        "active"
                    );

                    self.legalPerson = true;
                } else {
                    $(".basket-wrapper__form-pay-agent-wrapper").removeClass(
                        "active"
                    );

                    self.legalPerson = false;
                }

                if(pay_type == 'bank') {
                    $(".basket-wrapper__form-bank-info-wrapper").addClass(
                        "active"
                    );
                } else {
                    $(".basket-wrapper__form-bank-info-wrapper").removeClass(
                        "active"
                    );
                }

                $(this).addClass("active");
            });
        },
        productPageInit: function() {
            var self = this;

            self.updateProductsFromLocaleStorage();

            $(".product-content__count-count input").on("change", function() {
                var step_sell = parseInt($(this).attr("data-step"));
                var min_sell = parseInt($(this).attr("data-min"));

                var val = parseInt($(this).val());

                if (val != 0 && val < min_sell) {
                    val = min_sell;
                }

                if (val != 0 && val % step_sell != 0) {
                    let downside = val % step_sell;

                    let need_to_int = step_sell - downside;

                    val = val + need_to_int;
                }

                $(this).val(val);

                self.changeCurrentPageSum();
            });
        },
        init: function() {
            var self = this;

            if ($("div").is(".product-content__count-count")) {
                self.productPageInit();
            }

            self.cartInit();
        }
    };

    cartObject.init();

    //input mask -->>
    $('form input[name="phone"]').inputmask("+7 (999) 999-99-99");
    //input mask <<--

    //catalog btn -->>
    $(".btn-white").on("click", function() {
        let body = $("html, body");
        let catalogPosition = $(".block-2").offset();
        catalogPosition = parseInt(catalogPosition["top"]) - 100;

        body.stop().animate(
            { scrollTop: catalogPosition },
            500,
            "swing",
            function() {}
        );
    });
    //catalog btn <<--

    //callback form
    $(".block-services__item-btn-order").on("click", function() {
        var service_type = $(this)
            .parent()
            .parent()
            .find(".block-services__item-header")
            .text();

        $(".callback-wrapper__header span").text(service_type);
        $(".callback-wrapper__form-btn").attr(
            "data-service-type",
            service_type
        );

        $(".callback-popup").addClass("active");
    });

    $(".callback-wrapper__close").on("click", function() {
        $(".callback-popup").removeClass("active");
    });

    $(".callback-wrapper__form-btn").on("click", function() {
        var btn_elem = $(this);
        var form_elem = $(btn_elem).parent();

        var csrf_token = $('meta[name="csrf-token"]').attr("content");
        var sxrf_token = $.cookie("XSRF-TOKEN");

        var service_type = $(btn_elem).attr("data-service-type");

        const name = $(form_elem).find('input[name="name"]');
        const phone = $(form_elem).find('input[name="phone"]');
        const email = $(form_elem).find('input[name="email"]');

        if ($(name).val().length < 3) {
            $(name).css("border", "1px solid red");
            return false;
        } else {
            $(name).css("border", "0");
        }

        if (
            $(phone).val().length < 18 ||
            $(phone)
                .val()
                .search("_") !== -1
        ) {
            $(phone).css("border", "1px solid red");
            return false;
        } else {
            $(phone).css("border", "0");
        }

        var reg_email = /^[\.\-\w+]{3,25}@[a-zA-Z0-9\-]{2,15}\.[a-zA-Z]{2,10}$/i;
        if ($(email).val().length < 5 || !reg_email.test($(email).val())) {
            $(email).css("border", "1px solid red");
            return false;
        } else {
            $(email).css("border", "0");
        }

        $.ajax({
            url: "/sendServiceRequest",
            type: "post",
            data: {
                name: $(name).val(),
                phone: $(phone).val(),
                email: $(email).val(),
                _token: csrf_token,
                service_type: service_type
            },
            success: function(data) {
                if (data !== "false") {
                    $(".callback-popup")
                        .find("input")
                        .each(function() {
                            $(this).val("");
                        });
                    $(".callback-wrapper__thx-message").addClass("active");

                    setTimeout(function() {
                        $(".callback-wrapper__thx-message").removeClass(
                            "active"
                        );
                        $(".callback-popup").removeClass("active");
                    }, 8000);
                } else {
                    alert("Произошла ошибка");
                }
            }
        });
    });
});
