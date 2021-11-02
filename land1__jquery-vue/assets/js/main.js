//functions -->>
function getWindowWidth() {
  let div = document.createElement("div");

  div.style.overflowY = "scroll";
  div.style.width = "50px";
  div.style.height = "50px";

  document.body.append(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();

  let window_width = $(window).width() + scrollWidth;

  return window_width;
}
//functions <<--


$(document).ready(function () {
  //lazyload -->
  var lazy = $(".lazy-load").lazy({
    attribute: "data-src",
    effect: "fadeIn",
    threshold: 300,
    visibleOnly: true,
    chainable: false,
  });

  function update_lazy() {
    lazy.update([true]);
  }
  //lazyload <--


  //wow animate -->>
  new WOW().init();
  //wow animate <<--


  //tabs -->>
  $(".tab_block_control_btn").on("click", function () {
    $(".tab_block_control_btn").removeClass("active");
    $(".tab_block_info_item").removeClass("active");

    var num = $(this).attr("data-tab-num");

    $(".tab_block_control_btn_" + num).addClass("active");
    $(".tab_block_info_item_" + num).addClass("active");
  });
  //tabs <<--


  //gall grid -->>
  $(".ourworks_block_more_btn").on("click", function () {
    var num = $(this).attr("data-current-grid-num");
    var max_num = $(this).attr("data-max-grid-num");

    for (let i = 1; i <= num; i++) {
      $(".ourworks_block_grid_" + num).addClass("active");
    }

    $(this).attr("data-current-grid-num", ++num);

    if (num > max_num) {
      $(this).hide();
    }
  });
  //gall grid <<--


  //sliders -->
  /* license slider --> */
  if (getWindowWidth() > 900) {
    var license_block_slider = $(".license_block_slider_desktop");
  } else {
    var license_block_slider = $(".license_block_slider_mobile");
  }

  license_block_slider.owlCarousel({
    items: 1,
    loop: true,
    lazyLoad: true,
    navContainer: ".license_block_slider_nav",
    navElement: "div",
    autoWidth: false,
    nav: true,
    dots: true,
    responsive: {
      0: {
        margin: 25,
        items: 2,
        mouseDrag: true,
        center: false,
      },
      550: {
        margin: 25,
        items: 3,
        mouseDrag: true,
        center: false,
      },
      900: {
        margin: 0,
        items: 1,
        mouseDrag: false,
        center: true,
      },
    },
    onInitialized: function (e) {
      if (this.items().length >= 9) {
        $(".license_block_slider_counter").html(
          '<span class="active">01</span>/' + this.items().length
        );
      } else {
        $(".license_block_slider_counter").html(
          '<span class="active">01</span>/0' + this.items().length
        );
      }
    },
  });

  license_block_slider.on("changed.owl.carousel", function (e) {
    var item_index =
      (e.property.value - Math.ceil(e.item.count / 2)) % e.item.count || 0;
    item_index += 1;

    if (e.item.count >= 9) {
      if (item_index >= 9) {
        $(".license_block_slider_counter").html(
          '<span class="active">' + item_index + "</span>/" + e.item.count
        );
      } else {
        $(".license_block_slider_counter").html(
          '<span class="active">0' + item_index + "</span>/" + e.item.count
        );
      }
    } else {
      if (item_index >= 9) {
        $(".license_block_slider_counter").html(
          '<span class="active">' + item_index + "</span>/0" + e.item.count
        );
      } else {
        $(".license_block_slider_counter").html(
          '<span class="active">0' + item_index + "</span>/0" + e.item.count
        );
      }
    }
  });
  /* license slider <-- */
  //sliders <<--


  // mod menu -->>
  $(".nav_block_burger").on("click", function () {
    if ($(this).hasClass("active")) {
      $(".nav_block_burger").removeClass("active");
      $(".nav_block_container").removeClass("active");
      $(".nav_block").removeClass("menu-active");
    } else {
      $(".nav_block_burger").addClass("active");
      $(".nav_block_container").addClass("active");
      $(".nav_block").addClass("menu-active");
    }
  });

  $(".nav_block_container_overlay").on("click", function () {
    $(".nav_block_burger").removeClass("active");
    $(".nav_block_container").removeClass("active");
    $(".nav_block").removeClass("menu-active");
  });
  // mod menu <<--


  /* menu and refer link --> */
  $(".nav_block_anchor").click(function () {
    var _href = $(this).attr("href");
    _href = $(_href).offset().top;
    var window_pos = $(this).attr("data-pos");
    window_pos = parseFloat(_href) + parseFloat(window_pos);
    $("html, body")
      .stop()
      .animate({ scrollTop: window_pos + "px" });

    $(".nav_block_burger").removeClass("active");
    $(".nav_block_container").removeClass("active");
    $(".nav_block").removeClass("menu-active");
    return false;
  });
  /* menu and refer link <-- */


  //maps -->>
  var map_block = $(".map_block_content").get(0);
  var map_block_state;
  var map_state = 0;

  function start() {
    if (window.ymaps) {
      ymaps.ready(init);

      var windowWidth = getWindowWidth();

      if (windowWidth >= 1000) {
        mapPositionY = 58.606436;
        mapPositionX = 49.640435;
      } else if (windowWidth >= 500 && windowWidth < 1000) {
        mapPositionY = 58.606436;
        mapPositionX = 49.638235;
      } else {
        mapPositionY = 58.606436;
        mapPositionX = 49.638235;
      }

      function init() {
        var myMap;

        myMap = new ymaps.Map("map", {
          center: [mapPositionY, mapPositionX],
          zoom: 17,
          controls: [],
        });

        var myPlacemark = new ymaps.Placemark(
          [58.606436, 49.638235],
          {
            iconCaption: "ООО «Оконный эксперт»",
            hintContent: "ООО «Оконный эксперт»",
          },
          {
            iconLayout: "default#image",
            iconImageHref: "./assets/img/map_pointer.svg",
            iconImageSize: [156, 167],
            iconImageOffset: [-78, -83],
          }
        );

        myMap.geoObjects.add(myPlacemark);

        //myMap.behaviors.disable('scrollZoom');
        //myMap.controls.add('zoomControl');

        $(".contact_block_checkmap_btn").bind("click", function () {
          myMap.container.fitToViewport();
        });
      }
    } else setTimeout(start, 100);
  }

  function checkMapState() {
    let map_pos = $(map_block).offset().top;

    if ($(this).scrollTop() > map_pos - 1800) {
      if ($(map_block).get(0) != undefined) {
        map_block_state = $(map_block).css("display");

        if (map_state == 0 && map_block_state != "none") {
          var element = document.createElement("script");
          element.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
          document.body.appendChild(element);

          start();
          map_state = 1;
        }
      }
    }
  }

  if (map_block != undefined) {
    checkMapState();

    $(window).on("scroll", function () {
      checkMapState();
    });
  }
  //<<-- maps


  // calc --->>
  var calc_block = new Vue({
    el: ".calc_block",
    data: {
      step_num: 1,
      active_item: 1,
      item_count: 1,
      add_btn_state: true,
      orderNumber: '0000',
      sliders: {},
      user_phone: '',
      thx_msg_state: false,
      error_msg: '',
      error_msg_state: false,
      form_state: true,
      inputSizeVert: 0,
      inputSizeHoriz: 0,
      type_options: {
        deaf_text: 'Глухая',
        rotary_text: 'Поворотная',
        swingout_text: 'Поворотно-откидная',
        moskit_text: 'москитная сетка',
        child_text: 'детский замок',
      },
      addition_options: {
        active_option_info: {
          delivery: 1,
          lift: 1,
          montage: 1,
        },
        delivery: {
          1: {
            name: 'Киров',
          },
          2: {
            name: 'Кировская область',
          },
          3: {
            name: 'Самовывоз',
          },
        },
        lift: {
          1: {
            name: 'Грузовой лифт',
          },
          2: {
            name: 'Пассажирский лифт',
          },
          3: {
            name: 'Лифта нет',
          },
          4: {
            name: 'Подъём не требуется',
          },
        },
        montage: {
          1: {
            name: 'Без демонтажа',
          },
          2: {
            name: 'С демонтажом',
          },
          3: {
            name: 'Без монтажа',
          },
        }
      },
      item_options: {
        1: {}
      },
      item_sample: {
        activeStatus: false,
        where_text: "Квартира",
        active_where_option: 1,
        count_text: "Одна",
        count_all: 1,
        active_count_option: 1,
        vert_size: 1000,
        horiz_size: 1500,
        size_options: {
          windowsill: {
            text: 'Подоконник',
            state: false,
          },
          slopes: {
            text: 'Откосы',
            state: false
          },
          tides: {
            text: 'Отливы',
            state: false
          },
          pvh: {
            text: 'ПВХ',
            state: false
          },
          plaster: {
            text: 'Штукатурные',
            state: false
          },
          thermalpumps: {
            text: 'Термооткосы',
            state: false
          },
        },
        type_options: {
          1: {
            deaf_state: true,
            rotary_state: false,
            swingout_state: false,
            moskit_state: false,
            child_state: false,
          },
          2: {
            deaf_state: true,
            rotary_state: false,
            swingout_state: false,
            moskit_state: false,
            child_state: false,
          },
          3: {
            deaf_state: true,
            rotary_state: false,
            swingout_state: false,
            moskit_state: false,
            child_state: false,
          },
        }
      }
    },
    methods: {
      printCountText: function(index){
        var self = this;
        var text = 'Створка';

        if(self.item_options[index]['active_count_option'] == 1 && self.item_options[index]['active_count_option'] < self.item_options[index]['count_all']){
          text = 'Левая створка';
        }

        if(self.item_options[index]['active_count_option'] == 2 && self.item_options[index]['active_count_option'] < self.item_options[index]['count_all']){
          text = 'Центральная створка';
        }

        if(self.item_options[index]['active_count_option'] == 2 && self.item_options[index]['active_count_option'] == self.item_options[index]['count_all']){
          text = 'Правая створка';
        }

        if(self.item_options[index]['active_count_option'] == 3 && self.item_options[index]['active_count_option'] == self.item_options[index]['count_all']){
          text = 'Правая створка';
        }
        
        return text;
      },
      printAdditionOptionText: function(itemIndex){
        var self = this;

        var text = '';
        
        if(self.item_options[itemIndex].size_options.windowsill.state){
          text += 'Подоконник, ';
        }
        if(self.item_options[itemIndex].size_options.slopes.state){
          text += 'Откосы - ';
          if(self.item_options[itemIndex].size_options.pvh.state){
            text += 'ПВХ, ';
          }
          if(self.item_options[itemIndex].size_options.plaster.state){
            text += 'Штукатурные, ';
          }
          if(self.item_options[itemIndex].size_options.thermalpumps.state){
            text += 'Термооткосы, ';
          }
        }
        if(self.item_options[itemIndex].size_options.tides.state){
          text += 'Отливы, ';
        }

        text = text.replace(/,\s*$/, "");

        return text;
      },
      printAccessoriesText: function(itemIndex){
        var self = this;

        var text = '';

        var isset_moskit = false;
        var isset_child = false;

        for(let option_index of Object.keys(self.item_options[itemIndex].type_options)){
          if(self.item_options[itemIndex].type_options[option_index].moskit_state == true && isset_moskit == false){
            text += self.type_options.moskit_text + ', ';
            isset_moskit = true;
          }

          if(self.item_options[itemIndex].type_options[option_index].child_state == true && isset_child == false){
            text += self.type_options.child_text + ', ';
            isset_child = true;
          }
        }

        text = text.replace(/,\s*$/, "");

        return text;
      },
      setActiveWhereOption: function(index, num, text){
        var self = this;

        self.item_options[index]['active_where_option'] = num;
        self.item_options[index]['where_text'] = text;
      },
      setActiveCountOption: function(index, num, text){
        var self = this;

        self.item_options[index]['count_all'] = num;
        self.item_options[index]['count_text'] = text;
      },
      changeTypeOption: function(index, option_name){
        var self = this;

        var active_count_option = self.item_options[index]['active_count_option'];

        self.item_options[index]['type_options'][active_count_option]['deaf_state'] = false;
        self.item_options[index]['type_options'][active_count_option]['rotary_state'] = false;
        self.item_options[index]['type_options'][active_count_option]['swingout_state'] = false;

        self.item_options[index]['type_options'][active_count_option]['moskit_state'] = false;
        self.item_options[index]['type_options'][active_count_option]['child_state'] = false;

        self.item_options[index]['type_options'][self.item_options[index]['active_count_option']][option_name] = true;
      },
      changeTypeSuboption: function(index, option_name){
        var self = this;

        if(self.item_options[index]['type_options'][self.item_options[index]['active_count_option']][option_name] == true){
          self.item_options[index]['type_options'][self.item_options[index]['active_count_option']][option_name] = false;
        } else {
          self.item_options[index]['type_options'][self.item_options[index]['active_count_option']][option_name] = true;
        }
      },
      changeSizeOption: function(index, option_name){
        var self = this;

        if(self.item_options[index]['size_options'][option_name]['state'] == true){
          self.item_options[index]['size_options'][option_name]['state'] = false;
        } else {
          self.item_options[index]['size_options'][option_name]['state'] = true;
        }

        if(option_name == 'slopes'){
          if(self.item_options[index]['size_options']['slopes']['state'] == true){
            self.item_options[index]['size_options']['pvh']['state'] = true;
          } else {
            self.item_options[index]['size_options']['pvh']['state'] = false;
            self.item_options[index]['size_options']['plaster']['state'] = false;
            self.item_options[index]['size_options']['thermalpumps']['state'] = false;
          }
        }
      },
      changeSizeSuboption: function(index, option_name){
        var self = this;

        self.item_options[index]['size_options']['pvh']['state'] = false;
        self.item_options[index]['size_options']['plaster']['state'] = false;
        self.item_options[index]['size_options']['thermalpumps']['state'] = false;

        self.item_options[index]['size_options'][option_name]['state'] = true;
      },
      changeAdditionOption: function(optionIndex, option_name){
        var self = this;

        if(self.addition_options.active_option_info[option_name] != optionIndex){
          self.addition_options.active_option_info[option_name] = optionIndex;
        }
      },
      randomNum: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      randomString: function(i) {
        var rnd = '';
        while (rnd.length < i) 
            rnd += Math.random().toString(36).substring(2);
        return rnd.substring(0, i);
      },
      createOrderNumber: function(){
        var self = this;

        self.orderNumber = self.randomString(4) + '-' + self.randomNum(1000, 9999);
      },
      changeStepInfo: function () {
        var self = this;
  
        if(self.step_num == 3){
          $('.calc_block_step_row_size_img img').attr('src', './assets/img/calc_size_img_' + self.item_options[self.active_item]['count_all'] + '.svg')
        }
  
        if(self.step_num == 4){
          $('.calc_block_step_row_type_window_img img').attr('src', './assets/img/calc_size_img_' + self.item_options[self.active_item]['count_all'] + '.svg')
        }
      },
      stepChangeDown: function (step_btn) {
        var self = this;
  
        self.step_num = parseInt(self.step_num) - 1;
  
        self.changeStepInfo();
      },
      stepChangeUp: function () {
        var self = this;
    
        self.step_num = parseInt(self.step_num) + 1;
  
        self.changeStepInfo();
      },
      stepChangeDownFromTypeOption: function(index){
        var self = this;
    
        if(self.item_options[index]['active_count_option'] == 1){
          self.step_num = parseInt(self.step_num) - 1;
  
          self.changeStepInfo();
        } else {
          self.item_options[index]['active_count_option'] = parseInt(self.item_options[index]['active_count_option']) - 1;
        }
      },
      stepChangeUpFromTypeOption: function(index){
        var self = this;
    
        if(self.item_options[index]['active_count_option'] == self.item_options[index]['count_all']){
          self.step_num = parseInt(self.step_num) + 1;
  
          self.changeStepInfo();
        } else {
          self.item_options[index]['active_count_option'] = parseInt(self.item_options[index]['active_count_option']) + 1;
        }
      },
      itemAdd: function(){
        var self = this;

        var new_index = parseInt(self.item_count) + 1;

        this.$set(self.item_options, new_index, JSON.parse(JSON.stringify(self.item_sample)));

        self.active_item = new_index;

        self.step_num = 1;

        self.item_count = parseInt(self.item_count) + 1;

        self.inputSizeVert = self.item_options[new_index]['vert_size'];
        self.inputSizeHoriz = self.item_options[new_index]['horiz_size'];

        if(self.item_count >= 3){
          self.add_btn_state = false;
        } else {
          self.add_btn_state = true;
        }

        this.$nextTick(function () {
          self.sizeSliderInit(new_index);
        });
      },
      editItem: function(index){
        var self = this;

        self.step_num = 1;
        self.active_item = index;
        self.item_options[index]['active_count_option'] = 1;
      },
      shiftItemsProps: function(index){
        var self = this;

        var clear_position = index;
        var change_position = parseInt(index) + 1;

        while(change_position <= 3){
          if(self.item_options[change_position]){
            this.$set(self.item_options, clear_position, JSON.parse(JSON.stringify(self.item_options[change_position])));

            delete self.item_options[change_position];
          }

          clear_position = parseInt(clear_position) + 1;
          change_position = parseInt(change_position) + 1;
        }
      },
      removeItem: function(index){
        var self = this;

        for(let index of Object.keys(self.sliders)){
          self.sliders[index]['vert_slider'].noUiSlider.destroy();
          self.sliders[index]['horiz_slider'].noUiSlider.destroy();  
        }
        self.sliders = {};


        delete self.item_options[index];

        self.shiftItemsProps(index);

        self.item_count = parseInt(self.item_count) - 1;

        self.sliders = {};

        if(self.item_count == 0){
          self.itemAdd();
          return false;
        }

        self.active_item = 1;

        if(self.item_count < 3){
          self.add_btn_state = true;
        } else {
          self.add_btn_state = false;
        }

        this.$nextTick(function () {
          for(let index of Object.keys(self.item_options)){
            self.sizeSliderInit(index);
          }
        });
      },
      doubleItem: function(index){
        var self = this;

        if(self.item_count == 3){
          alert('Максимальное количество окон - 3');
          return false;
        }

        var new_index = parseInt(self.item_count) + 1;

        this.$set(self.item_options, new_index, JSON.parse(JSON.stringify(self.item_options[index])));

        self.active_item = new_index;

        self.item_count = parseInt(self.item_count) + 1;

        if(self.item_count >= 3){
          self.add_btn_state = false;
        }

        this.$nextTick(function () {
          self.sizeSliderInit(new_index);
        });
      },
      sendCalcForm: function(){
        var self = this;

        self.error_msg = '';
        self.error_msg_state = false;

        var reg_phone = /^[\s|\d|\+|\-|\(|\)]{5,22}$/;

        //
        setTimeout(function () {
          var form_validation = true;

          //проверка полей
          if (self.user_phone.length < 5) {
            form_validation = false;
            self.error_msg = 'Введите телефон';
            self.error_msg_state = true;
            return false;
          } else if (!form_obj.reg_phone.test(self.user_phone)) {
            form_validation = false;
            self.error_msg = 'Недопустимый номер телефона';
            self.error_msg_state = true;
          }

          //отправка формы
          if (form_validation == true && self.form_state == true) {
            self.form_state = false;

            $.ajax({
              url: "components/sendmail.php",
              type: "post",
              dataType: "json",
              data: {
                prezident: 'medvedev',
                form_name: 'calc',
                form_title: 'Заявка с калькулятора',
                form_theme: 'Заявка № ' + self.orderNumber + ' – оконныйэксперт.рф',
                form_products: self.item_options,
                user_phone: self.user_phone,
                form_addition: self.addition_options,
                form_type_options: self.type_options,
              },
              success: function (data) {
                self.form_state = true;

                self.user_phone = '';

                self.thx_msg_state = true;

                setTimeout(function () {
                  self.thx_msg_state = false;
                }, 10000);
              },
              error: function (xhr, str) {
                alert("Error: " + xhr.responseCode + xhr);
              },
            });
          }
        }, 200);

      },
      sizeSliderInit: function(index){
        var self = this;

        var windowWidth = getWindowWidth();

        var orientation = '';

        if(windowWidth > 1000){
          orientation = 'vertical';
        } else {
          orientation = 'horizontal';
        }

        self.sliders[index] = {};
        
        self.sliders[index]['vert_slider_result'] = $('#calc_block_step_row_size_vertical_size_info_' + index);
        self.sliders[index]['vert_slider'] = $('#calc_block_step_row_size_vertical_size_' + index)[0];
        noUiSlider.create(self.sliders[index]['vert_slider'], {
          start: [self.item_options[index].vert_size],
          connect: [true, false],
          orientation: orientation,
          step: 1,
          range: {
              'min': [1],
              'max': [2000]
          }
        });
  
        self.sliders[index]['vert_slider'].noUiSlider.on('update', function (values, handle) {
          let value = parseInt(values[handle]);
          self.inputSizeVert = value;
        });
  
        self.sliders[index]['horiz_slider_result'] = $('#calc_block_step_row_size_horizontal_size_info_' + index);
        self.sliders[index]['horiz_slider'] = $('#calc_block_step_row_size_horizontal_size_' + index)[0];
        noUiSlider.create(self.sliders[index]['horiz_slider'], {
          start: [self.item_options[index].horiz_size],
          step: 1,
          range: {
              'min': [1],
              'max': [3000]
          }
        });
        
        self.sliders[index]['horiz_slider'].noUiSlider.on('update', function (values, handle) {
          let value = parseInt(values[handle]);
          self.inputSizeHoriz = value;
        });
      },
      init: function () {
        var self = this;
  
        self.createOrderNumber();
        self.sizeSliderInit(1);
      },
    },
    computed: {
    },
    watch: {
      inputSizeHoriz: function(){
        var self = this;

        var result = 0;

        if(!self.inputSizeHoriz){
          self.inputSizeHoriz = '';
          result = 1;
        } else {
          result = self.inputSizeHoriz.toString().replace(/[^\d]+/, '');
          self.inputSizeHoriz = result;

          if(result < 1){
            result = 1;
          }

          if(result > 10000){
            result = 10000;
            self.inputSizeHoriz = result;
          }
        }

        self.item_options[self.active_item]['horiz_size'] = result;
      },
      inputSizeVert: function(){
        var self = this;

        var result = 0;

        if(!self.inputSizeVert){
          self.inputSizeVert = '';
          result = 1;
        } else {
          result = self.inputSizeVert.toString().replace(/[^\d]+/, '');
          self.inputSizeVert = result;

          if(result < 1){
            result = 1;
          }

          if(result > 10000){
            result = 10000;
            self.inputSizeVert = result;
          }
        }

        self.item_options[self.active_item]['vert_size'] = result;
      }
    },
    created() {
      var self = this;

      self.item_options[1] = JSON.parse(JSON.stringify(self.item_sample));

      self.inputSizeVert = self.item_options[1]['vert_size'];
      self.inputSizeHoriz = self.item_options[1]['horiz_size'];

      $(function () {
        self.init();
      });
    },
  });
  // calc <<---


  //forms --->>>
  var form_obj = {
    form_title: "",
    form_name: "",
    form_theme: "",
    key: "greatrussia",
    reg_name: /^[ёЁа-яА-ЯA-Za-z\s]{2,30}$/,
    reg_phone: /^[\s|\d|\+|\-|\(|\)]{5,22}$/,
    reg_num: /^([\+|\-|\(|\)|\s]{0,3}\d[\+|\-|\(|\)|\s]{0,3}){1,5}$/,
    reg_email:
      /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.[a-z]{2,8}$/i,
    reg_phonemail:
      /^([\s|\d|\+|\-|\(|\)]{5,22})|(\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.[a-z]{2,8})$/i,
    form_title: "",
    form_name: "",
    form_state: true,
    form_validation: false,
    form_btn: "",
    error_state: false,
    form_init: function () {
      var self = this;

      //закрытие попап
      $(".callback_popup_block_close_btn").on("click", function () {
        $(".callback_popup_block").removeClass("active");
      });

      //открытие попап
      $(".nav_block_call_btn, .header_block_btn").on("click", function () {
        $(".callback_popup_block").addClass("active");

        self.form_title = $(this).attr("data-form-title");
        self.form_theme = $(this).attr("data-form-theme");
        self.form_name = $(".callback_popup_block_form_btn").attr(
          "data-form-name"
        );

        $(".callback_popup_block_form_btn").attr(
          "data-form-title",
          self.form_title
        );

        $(".callback_popup_block_form_btn").attr(
          "data-form-theme",
          self.form_theme
        );

        $(".callback_popup_block_title").text(self.form_title);
      });

      //отправка callback popup формы
      $(".callback_popup_block_form_btn").click(function () {
        var send_btn = $(this);

        self.callbackFormSend(send_btn);
      });

      //отправка callback формы
      $(".callback_block_form_btn").click(function () {
        var send_btn = $(this);

        self.form_title = $(send_btn).attr("data-form-title");
        self.form_name = $(send_btn).attr("data-form-name");
        self.form_theme = $(send_btn).attr("data-form-theme");

        self.callbackFormSend(send_btn);
      });

      //для скрытия ошибок
      $(document).click(function () {
        $(".error_message").remove();
      });
    },
    callbackFormSend: function (send_btn) {
      form_obj.btn = send_btn;

      //
      setTimeout(function () {
        form_obj.form_validation = true;

        //проверка полей
        var user_name = $(form_obj.btn).parent().find('input[name="name"]');
        var user_name_val = $(user_name).val();
        if (user_name_val.length < 2) {
          form_obj.form_validation = false;
          $(form_obj.btn)
            .parent()
            .find('[name="name"]')
            .parent()
            .append('<span class="error_message">Введите имя</span>');
          return false;
        } else if (
          user_name_val.length > 0 &&
          !form_obj.reg_name.test(user_name_val)
        ) {
          form_obj.form_validation = false;
          $(form_obj.btn)
            .parent()
            .find('[name="name"]')
            .parent()
            .append(
              '<span class="error_message">Имя может содержать только буквы</span>'
            );
          return false;
        }

        var user_phone = $(form_obj.btn).parent().find('input[name="phone"]');
        var user_phone_val = $(user_phone).val();
        if (user_phone_val.length < 5) {
          form_obj.form_validation = false;
          $(form_obj.btn)
            .parent()
            .find('[name="phone"]')
            .parent()
            .append('<span class="error_message">Введите телефон</span>');
          return false;
        } else if (!form_obj.reg_phone.test(user_phone_val)) {
          form_obj.form_validation = false;
          $(form_obj.btn)
            .parent()
            .find('[name="phone"]')
            .parent()
            .append(
              '<span class="error_message">Недопустимый номер телефона</span>'
            );
          return false;
        }

        //отправка формы
        if (form_obj.form_validation == true && form_obj.form_state == true) {
          form_obj.form_state = false;

          $.ajax({
            url: "components/sendmail.php",
            type: "post",
            dataType: "json",
            data: {
              prezident: form_obj.key,
              form_name: form_obj.form_name,
              form_title: form_obj.form_title,
              form_theme: form_obj.form_theme,
              user_name: user_name_val,
              user_phone: user_phone_val,
            },
            success: function (data) {
              form_obj.form_state = true;

              $("input").each(function () {
                $(this).val("");
              });

              $("textarea").each(function () {
                $(this).val("");
              });

              $('.callback_block_title').hide();
              $('.callback_block_form').hide();
              $('.callback_popup_block_title').hide();
              $('.callback_popup_block_form').hide();
              $(".popup_callback_form_thx").addClass("active");

              setTimeout(function () {
                $('.callback_block_title').show();
                $('.callback_block_form').show();
                $('.callback_popup_block_title').show();
                $('.callback_popup_block_form').show();
                $(".popup_callback_form_thx").removeClass("active");
              }, 10000);
            },
            error: function (xhr, str) {
              alert("Error: " + xhr.responseCode + xhr);
            },
          });
        }
      }, 200);
    },
  };

  form_obj.form_init();
  //<----- forms
  

});
