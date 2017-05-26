/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {

    return new Promise( function(resolve, reject) {
        if (typeof seconds !== 'number') {
            reject();
        }

        setTimeout( function () {
            resolve()
        }, seconds*1000)
    })
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status !== 200) {
                // обработать ошибку
                reject('Не удалось загрузить города');
            } else {
                let cities = JSON.parse(xhr.responseText);

                cities.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }

                    return 0;
                });

                resolve(cities);
            }
        });

        xhr.addEventListener('error', () => {
            reject('Не удалось загрузить города');
        })
    })
}

export {
    delayPromise,
    loadAndSortTowns
};
