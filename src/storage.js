module.exports = {
    setData: function (data) {
        let storage = localStorage;

        storage.reviews = JSON.stringify(data);
    },
    getData: function () {
        if (localStorage.reviews) {
            return JSON.parse(localStorage.reviews);
        }

        return [];
    },
    deleteData: function () {
        delete localStorage.reviews;
        console.warn(localStorage)
    }
};