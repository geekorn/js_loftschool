module.exports = new function () {
    let storage = window.localStorage;
    let key = 'reviews';

    this.exist = () => storage;
    this.getData = () => storage[key] ? JSON.parse(storage.getItem(key)) : [];
    this.setData = (data) => storage.setItem(key, JSON.stringify(data));
    this.deleteData = () => storage.removeItem(key);
};