
$(document).ready(function(){
    //functions -->>
		function getWindowWidth(){
			let div = document.createElement('div');

			div.style.overflowY = 'scroll';
			div.style.width = '50px';
			div.style.height = '50px';

			// мы должны вставить элемент в документ, иначе размеры будут равны 0
			document.body.append(div);
			let scrollWidth = div.offsetWidth - div.clientWidth;

			div.remove();

			let window_width = $(window).width() + scrollWidth;

			return window_width;
		}
	//functions <<--


	//анимация самолетиков -->
	function startAnime(){
		var anime_item_1 = $('.header_block_airplan_1');
		var anime_item_2 = $('.header_block_airplan_2');
		var anime_item_3 = $('.header_block_airplan_3');
		var anime_item_4 = $('.header_block_airplan_4');
		var anime_item_5 = $('.header_block_airplan_5');

		$(anime_item_1).css({
			'transition': '0.5s',
			'margin-bottom': '-232px'
		});
		$(anime_item_2).css({
			'transition': '0.5s',
			'margin-bottom': '-277px'
		});
		$(anime_item_3).css({
			'transition': '0.5s',
			'margin-bottom': '-277px'
		});
		$(anime_item_4).css({
			'transition': '0.5s',
			'margin-bottom': '-232px'
		});
		$(anime_item_5).css({
			'transition': '0.5s',
			'margin-bottom': '-225px'
        });

		setTimeout(function(){

            if(getWindowWidth() > 800){
                $(anime_item_1).css({
                    'transition': '5s',
                    'transform': 'translate(0, -180px)'
                });
                $(anime_item_2).css({
                    'transition': '3s',
                    'transform': 'translate(0, -84px)'
                });
                $(anime_item_3).css({
                    'transition': '3s',
                    'transform': 'translate(0, -110px)'
                });
                $(anime_item_4).css({
                    'transition': '4s',
                    'transform': 'translate(0, -270px)'
                });
                $(anime_item_5).css({
                    'transition': '5s',
                    'transform': 'translate(0, -520px)'
                });
            } else {
                $(anime_item_1).css({
                    'transition': '3s',
                    'transform': 'translate(0, -68px)'
                });
                $(anime_item_2).css({
                    'transition': '3s',
                    'transform': 'translate(0, -70px)'
                });
                $(anime_item_3).css({
                    'transition': '3s',
                    'transform': 'translate(0, -110px)'
                });
                $(anime_item_4).css({
                    'transition': '4s',
                    'transform': 'translate(0, -270px)'
                });
                $(anime_item_5).css({
                    'transition': '3s',
                    'transform': 'translate(0, -225px)'
                });
            }

		}, 500);
	}
	// < -- анимация самолетиков


	//preload ->
	function closePreload(){
		$(".ripple").stop().animate({marginLeft: "4500px"},{duration: '1'});
		$('.ripple').css('animation-duration', '1s');
		setTimeout(function(){
			$(".preloader").fadeOut(300);
			startAnime();
		}, 400);
    }

	setTimeout(closePreload, 6000);

	$(window).on("load", function (e) {
        setTimeout(closePreload, 2000);
	});
	//<- preload


    //плавная прокрутка до якорей ->
    $(".header_block_menu a[href^='#']").click(function(){
        var _href = $(this).attr("href");
        _href = $(_href).offset().top;
        var window_pos = $(this).attr('data-pos');
        window_pos = parseFloat(_href) + parseFloat(window_pos);
        $("html, body").stop().animate({scrollTop: window_pos + "px"});

		$('.header_block_burger').removeClass('active');
		$('.header_block_menu').removeClass('active');
        return false;
    });

    $(".header_block_catalog_link").click(function(){
        var _href = $(this).attr("href");
        _href = $(_href).offset().top;
        var window_pos = $(this).attr('data-pos');
        window_pos = parseFloat(_href) + parseFloat(window_pos);
        $("html, body").stop().animate({scrollTop: window_pos + "px"});
        return false;
    });
    //<- плавная прокрутка до якорей


    //ленивая подгрузка изображений ->
    if(getWindowWidth() > 500){
        var lazy_src = 'data-src';
    } else {
        var lazy_src = 'data-src-mob';
    }

    var lazy = $(".lazy-load").lazy({
        attribute: lazy_src,
        effect: 'fadeIn',
        threshold: 300,
        visibleOnly: true,
        chainable: false
    });

    function update_lazy(){
        lazy.update([true]);
    }
    //<- ленивая подгрузка изображений


	// popup window form content -->>
	$('.popup_block_contet_form_show_form_btn').on('click', function(){
        $('.popup_block_contet').addClass('form_state_send');
        update_lazy();
	});

	$('.popup_block_contet_go_back_btn').on('click', function(){
		$('.popup_block_contet').removeClass('form_state_send');
	})

	// popup window form content <<--

	// mod menu -->>

	$('.header_block_burger').on('click', function(){
		if($(this).hasClass('active')){
			$('.header_block_burger').removeClass('active');
			$('.header_block_menu').removeClass('active');
		} else {
			$('.header_block_burger').addClass('active');
			$('.header_block_menu').addClass('active');
		}
	});
	// mod menu <<--


    // popup forms ------->>>>>>
	function closePopup(){
		$('.popup_block').removeClass('active');
	}

	function popupInit(this_item){
		$('.popup_block').addClass('active');

		update_lazy();
	}
    // popup forms <<<<<<------


    //форма обратной связи ->
    //Регулярки для проверки полей
    var modalObj = {
		reg_name: /^(\s{0,3}[А-Яа-яЁёA-Za-z]{2,12}){1,3}\s{0,3}$/,
    	reg_phone: /^[\s|\d|\+|\-|\(|\)]{5,22}$/,
    	reg_num: /^([\+|\-|\(|\)|\s]{0,3}\d[\+|\-|\(|\)|\s]{0,3}){1,5}$/,
		reg_email: /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.[a-z]{2,8}$/i,
		form_title: '',
		form_name: '',
		form_state: 1,
		form_validation: false,
		form_btn: '',
		error_message: ''
	}

	//обозначение ошибочных полей
	$('body').append('<style>.invalid_input{border-bottom: 1px solid #FF0000 !important;}</style>');

    //удаление предупреждения ошибки ввода
    $(document).click(function () {
        $('.error_message_block').remove();
		$('.invalid_input').removeClass('invalid_input');
    });

    //form send
    $('.footer_block_form_btn').click(function () {
		modalObj.btn = $(this);

		modalObj.form_name = $(this).attr('data-form-name');
		modalObj.form_title = $(this).attr('data-form-title');

        //небольшой таймаут для определения валидности форм
        setTimeout(function () {
            modalObj.form_validation = true; //начальное значение валидности истинно
			modalObj.error_message = '';

            //получаем значения с инпутов и проверяем валидность
            var user_name = $(modalObj.btn).parent().parent().find('input[name="user_name"]');
			var user_name_val = $(user_name).val();
            if (user_name_val.length < 2) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Имя не может содержать меньше 2-х букв</span>';
				$(user_name).addClass('invalid_input');
            } else if (!modalObj.reg_name.test(user_name_val)) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Имя может содержать только буквы</span>';
				$(user_name).addClass('invalid_input');
            }

            var user_email = $(modalObj.btn).parent().parent().find('input[name="user_email"]');
			var user_email_val = $(user_email).val();
            if (user_email_val.length == 0) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Поле \"E-mail\" обязательно к заполнению</span>';
				$(user_email).addClass('invalid_input');
            } else if (!modalObj.reg_email.test(user_email_val) && !modalObj.reg_email.test(user_email_val)) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Недопустимый номер телефона или адрес электронной почты</span>';
				$(user_email).addClass('invalid_input');
            }

            var user_phone = $(modalObj.btn).parent().parent().find('input[name="user_phone"]');
			var user_phone_val = $(user_phone).val();
            if (user_phone_val.length == 0) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Поле \"Телефон\" обязательно к заполнению</span>';
				$(user_phone).addClass('invalid_input');
            } else if (!modalObj.reg_phone.test(user_phone_val) && !modalObj.reg_email.test(user_phone_val)) {
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Недопустимый номер телефона или адрес электронной почты</span>';
				$(user_phone).addClass('invalid_input');
            }

            var user_msg = $(modalObj.btn).parent().parent().find('textarea[name="user_message"]');
            var user_msg_val = $(user_msg).val();
            if(user_msg_val == '' || user_msg_val.length < 5){
                modalObj.form_validation = false;
                modalObj.error_message += '<span class="error_message">Нужно описать задачу</span>';
				$(user_msg).addClass('invalid_input');
            }

			if(modalObj.form_validation == false){
				$('body').append('<div class="error_message_block"><div class="error_message_title">Ошибки при заполнении формы:</div><div class="error_message_text">'+modalObj.error_message+'</div></div>');

				$('.error_message_block').css({
					'display': 'flex',
					'flex-direction': 'column',
					'align-items': 'center',
					'justify-content': 'center',
					'position': 'fixed',
					'z-index': '99999',
					'left': '0',
					'bottom': '0',
					'right': '0',
					'width': '100vw',
					'height': 'auto',
					'padding': '15px 15px',
					'background': 'red',
				});

				$('.error_message_title').css({
					'color': '#fff',
					'font-size': '16px',
					'padding-bottom': '10px',
					'letter-spacing': '0.5px'
				});

				$('.error_message').css({
					'display': 'block',
					'color': '#fff',
					'font-size': '14px',
					'padding-bottom': '5px',
					'letter-spacing': '0.2px'
				});
			}

            //если хоть одна форма вернула false, сообщение не будет отправлено
            if (modalObj.form_validation == true && modalObj.form_state == 1) {
				modalObj.form_state = 0;

                $.ajax({
                    url: "components/sendmail.php", // куда отправляем
                    type: "post", // метод передачи
                    dataType: "json", // тип передачи данных
                    data: { // что отправляем
                        "form_name": modalObj.form_name,
                        "user_name": user_name_val,
                        "user_email": user_email_val,
                        "user_phone": user_phone_val,
						"user_msg": user_msg_val,
						"msg_theme": modalObj.form_title
                    },
                    // после получения ответа сервера
                    success: function (data) {
						modalObj.form_state = 1;

                        $('input').each(function(){
							$(this).val('');
						});

						$('textarea').each(function(){
							$(this).val('');
                        });

                        $('.footer_block_form_thx_msg').show();
                        $('.footer_block_form_btn').addClass('display_none');

                        setTimeout(function () {
                            $('.footer_block_form_thx_msg').hide();
                            $('.footer_block_form_btn').removeClass('display_none');
                        }, 12000);
                    },
                    error: function (xhr, str) {
                        alert('Возникла ошибка: ' + xhr.responseCode + xhr);
                    }
                });
            }
	    }, 200);
    });
    //<- форма обратной связи

    //maps -->>
    function start() {
        if (window.ymaps) {
            ymaps.ready(init);

            function init() {

                var myMap;

                myMap = new ymaps.Map("map", {
                    center: [58.590718, 49.640212],
                    zoom: 16,
                    controls: []
                });

                var myPlacemark = new ymaps.Placemark([58.590718, 49.640212], {
                    iconCaption: '610035, г. Киров, ул. Тургенева, 16. +7 (8332) 45-04-14',
                    hintContent: '610035, г. Киров, ул. Тургенева, 16. +7 (8332) 45-04-14'
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: '/assets/img/map_pointer.png',
                    iconImageSize: [75, 90],
                    iconImageOffset: [-37, -90]
                });

                myMap.geoObjects.add(myPlacemark);

                myMap.behaviors.disable('scrollZoom');
                myMap.controls.add('zoomControl');

            }
        } else setTimeout(start, 100);
    };

    var map_block = $('.map_block');
    var map_block_state = $(map_block).css('display');
    var map_state = 0;

    if(map_state == 0 && map_block_state != 'none'){
		var element = document.createElement("script");
		element.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
		document.body.appendChild(element);

        start();
        map_state = 1;
    }

    $(window).on('scroll', function(){
        map_block_state = $(map_block).css('display');

        if(map_state == 0 && map_block_state != 'none'){
            var element = document.createElement("script");
            element.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
            document.body.appendChild(element);

            start();
            map_state = 1;
        }
    });
    //<<-- maps

});