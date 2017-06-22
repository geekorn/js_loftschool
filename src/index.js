let Map = require('./map');

window.onload = function() {
    let saveBtn = document.querySelector('.save-review');

    ymaps.ready(Map.init);
};