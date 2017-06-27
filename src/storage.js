module.exports = new function () {
    let storage = window.localStorage;
    let key = 'reviews';

    this.exist = () => storage;

    this.getData = function () {
        if (storage[key]) {
            return JSON.parse(storage.getItem(key));
        }

        return [];
    };

    this.setData = function (data) {
        storage.setItem(key, JSON.stringify(data));
    };

    this.deleteData = function () {
        storage.removeItem(key);

        console.warn(localStorage)
    };
};