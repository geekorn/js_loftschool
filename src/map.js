module.exports = function () {
    // объявление переменных
    let data,
        reviews = [], // массив для хранения отзывов
        options,
        self = this;

    this.placemark = null;
    this.balloon = null;
    this.convTypes = [];
    this.reloadDelay = null;
    this.clusterer = null;
    this.balloonMode = null;

    // приватные функции (обработка данных, например)
    //
    let makePlacemark = function () { //todo - переделать метку
            return ( new ymaps.Placemark(properties.latLng,
                {
                    iconOffset: -properties.maintype * 21,
                    hintContent: properties.title,
                    coords: properties.latLng,
                    id: parseInt(properties.id),
                    title: properties.title,
                    objtype: properties.objtype,
                    maintype: parseInt(properties.maintype),
                    flag: parseInt(properties.flag)
                },
                {
                    iconLayout: 'voina#icon',
                    iconOffset: [-5, -34],
                    openBalloonOnClick: false
                }));
        },
        createLayouts = function () {
            // ymaps.layout.storage.add('voina#icon', ymaps.templateLayoutFactory.createClass(
            //     '<div class="iconback">' +
            //     '<div style="background-position: $[properties.iconOffset]px 0;">'+
            //     '</div></div>'));
            ymaps.layout.storage.add('balloon#form', ymaps.templateLayoutFactory.createClass(
                '<div class="balloon-close-button">' +
                '<span class="action balloon-maximize" data-action="showcard"></span>' +
                '<span class="action balloon-close" data-action="cancel"></span></div>'));
            ymaps.layout.storage.add('balloon#carousel', ymaps.templateLayoutFactory.createClass(
            // '<div class="balloon-close-button">'+
            // '<span  class="action balloon-minimize" data-action="showform"></span>'+
            // '<span class="action balloon-close" data-action="cancel"></span></div>'));
        };


    // публичные методы
    this.init = function (options) {
        //id, lat, lng, zoom, objTypes, mapType, typesarr
        let center = [55.76, 37.64],
            zoom = 15, // (options && options.zoom) || parseInt($.cookie('zoom')) || 4,
            controls = [],
            // mtype = options.mtype || $.cookie('mtype', {raw: true}) || null,
            // mapType = mapTypes[mtype],
            // types = $.cookie(types, {raw: true}) || 0,
            // mode = options.mode || $.cookie('mode', {raw: true}) || 'all',
            showBalloon = false;

        map = new ymaps.Map('map', {
            center: center,
            zoom: zoom,
            controls: controls,
            behaviors: ['default']
        });
        //createLayouts();
        //map.events
    }

    myBalloonCloseButtonLayout = ymaps.templateLayoutFactory.createClass('x', {
        build: function () {
            this.constructor.superclass.build.call(this);
            $('#close-balloon-link').on('click', $.proxy(this.onCloseClick, this));
        },
        clear: function () {
            $('#close-balloon-link').off('click');
            this.constructor.superclass.build.call(this);
        },
        onCloseClick: function () {
            this.getData().geoObject.balloon.close();
        }
    });

};