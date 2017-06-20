let myMap;

// let balloon = document.getElementById('balloonTemplate').innerHTML;
// console.log(balloon);

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init() {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [55.76, 37.64], // Москва
        zoom: 15,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });

    let balloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="balloon">' +
        '<div class="balloon__header">' +
        '<div class="balloon__location">$[title]</div>' +
        '<div class="balloon__close">&times</div></div>' +
        '<div class="balloon__content">' +
        '<div class="balloon__reviews"></div>' +
        '<div class="balloon__form">' +
        '<form action="" method="post" class="form">' +
        '<div class="form__title">ваш отзыв</div>' +
        '<label class="form__field textfield">' +
        '<input type="text" name="username" class="textfield__control" placeholder="Ваше имя">' +
        '</label>' +
        '<label class="form__field textfield">' +
        '<input type="text" name="username" class="textfield__control" placeholder="Ваше имя">' +
        '</label>' +
        '<label class="form__field textarea">' +
        '<textarea name="message" id="" cols="30" rows="10" class="textarea__control" placeholder="Ваш отзыв"></textarea>' +
        '</label>' +
        '<button class="form__btn" type="button">Сохранить</button>' +
        '</form></div></div></div>', {
            build: function () {
                this.constructor.superclass.build.call(this);
                this.$element = document.querySelector('.balloon');
                this.$element.querySelector('.balloon__close')
                    .addEventListener('click', this.onCloseClick.call(this));
            },
            clear: function () {
                this.$element.querySelector('.balloon__close')
                    .removeEventListener('click', this.onCloseClick.call(this));
                this.constructor.superclass.build.call(this);
            },
            onCloseClick: function () {
                this.balloon.close();
            }
        }
    );

    myMap.events.add('click', function (e) {
        var balloon1 = e.get('balloon');

        console.log(balloon1);
        if (!myMap.balloon.isOpen()) {
            let coords = e.get('coords');
            myMap.balloon.open(coords, {
                title: coords.toString()
            }, {
                layout: balloonLayout
            });
        } else {
            myMap.balloon.close();
        }
    });

    //
    // let myBalloonHeader = ymaps.templateLayoutFactory.createClass(
    //     '<div class="balloon__header">' +
    //     '<div class="balloon__location">$[address]</div></div>'
    // );
    // let myBalloonReviews = ymaps.templateLayoutFactory.createClass(
    //     '<div class="balloon__reviews">123</div>');
    // let myBalloonForm = ymaps.templateLayoutFactory.createClass(
    //     '<div class="balloon__form">' +
    //     '<form action="" method="post" class="form">' +
    //     '<div class="form__title">ваш отзыв</div>' +
    //     '<label class="form__field textfield">' +
    //     '<input type="text" name="username" class="textfield__control" placeholder="Ваше имя">' +
    //     '</label>' +
    //     '<label class="form__field textfield">' +
    //     '<input type="text" name="username" class="textfield__control" placeholder="Ваше имя">' +
    //     '</label>' +
    //     '<label class="form__field textarea">' +
    //     '<textarea name="message" id="" cols="30" rows="10" class="textarea__control" placeholder="Ваш отзыв"></textarea>' +
    //     '</label>' +
    //     '<button class="form__btn" type="button">Сохранить</button>' +
    //     '</form></div>'
    // );
    // let balloonTemplate = ymaps.templateLayoutFactory.createClass(
    //     '<div class="balloon__close">&times</div>' +
    //     '<div class="balloon">' +
    //         '$[[options.headerLayout]]' +
    //         '<div class="balloon__content">' +
    //             '$[[options.contentLayout]]' +
    //             '$[[options.footerLayout]] </div>', {
    //         build: function () {
    //             this.constructor.superclass.build.call(this);
    //
    //             this._$element = this.querySelector('.balloon');
    //
    //             console.log(this)
    //             // this._$element.find('.balloon__close')
    //             //     .on('click', $.proxy(this.onCloseClick, this));
    //         },
    //         clear: function () {
    //             this._$element.document.querySelector('.balloon__close')
    //                 .off('click');
    //
    //             this.constructor.superclass.clear.call(this);
    //         },
    //         onCloseClick: function (e) {
    //             e.preventDefault();
    //
    //             this.events.fire('userclose');
    //         }
    //     }
    // );
    //
    // // ymaps.layout.storage.add('balloon#header', myBalloonHeader);
    // // ymaps.layout.storage.add('balloon#reviews', myBalloonReviews);
    // // ymaps.layout.storage.add('balloon#form', myBalloonForm);
    // let balloon = new ymaps.Balloon(myMap);
    //
    // balloon.options.setParent(myMap.options);
    //
    // // Создание метки с пользовательским макетом балуна.
    // let myPlacemark = window.myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
    //     address: myMap.getCenter()
    // }, {
    //     balloonShadow: false,
    //     balloonHeaderLayout: myBalloonHeader,
    //     balloonContentLayout: myBalloonReviews,
    //     balloonFooterLayout: myBalloonForm,
    //     balloonLayout: balloonTemplate,
    //     balloonPanelMaxMapArea: 0
    //     // Не скрываем иконку при открытом балуне.
    //     // hideIconOnBalloonOpen: false,
    //     // И дополнительно смещаем балун, для открытия над иконкой.
    //     // balloonOffset: [3, -40]
    // });
    //
    // myMap.geoObjects.add(myPlacemark);
    //
    // // balloon.open(myMap.getCenter());
    //
    // // console.log(balloon);
    // // Обработка события, возникающего при щелчке
    // // левой кнопкой мыши в любой точке карты.
    // // При возникновении такого события откроем балун.
    // myMap.events.add('click', function (e) {
    //     if (!myMap.balloon.isOpen()) {
    //         let coords = e.get('coords');
    //         // console.log(e.get());
    //
    //         balloon.open(coords, {
    //             address: coords.toString()
    //         }, {
    //             headerLayout: myBalloonHeader,
    //             contentLayout: myBalloonReviews,
    //             footerLayout: myBalloonForm,
    //             layout: myBalloonHeader,
    //         })
    //         // myMap.balloon.open(coords, {
    //         //     contentHeader:'Событие!',
    //         //     contentBody:'<p>Кто-то щелкнул по карте.</p>' +
    //         //     '<p>Координаты щелчка: ' + [
    //         //         coords[0].toPrecision(6),
    //         //         coords[1].toPrecision(6)
    //         //     ].join(', ') + '</p>',
    //         //     contentFooter:'<sup>Щелкните еще раз</sup>'
    //         // },
    //         //     {
    //         //         // Опция: не показываем кнопку закрытия.
    //         //         closeButton: false
    //         //     });
    //         // myMap.openBalloon(coords, coords, {hasCloseButton: false});
    //
    //         // ymaps.geocode(coords).then(function (res) {
    //         //     let geoObject = res.geoObjects.get(0);
    //         //     console.log(ymaps)
    //         //
    //         //     ymaps.openBalloon(coords, {
    //         //         address: geoObject
    //         //     }, {
    //         //         // style: balloonTemplate
    //         //     });
    //         // });
    //
    //     } else {
    //         myMap.balloon.close();
    //     }
    // });
}