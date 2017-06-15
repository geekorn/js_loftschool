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
        zoom: 5
    }, {
        searchControlProvider: 'yandex#search'
    });

    let myBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="balloon">
      <div class="balloon__header">
        <div class="balloon__location"></div>
        <div class="balloon__close">&times</div>
      </div>
      <div class="balloon__content">
        <div class="balloon__reviews"></div>
        <div class="balloon__form">
          <form action="" method="post" class="form">
            <div class="form__title">ваш отзыв</div>
            <label class="form__field textfield">
              <input type="text" name="username" class="textfield__control" placeholder="Ваше имя">
            </label>
            <label class="form__field textfield">
              <input type="text" name="username" class="textfield__control" placeholder="Ваше имя">
            </label>
            <label class="form__field textarea">
              <textarea name="message" id="" cols="30" rows="10" class="textarea__control" placeholder="Ваш отзыв"></textarea>
            </label>
            <button class="form__btn" type="button">Сохранить</button>
          </form>
        </div>
      </div>
    </div>`
    );
    let myBalloonHeader = ymaps.templateLayoutFactory.createClass(
        '<div class="balloon__header">' +
        '<div class="balloon__location"></div>' +
        '<div class="balloon__close">&times</div>' +
        '</div>'
    );
    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            let coords = e.get('coords');

            ymaps.geocode(coords).then(function (res) {
                let geoObject = res.geoObjects.get(0);

                myMap.balloon.open(coords, {
                    contentHeader: 'Событие!',
                    contentBody: '<p>Кто-то щелкнул по карте.</p>' +
                    '<p>Адрес щелчка: ' + geoObject.getAddressLine() + '</p>',
                    contentFooter: myBalloonContentLayout
                });
            });

        } else {
            myMap.balloon.close();
        }
    });
}