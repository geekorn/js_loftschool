module.exports = new function () {
    let myMap, clusterer, placemarks = [];

    // Инициализация и уничтожение карты при нажатии на кнопку.
    function _init(data) {
        myMap = new ymaps.Map('map', {
            center: [55.010251, 82.958437], // Новосибирск
            zoom: 3,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размер макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 350,
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: createLayout(),
            // Устанавливаем ширину левой колонки, в которой располагается список всех геообъектов кластера.
            clusterBalloonLeftColumnWidth: 150
        });

        setPlacemarks(data);
        myMap.geoObjects.add(clusterer);
    }

    /**
     * определение координат по городу
     * @param {string} address
     * @return {*|Promise.<TResult>}
     */
    function geocode(address) {
        return ymaps.geocode(address).then(result => {
            let points = result.geoObjects.toArray();

            if (points.length) {
                return points[0].geometry.getCoordinates();
            }
        });
    }

    /**
     * устанавливает метки из массива с друзьями
     * @param {array} data - массив объектов с друзьями
     */
    function setPlacemarks(data) {
        data.forEach(friend => {
            // debugger
            if (!friend.city) return;

            let location = `${friend.country.title} ${friend.city.title}`;
            let fullName = `${friend.first_name} ${friend.last_name}`;

            geocode(location).then(coords => {
                friend.coords = coords;
                friend.fullName = fullName;
                friend.location = location;
                placemarks.push(createPlacemark(friend));
                clusterer.add(createPlacemark(friend)); //todo - не нравится мне это
            });
        });
        // console.log(placemarks)
        // return placemarks;
    } //todo - вернуть массив меток

    /**
     * создает метку на карте
     * @param {object} friend - {id, fullName, coords, location, photo_100}
     * @return {ymaps.Placemark}
     */
    function createPlacemark(friend) {
        return new ymaps.Placemark(friend.coords,
            {
                hintContent: friend.fullName,
                clusterCaption: friend.fullName,
                placemarkId: friend.id,
                placemarkName: friend.fullName,
                placemarkLocation: friend.location,
                placemarkPhoto: friend.photo_100
            },
            {
                iconLayout: 'default#image',
                // iconImageHref: friend.photo_100,
                // iconImageSize: [50, 50],
                // iconImageOffset: [-25, -25],
                // iconContentLayout: MyIconContentLayout
            });
    }

    function createLayout() {
        // Создаем собственный макет с информацией о выбранном геообъекте.
        return ymaps.templateLayoutFactory.createClass([
            '<h2 class="title">{{geoObject.properties.placemarkLocation}}</h2>',
            // Выводим в цикле список всех геообъектов.
            // '{% for geoObject in properties.geoObjects %}',
            '<div class="friend" data-id="{{ geoObject.properties.placemarkId }}">',
            '<div class="friend__avatar">',
            '<img src="{{ geoObject.properties.placemarkPhoto }}" class="friend__img"></div>',
            '<a href="https://vk.com/id{{geoObject.properties.placemarkId}}" class="friend__name" target="_blank">{{ geoObject.properties.placemarkName }}</a>',
            '</div>',
            // '{% endfor %}',
        ].join(''));
    }
    // //todo - Создаём макет содержимого метки с фото
// let MyIconContentLayout = myMap.templateLayoutFactory.createClass(
//     '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
// );

    this.init = function (data) {
        let btn = document.querySelector('.map-btn');
        _init(data);

        // активация карты по клику на кнопке
        // btn.addEventListener('click', function (e) {
        //     if (!myMap) {
        //         _init();
        //         setPlacemarks(data);
        //
        //         this.innerText = 'Вернуться к спискам';
        //     } else {
        //         setTimeout(() => {
        //             myMap.destroy();// Деструктор карты
        //             myMap = null;
        //         }, 1000);
        //
        //         this.innerText = 'Показать на карте';
        //     }
        // });
    }
};
