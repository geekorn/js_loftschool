let dragObject = {};

document.onmousedown = function (e) {
    if (which != 1) {
        return;
    }

    let elem = e.target.closest('.friend');

    if (!elem) return;

    dragObject.elem = elem;
    dragObject.dragZone = elem.parentNode;

    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
};

document.onmousemove = function (e) {
    if (!dragObject.elem) return;

    if (!dragObject.avatar) {
        let moveX = e.pageX - dragObject.downX;
        let moveY = e.pageY - dragObject.downY;

        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;

        dragObject.avatar = createAvatar(e);
        if (!dragObject.avatar) {
            dragObject = {};
            return;
        }

        let coords = getCoords(dragObject.avatar);

        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;

        startDrag(e);
    }

    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
};

function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function createAvatar(e) {
    let avatar = dragObject.elem.cloneNode(true);

    avatar.classList.add('avatar');

    avatar._remove = function () {
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

document.onmouseup = function(e) {
    if (dragObject.avatar) {
        finishDrag(e);
    }

    dragObject = {};
};

function finishDrag(e) {
    var dropElem = findDroppable(e);

    if (dropElem == dragObject.dragZone) {

    } else {
    }
}

function findDroppable(event) {
    // спрячем переносимый элемент
    dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    dragObject.avatar.hidden = false;

    if (elem == null) {
        // такое возможно, если курсор мыши "вылетел" за границу окна
        return null;
    }

    return elem.closest('.friends-container');
}