/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let randomColor = () => "#" + ((1 << 24) * Math.random() | 0).toString(16);
let randomInt = (max) => Math.floor(Math.random() * (max - 1) + 1);

// let btn = document.querySelector('.btn');
// btn.style.backgroundColor = randomColor();
// btn.style.color = randomColor();

let homeworkContainer = document.querySelector('#homework-container');


/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    let elem = document.createElement('div'),
        elemWidth = randomInt(homeworkContainer.offsetWidth / 3),
        elemHeight = randomInt(homeworkContainer.offsetHeight / 3),
        elemOffsetTop = randomInt(homeworkContainer.offsetHeight - elemHeight),
        elemOffsetLeft = randomInt(homeworkContainer.offsetWidth - elemWidth);

    elem.classList.add('draggable-div');
    elem.style.backgroundColor = randomColor();
    elem.style.position = 'absolute';
    elem.style.width = elemWidth + 'px';
    elem.style.height = elemHeight + 'px';
    elem.style.top = elemOffsetTop + 'px';
    elem.style.left = elemOffsetLeft + 'px';

    console.log(elem);
    return elem;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    let elem = {};

    target.addEventListener('mouseover', function () {
        this.style.cursor = 'move';
    });

    homeworkContainer.addEventListener('mousedown', function (e) {
        e.preventDefault();

        // зажали клавишу, если запомнить координаты нажатия
        if (e.target.classList.contains('draggable-div')) {
            elem.node = e.target;
            elem.cursorX = e.clientX;
            elem.cursorY = e.clientY;
        }

        // console.log(elem);
    });
    homeworkContainer.addEventListener('mousemove', function moveElement(e) {
        e.preventDefault();
        // проверяем что клик произошел на элементе  'draggable-div'
        if (!elem.node) {
            return;
        }

        // проверить не вылезает ли див из контейнера
        let coordTopDifference = elem.cursorY - elem.node.offsetTop;
        let coordLeftDifference = elem.cursorY - elem.node.offsetLeft;
        elem.coordTop = e.clientY - coordTopDifference;+

            elem.node.style.top = elem.coordTop;

        // console.log(e);
        console.log('Координаты курсора: %s %s /n координаты дива: %s %s ', e.clientX, e.clientY, coordLeftDifference, elem.coordTop);
        // console.log(this);



    });
    homeworkContainer.addEventListener('mouseup', function () {
        elem.node = undefined;
        // удалить координаты

        console.log(elem);
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

// export {
//     createDiv
// };
