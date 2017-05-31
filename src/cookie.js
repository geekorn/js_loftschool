/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

/**
 * Функция создания кук
 * @param {string} name
 * @param {string} value
 */

/**
 * Функция удаления кук
 * @param {string} name
 */
import { createCookie, deleteCookie } from './index.js'

/**
 * Функция получает все куки и возвращает объект {name: value}
 * @return {object} cookies
 */
function getCookie() {
    let cookies = document.cookie;

    if (!cookies) {
        return false;
    }

    cookies = cookies.split('; ').reduce((prev, current) => {
        let cookie = current.split('=');

        prev[cookie[0]] = cookie[1];

        return prev;
    }, {});

    return cookies;
}

/**
 * Функция фильтрации
 * @param {string} chunk - подстрока по которой надо фильтровать куки
 * @return {object} отфильтрованные куки
 */
function filterCookies(chunk) {
    let obj = getCookie();
    let filteredCokies = {};

    chunk = chunk.toLowerCase();

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let name = key.toLowerCase();
            let val = obj[key].toLowerCase();

            if (name.includes(chunk) || val.includes(chunk)) {
                filteredCokies[key] = obj[key];
            }
        }
    }

    return filteredCokies;
}

/**
 * Функция создания таблицы
 * @param {object} cookies - список из котороого надо сформировать таблицу
 */
function createTable(cookies) {
    // while (listTable.rows[0]) {
    //     listTable.deleteRow(0);
    // }
    listTable.innerHTML = '';

    let btn = '<button type="button" class="remove-cookie" style="color: red; font-weight: bold">X</button>';

    for (let name in cookies) {
        if (cookies.hasOwnProperty(name)) {
            let row = listTable.insertRow(-1);

            row.insertCell(-1).innerText = name;
            row.insertCell(-1).innerText = cookies[name];
            row.insertCell(-1).innerHTML = btn;
        }
    }
}

/**
 * Функция подготовки данных для таблицы учитывая фильтр
 */
function prepareAndCreateTable() {
    let cookies;
    let value = filterNameInput.value;

    if (!value) {
        cookies = getCookie();
    } else {
        cookies = filterCookies(value);
    }

    createTable(cookies);
}

// фильтрация
filterNameInput.addEventListener('keyup', function () {
    prepareAndCreateTable()
});

// добавление кук
addButton.addEventListener('click', () => {
    let name = addNameInput.value;
    let val = addValueInput.value;

    createCookie(name, val);
    prepareAndCreateTable()
});

// удаление кук
listTable.addEventListener('click', function (e) {
    let btn = e.target;
    let row = btn.parentNode.parentNode;
    let rowIndex = btn.parentNode.parentNode.sectionRowIndex;
    let name = row.firstChild.innerText;

    if (!btn.classList.contains('remove-cookie')) {
        return;
    }

    this.deleteRow(rowIndex);
    deleteCookie(name);
});

createTable(getCookie());