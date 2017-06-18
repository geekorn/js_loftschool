let Template = require('./template/friends.hbs');
let DragManager = require('./dnd');

/**
 * VK_API
 * @return {Promise}
 */
function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6062935
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.64';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

/**
 * отрисовка элементов
 * @param {array} friends - массив элементов для прорисовки
 * @param {} container - элемент DOM, колонка в которой надо отрисовать элементы
 */
function renderFriends(friends, container) {
    let htmlContainer = container.querySelector('.friends-container');

    if (friends.length) {
        htmlContainer.innerHTML = Template({ items: friends });
    } else {
        htmlContainer.innerHTML = '';
    }
}

/**
 * фильтрация друзей по строке поиска
 * @param {array} friends - массив друзей в котором производим поиск
 * @param {string} filter - строка по которой фильтруем друзей
 * @return {array} массив отфильтрованных друзей
 */
function searchFriendsInArray(friends, filter) {
    let filteredUsers;

    filter = filter.toLowerCase();
    if (filter !== '' && friends.length) {
        filteredUsers = friends.filter(user => {
            if (user.first_name.toLowerCase().indexOf(filter) !== -1 ||
                user.last_name.toLowerCase().indexOf(filter) !== -1) {
                return user;
            }
        })
    } else {
        filteredUsers = friends;
    }

    return filteredUsers;
}

function searchFriendsInDOM (container) {
    let friends = Array.from(container.querySelectorAll('.friend'));
    let filter = container.querySelector('input').value;

    friends.forEach( item => {
        let name = item.querySelector('.friend__name').innerText;

        if ( name.toLowerCase().indexOf(filter) !== -1 ) {
            item.classList.remove('friend_hidden');
        } else {
            item.classList.add('friend_hidden');
        }
    });
}

function moveFriend(id, container) {
    let friend = document.querySelector(`[data-id="${id}"]`);
    let htmlContainer = container.querySelector('.friends-container');
    let cloneFriend = friend.cloneNode(true);

    htmlContainer.appendChild(cloneFriend);
    friend.parentNode.removeChild(friend);
    searchFriendsInDOM(container)
}

function saveFriends (friends) {
    let storage = localStorage;

    storage.selectedFriends = JSON.stringify(friends);

    console.log(storage);
}

function getFriendsList(friends) {
    let select = [];
    let all = [];

    friends.forEach( item => {
        if (item.selected) {
            select.push(item);
        } else {
            all.push(item);
        }
    });

    renderFriends(select, selectedContainer);
    renderFriends(all, friendsContainer);
}

let allFriends;
let content = document.querySelector('.content');
let friendsContainer = document.querySelector('.all-friends');
let selectedContainer = document.querySelector('.selected-friends');
let saveButton = document.querySelector('.save');
// авторизация и загрузка списка друзей ()
// TODO - сделать авторизацию по клику на кнопке
window.onload = function () {
    vkInit()
        .then(() => vkApi('friends.get', {fields: 'photo_100, city'}))
        .then(response => {
            if (localStorage.hasOwnProperty('selectedFriends')) {
                let answer = confirm('Загрузить последнее сохранение?');

                if (answer) {
                    allFriends = JSON.parse(localStorage.selectedFriends);
                    getFriendsList(allFriends);
                } else {
                    allFriends = response.items;
                    renderFriends(allFriends, friendsContainer);
                    delete localStorage.selectedFriends;
                }
            } else {
                allFriends = response.items;
                renderFriends(allFriends, friendsContainer);
            }
        });
};

// поиск друзей
content.addEventListener('keyup', function (e) {
    let target = e.target;

    if (e.target.tagName === 'INPUT') {
        let container = target.parentNode.parentNode;

        searchFriendsInDOM (container);
    }
});

// перенос элемента по клику на кнопке
content.addEventListener('click', function (e) {
    let target = e.target;

    if (target.tagName === 'BUTTON') {
        let friendID = e.target.parentNode.dataset.id;
        let where;

        allFriends.forEach( item => {
            if (item.id == friendID) {
                if (item.selected) {
                    item.selected = false;
                    where = friendsContainer;
                } else {
                    item.selected = true;
                    where = selectedContainer;
                }
            }
        });

        moveFriend(friendID, where);
    }
});

saveButton.addEventListener('click', function () {
   saveFriends(allFriends);
});

DragManager.onDragEnd = function(dragObject, dropElem) {
    let friendID = dragObject.elem.dataset.id;
    let container = dropElem.parentNode.parentNode;

    allFriends.forEach( item => {
        if (item.id == friendID) {
            if (item.selected) {
                item.selected = false;
            } else {
                item.selected = true;
            }
        }
    });
    moveFriend(friendID, container);
    dragObject.avatar.remove();
    console.log()
};

DragManager.onDragCancel = function(dragObject) {
    dragObject.avatar.remove();
};