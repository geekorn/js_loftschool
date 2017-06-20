module.exports = new function () {
    let dragObject = {};
    let that = this;

    function onMouseDown(e) {
        if (e.which != 1) {
            return;
        }

        let elem = e.target.closest('.friend');

        if (!elem) return;

        dragObject.elem = elem; // запоминаем элемент в объект
        dragObject.dragZone = elem.parentNode;

        // координаты курсора при нажатии кнопки
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;
    }

    function onMouseMove(e) {
        // если клавиша была зажата не над перемещаемым элементом
        if (!dragObject.elem) return;

        // если перемещается "новый" элемент (который еще не перемещался)
        if (!dragObject.avatar) {
            let moveX = e.pageX - dragObject.downX;
            let moveY = e.pageY - dragObject.downY;

            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return; // защита от случайного перемещения

            // начало переноса
            dragObject.avatar = createAvatar(e); // создаем копию элемента
            if (!dragObject.avatar) {
                dragObject = {};
                return;
            }

            let avatarCoords = getCoords(dragObject.elem);

            dragObject.shiftX = dragObject.downX - avatarCoords.left;
            dragObject.shiftY = dragObject.downY - avatarCoords.top;

            // console.log(dragObject.elem.offsetWidth);

            startDrag(e);
        }

        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

        return false;
    }

    function onMouseUp(e) {
        if (dragObject.avatar) {
            finishDrag(e);
        }

        dragObject = {};
    }

    function getCoords(elem) {
        let box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    function createAvatar(e) {
        let avatar = dragObject.elem.cloneNode(true);

        avatar.classList.add('friend-avatar');
        avatar.style.width = dragObject.elem.offsetWidth + 'px';

        avatar.remove = function () {
            avatar.parentNode.removeChild(avatar);
        };

        return avatar;
    }

    function startDrag(e) {
        let avatar = dragObject.avatar;

        document.body.appendChild(avatar); //todo - поменять body на контейнер
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function finishDrag(e) {
        let dropElem = findDroppable(e);
        console.log(dropElem)

        if (!dropElem || dropElem == dragObject.dragZone) {
            console.log('elem')
            // that.onDragCancel(dragObject);
        } else {
            that.onDragEnd(dragObject, dropElem);
        }
    }

    function findDroppable(event) {
        // спрячем переносимый элемент
        // dragObject.avatar.hidden = 'true';
        dragObject.avatar.classList.add('friend_hidden');

        // получить самый вложенный элемент под курсором мыши
        let elem = document.elementFromPoint(event.clientX, event.clientY);

        // dragObject.avatar.hidden = false;
        // показать переносимый элемент обратно
        dragObject.avatar.classList.remove('friend_hidden');

        if (elem == null) {
            // такое возможно, если курсор мыши "вылетел" за границу окна
            return null;
        }

        console.log(elem)

        return elem.closest('.friends-container');
    }

    document.onmousedown = onMouseDown;
    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;

    this.onDragEnd = function(dragobject, dropElem) {}
    this.onDragCancel = function(dragobject) {}
};