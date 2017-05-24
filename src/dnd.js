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

let randomColor = () => '#' + ((1 << 23) * Math.random() | 0).toString(16);
let randomInt = (max) => Math.floor(Math.random() * (max - 1) + 1);

let homeworkContainer = document.querySelector('#homework-container');
let addDivButton = homeworkContainer.querySelector('#addDiv');
let conteinerCoords = homeworkContainer.getBoundingClientRect();
let elem = {};

// console.log(conteinerCoords);
// console.log('homeworkContainer.offsetWidth = %s', homeworkContainer.offsetWidth, homeworkContainer);

addDivButton.addEventListener('click', function () {
    let div = createDiv();

    homeworkContainer.appendChild(div);
});

// или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
homeworkContainer.addEventListener('mouseover', e => {
    if (e.target.classList.contains('draggable-div')) {
        e.target.style.cursor = 'move';
    }
});

homeworkContainer.addEventListener('mousedown', function (e) {
    e.preventDefault();

    // запомнить элемент на котором сработало событие
    // если это див, то запомнить его координаты относительно координат клика
    if (e.target.classList.contains('draggable-div')) {
        elem.node = e.target;

        // вычисляем координаты относительно левого верхнего угла контейнера
        elem.cursorX = e.clientX - conteinerCoords.left;
        elem.cursorY = e.clientY - conteinerCoords.top;

        // разница между координатами дива и курсором
        elem.x = elem.cursorX - elem.node.offsetLeft;
        elem.y = elem.cursorY - elem.node.offsetTop;

        console.log('координаты дива в момент нажатия клавиши %s %s', elem.node.offsetTop, elem.node.offsetLeft);
        console.log('координаты курсора в момент нажатия клавиши %s %s', elem.cursorY, elem.cursorX);
    }
});

homeworkContainer.addEventListener('mousemove', function moveElement(e) {
    e.preventDefault();
    // проверяем что клик произошел на элементе  'draggable-div'
    if (e.target !== elem.node) {
        return;
    }

    // проверить не вылезает ли див из контейнера
    let coordX = elem.cursorX - elem.x;
    let coordY = elem.cursorY - elem.y;
    let posX, posY;

    // let posX = (coordX <= 0) ? 0 :
    //         (coordX + elem.node.offsetWidth > homeworkContainer.offsetWidth) ? homeworkContainer.offsetWidth - elem.node.offsetWidth :
    //         coordX;
    // let posY = (coordY <= 0) ? 0 :
    //     (coordY + elem.node.offsetHeight > homeworkContainer.offsetHeight) ? homeworkContainer.offsetHeight - elem.node.offsetHeight :
    //         coordY;
    if (coordX <= 0) {
        posX = 0;
    } else if (coordX + elem.node.offsetWidth > homeworkContainer.offsetWidth) {
        posX = homeworkContainer.offsetWidth - elem.node.offsetWidth;
    } else {
        posX = coordX;
    }

    if (coordY <= 0) {
        posY = 0;
    } else if (coordY + elem.node.offsetHeight > homeworkContainer.offsetHeight) {
        posY = homeworkContainer.offsetHeight - elem.node.offsetHeight;
    } else {
        posY = coordY;
    }

    elem.node.style.left = posX +'px';
    elem.node.style.top = posY +'px';

    console.log('координаты дива в момент перемещения %s %s', elem.node.offsetTop, elem.node.offsetLeft);
    console.log('координаты курсора в момент перемещения %s %s', elem.cursorY, elem.cursorX);

    // обновляен координаты перемещения, учитывая положение контейнера
    elem.cursorX = e.clientX - conteinerCoords.left;
    elem.cursorY = e.clientY - conteinerCoords.top;
});
homeworkContainer.addEventListener('mouseup', function () {
    elem.node = undefined;
    // удалить координаты
    // console.log(elem)
});

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

    return elem;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
// function addListeners() {
//
// }

export {
    createDiv
};
