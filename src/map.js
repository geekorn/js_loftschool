let storage = require('./storage');
let random = require('./random');

module.exports = new function () {
    // объявление переменных
    let map,
        clusterer,
        balloon,
        reviews = []; // массив для хранения отзывов

    // приватные функции
    function getAddress(coords) {
        return ymaps.geocode(coords).then(result => result.geoObjects.get(0).getAddressLine());
    }
    function getCoords(address) {
        return ymaps.geocode(address).then(result => result.geoObjects.get(0).geometry.getCoordinates());
    }

    /**
     * создание макетов балуна и сохранение их в локальном хранилище
     */
    function createLayouts() {
        ymaps.layout.storage.add('balloon#reviews', ymaps.templateLayoutFactory.createClass(
            '{% if reviews.length %}' +
            '{% for review in reviews %}' +
            // Переменная name "видна" только в блоке for ... endfor
            '<div class="review">' +
            '<div class="review__header">' +
            '<div class="review__name">{{ review.name }}</div>' +
            '</div>' +
            '<div class="review__body">' +
            '<div class="review__msg">{{ review.text }}</div>' +
            '<div class="review__footer">' +
            '<div class="review__place"> {{ review.place }}</div>' +
            '<div class="review__date">{{ review.date }}</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '{% endfor %}' +
            '{% else %}' +
            '<div>Отзывов еще нет...</div>' +
            '{% endif %}'
        ));
        ymaps.layout.storage.add('balloon#maximize', ymaps.templateLayoutFactory.createClass(
            '<div class="balloon">' +
            '<div class="balloon__header">' +
            '<div class="balloon__location">{{ properties.reviewAddress| default: address}}</div>' +
            '<div class="balloon__close">&times</div></div>' +
            '<div class="balloon__content">' +
            '<div class="balloon__reviews">' +
            '{% include options.contentLayout %}' +
            '</div>' +
            '<div class="balloon__form">' +
            '<form action="" method="post" class="form">' +
            '<div class="form__title">ваш отзыв</div>' +
            '<label class="form__field textfield">' +
            '<input type="text" name="name" class="textfield__control" placeholder="Имя">' +
            '<span class="random place">Сгенерировать</span>' +
            '</label>' +
            '<label class="form__field textfield">' +
            '<input type="text" name="place" class="textfield__control" placeholder="Место">' +
            '</label>' +
            '<label class="form__field textarea">' +
            '<textarea name="message" id="" rows="5" class="textarea__control" placeholder="Отзыв"></textarea>' +
            '</label>' +
            '<div class="form__buttons"><button class="form__btn save-review" type="button">Сохранить</button>' +
            '<button class="form__btn del-reviews" type="button">Удалить все метки</button></div>' +
            '</form></div></div></div>', {
                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._attachListeners();
                    // console.warn('конструктор балуна', this.getData());
                    // console.log('координаты балуна', map.balloon.getPosition())
                },
                clear: function () {
                    this._detachListeners();
                    this.constructor.superclass.clear.call(this);
                },
                _attachListeners: function () {
                    let close = this._parentElement.querySelector('.balloon__close');
                    let save = this._parentElement.querySelector('.save-review');
                    let remove = this._parentElement.querySelector('.del-reviews');
                    let random = this._parentElement.querySelector('.random');

                    random.addEventListener('click', this._setFieldsRandomString);
                    close.addEventListener('click', this._closeBalloon.bind(this));
                    save.addEventListener('click', this._savePlacemark.bind(this));
                    remove.addEventListener('click', this._deleteData);
                },
                _detachListeners: function () {
                    let close = this._parentElement.querySelector('.balloon__close');
                    let save = this._parentElement.querySelector('.save-review');
                    let remove = this._parentElement.querySelector('.del-reviews');

                    close.removeEventListener('click', this._closeBalloon);
                    save.removeEventListener('click', this._savePlacemark);
                    remove.removeEventListener('click', this._deleteData);
                },
                _closeBalloon: function () {
                    // console.log(e)
                    // e.preventDefault();

                    // map.balloon.close();
                    this.events.fire('userclose');
                },
                _savePlacemark: function (e) {
                    let form = e.target.closest('form');
                    console.log(this.getData())
                    let coords = this.getData().coords ?
                        this.getData().coords :
                        this.getData().geometry.getCoordinates();

                    saveReview(form, coords);
                },
                _deleteData: function () {
                    // todo - после удаления меток новые не устанавливаються, посмотреть почему
                    map.geoObjects.removeAll();
                    map.balloon.close();
                    storage.deleteData();
                },
                _setFieldsRandomString: function (e) {
                    let target = e.target;
                    let form = target.closest('form');

                    random.getRandomWord().then( array => {
                        form.name.value = array[Math.floor(Math.random() * array.length)].name;
                        form.place.value = array[Math.floor(Math.random() * array.length)].name;
                        form.message.value = random.getRandomString(Math.floor(Math.random()*(10-4)+4));
                    });
                }
            }));
        ymaps.layout.storage.add('balloon#carousel', ymaps.templateLayoutFactory.createClass(
            '<div class=cluster-balloon>' +
            '<div class="cluster__header"><h2 class=cluster__place>{{ properties.reviewAddress }}</h2>' +
            '<a href=# class=cluster__link>{{ properties.reviewAddress }}</a></div>' +
            '<div class=cluster__message>{{ properties.reviewText }}</div>' +
            '<div class=cluster__footer>{{ properties.reviewDate}}</div></div>', {
                build: function () {
                    this.constructor.superclass.build.call(this);

                    let link = this._parentElement.querySelector('.cluster__link');

                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log(e);
                        console.log(this);

                        getCoords(e.target.innerText).then( coords => openBalloon(coords));
                    }.bind(this))
                }
            }
        ));
    }

    /**
     * Создание метки
     * @param {object} properties {name, place, text, date, coords, address}
     * @return {ymaps.Placemark}
     */
    function createPlacemark(properties) {
        return new ymaps.Placemark(properties.coords,
            {
                hintContent: properties.address,
                reviewAddress: properties.address,
                reviewName: properties.name,
                reviewDate: properties.date,
                reviewText: properties.text,
                reviewPlace: properties.place,
                reviews: getReviews(properties.address)
            },
            {
                hasBalloon: false,
                // hideIconOnBalloonOpen: false,
                // balloonContentLayout: 'balloon#reviews',
                // balloonLayout: 'balloon#maximize'
            });
    }

    /**
     * подготовка данных, сохранение отзыва и установка
     * @param form - форма с полями ввода
     * @param coords - координаты места
     */
    function saveReview(form, coords) {
        getAddress(coords).then(address => {
            let review = {
                name: form.name.value,
                place: form.place.value,
                text: form.message.value,
                address: address,
                coords: coords,
                date: new Date().toLocaleString('ru', {})
            };
            let placemark = createPlacemark(review);

            // todo - убрать создание метки в отдельную функцию

            reviews.push(review);
            clusterer.add(placemark);
            map.balloon.setData({ // обновляем данные в балуне
                address: address,
                coords: coords,
                reviews: getReviews(review.address)
            });
            storage.setData(reviews); // сохраняем отзывы в локалсторадж
        });
    }

    /**
     * открыть балун в нужных координатах
     * @param coords
     */
    function openBalloon(coords) {
        getAddress(coords).then(address => {
            map.balloon.open(coords, {
                address: address,
                coords: coords,
                reviews: getReviews(address)
            }, {
                layout: 'balloon#maximize',
                contentLayout: 'balloon#reviews'
                // todo - сделать сдвиг карты, чтобы балун было видно полностью
            });
        });
    }

    /**
     * получение отзывов по конкретному адресу
     * @param address
     * @return {Array.<*>}
     */
    function getReviews(address) {
        return reviews.filter(item => item.address == address).reverse();
    }

    // публичные методы
    this.init = function () {
        let center = [55.76, 37.64],
            zoom = 15,
            controls = [];

        createLayouts();
        map = new ymaps.Map('map', {
            center: center,
            zoom: zoom,
            controls: controls,
            behaviors: ['default']
        });
        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            // Ставим true, если хотим кластеризовать только точки с одинаковыми координатами.
            groupByCoordinates: false,
            /**
             * Опции кластеров указываем в кластеризаторе с префиксом "cluster".
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ClusterPlacemark.xml
             */
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: 'balloon#carousel',
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 250,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            // clusterBalloonPagerSize: 5
        });
        reviews = storage.getData();

        if (reviews) {
            // console.log('отзывы из LocalStorage', reviews);
            clusterer.add(reviews.map(item => createPlacemark(item)))
        }

        map.geoObjects.add(clusterer);
        // map.setBounds(map.geoObjects.getBounds()); // при открытии карта будет центрироваться по меткам

        map.events.add('click', function (e) {
                if (!map.balloon.isOpen()) {
                    let coords = e.get('coords');

                    openBalloon(coords);
                } else {
                    map.balloon.close();
                }
            });
        clusterer.events.add('click', function (e) {
            let target = e.get('target');
            let geoObjectState = clusterer.getObjectState(target);

            if (geoObjectState.isShown) {
            // Если объект не попал в кластер, открываем его собственный балун.
                openBalloon(target.geometry.getCoordinates());
            }
        });
    }
};