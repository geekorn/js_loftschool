module.exports = new function () {
    let myMap, clusterer;

    // Инициализация и уничтожение карты при нажатии на кнопку.
    function _init() {
        myMap = new ymaps.Map('map', {
            center: [55.010251, 82.958437], // Новосибирск
            zoom: 3,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем собственный макет с информацией о выбранном геообъекте.
        let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="friend" data-id="{{id}}">' +
            '<div class="friend__avatar">' +
            '<img src="{{properties.balloonContentPhoto}}" class="friend__img"></div>' +
            '<a href="https://vk.com/id{{id}}" class="friend__name" target="_blank">{{properties.balloonContentBody}}</a>' +
            '</div>'
        );

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
            clusterBalloonContentLayoutHeigth: 350,
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем ширину левой колонки, в которой располагается список всех геообъектов кластера.
            clusterBalloonLeftColumnWidth: 120
        });

        myMap.geoObjects.add(clusterer);
    }

// определение координат по городу
    function geocode(address) {
        return ymaps.geocode(address).then(result => {
            let points = result.geoObjects.toArray();

            if (points.length) {
                return points[0].geometry.getCoordinates();
            }
        });
    }

// //todo - Создаём макет содержимого метки с фото
// let MyIconContentLayout = myMap.templateLayoutFactory.createClass(
//     '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
// );

    function setPlacemarks(data) {
        data.forEach(friend => {
            // debugger
            if (!friend.city) return;

            let place = `${friend.country.title} ${friend.city.title}`;
            let name = `${friend.first_name} ${friend.last_name}`;

            geocode(place).then(coords => {
                let placemark = new ymaps.Placemark(coords,
                    {
                        hintContent: name,
                        clusterCaption: name,
                        balloonContentHeader: name,
                        balloonContentBody: `${friend.city.title}, ${friend.country.title}`,
                        balloonContentPhoto: friend.photo_100
                    },
                    {
                        iconLayout: 'default#image',
                        // iconImageHref: friend.photo_100,
                        // iconImageSize: [50, 50],
                        // iconImageOffset: [-25, -25],
                        // iconContentLayout: MyIconContentLayout
                    });

                clusterer.add(placemark);
            })
        });
    }

    this.init = function (data) {
        let btn = document.querySelector('.map-btn');
        _init();
        setPlacemarks(data);

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
