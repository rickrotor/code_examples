$( document ).ready(function() {
    //lazy load
    $(function() {
        $('.lazy').Lazy({
            effect: 'fadeIn'
        });
    });

// ----------CALLBACK FORM----------------
// FOREIGN PAGE POPUP AND CALLBACK FORM

    $('.foreign_form_button').click(function(){
        $('.callback_modal_overlay').show();
        $('.callback_modal_window').show();
    });
    $('.modal_close_button').click(function(){
        $('.callback_modal_overlay').hide();
        $('.callback_modal_window').hide();
    });
    $('.callback_modal_overlay').click(function(){
        $('.callback_modal_overlay').hide();
        $('.callback_modal_window').hide();
    });
    (function () {
        //переменная для проверки правильности формы
        var reg_name = /^\s{0,3}[А-Яа-яЁёA-Za-z]+\s{0,3}[А-Яа-яЁёA-Za-z]+\s{0,3}[А-Яа-яЁёA-Za-z]+\s{0,3}$/;
        var reg_email = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(su|ru|com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i;
        var reg_message = /^[^\<\>\{\}\^\\]{0,200}$/;
        var name_valid;
        var email_valid;
        var message_valid;
        var defend_valid;
        var user_name;
        var user_email;
        var user_message;
        var form_name;

        $('form').find('input').on('input', function () {
            if($(this).attr('class') == 'form_input_name'){
                user_name = $(this).val();
                if(user_name.length > 1 && reg_name.test(user_name)){
                    name_valid = true;
                    $(this).parent().find('.modal_name_valid_icon').css('display','block');
                    $('.foreign_img_3').css('display', 'none');
                } else {
                    name_valid = false;
                    $(this).parent().find('.modal_name_valid_icon').css('display','none');
                    $('.foreign_img_3').css('display', 'inline');
                }
            }
            if($(this).attr('class') == 'form_input_email'){
                user_email = $(this).val();
                if(reg_email.test(user_email)){
                    email_valid = true;
                    $(this).parent().find('.modal_email_valid_icon').css('display','block');
                } else {
                    email_valid = false;
                    $(this).parent().find('.modal_email_valid_icon').css('display','none');
                }
            }
        });
        $('form').find('textarea').on('input', function () {
            if($(this).attr('class') == 'form_input_message'){
                user_message = $(this).val();
                if(reg_message.test(user_message)){
                    message_valid = true;
                    $(this).parent().find('.modal_message_valid_icon').css('display','block');
                } else {
                    message_valid = false;
                    $(this).parent().find('.modal_message_valid_icon').css('display','none');
                }
            }
        });
        //функция при нажатии на кнопку
        $('.callback_modal_window_button').click(function(){
            var form_name = $(this).attr('data-form-name');
            var form_title = $(this).attr('data-form-title');
            defend_valid = $(this).parent().find('.defender_input').val();
            if(name_valid == 1 && email_valid == 1 && message_valid == 1 && defend_valid == ""){
                $.ajax({
                    url: "components/sendmail.php", // куда отправляем
                    type: "post", // метод передачи
                    dataType: "json", // тип передачи данных
                    data: { // что отправляем
                    "user_name": user_name,
                    "user_email": user_email,
                    "user_msg": user_message,
                    "form_name": form_name,
                    "msg_theme": form_title
                    },
                    // после получения ответа сервера
                    success: function(data){
                        $('.send_confirmation').show();
                        $('.callback_modal_window').find('form').hide();
                        $('.callback_modal_window_title').hide();
                        $('.foreign_img_1').hide();
                        $('.foreign_img_2').hide();
                        $('.foreign_img_3').hide();
                        $('.foreign_img_4').hide();
                        $('form').find('input').val(''); //сбрасываем поля инпутов на пустые
                        $('form').find('textarea').val(''); //сбрасываем поля инпутов на пустые
                        $('.modal_inp_valid_icon').css('display','none');
                        setTimeout(function(){ //после паузы удаляем инфо о отправке сообщения
                            $('.send_confirmation').hide();
                            $('.callback_modal_window').find('form').css('display', 'block');
                            $('.callback_modal_window_title').css('display', 'block');
                            $('.foreign_img_1').css('display', 'inline');
                            $('.foreign_img_2').css('display', 'inline');
                            $('.foreign_img_3').css('display', 'inline');
                            $('.foreign_img_4').css('display', 'inline');
                        }, 10000);
                    },
                    error: function (xhr, str) {
                        alert('Возникла ошибка: ' + xhr.responseCode + xhr);
                    }
                });
            }
        });
    }());


});