let Map = require('./map');

window.onload = function() {
    ymaps.ready(Map.init);
};