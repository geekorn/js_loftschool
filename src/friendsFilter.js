let Template = require('./template/friends.hbs');
let friendTemplate = require('./template/friendList.hbs');
let DragManager = require('./dnd');

module.exports = new function () {
    let allFriends;
    let friendsContainer;
    let selectedContainer;
    let saveButton = document.querySelector('.save');

    // приватные функции
    /**
     * отрисовка элементов
     * @param {array} friends - массив элементов для прорисовки
     * @param {} container - элемент DOM, колонка в которой надо отрисовать элементы
     */
    function renderFriends(friends, container) {
        let htmlContainer = container.querySelector('.friends-container');

        if (friends.length) {
            htmlContainer.innerHTML = friendTemplate({ items: friends });
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
    function searchFriendsInDOM(container) {
        let friends = Array.from(container.querySelectorAll('.friend'));
        let filter = container.querySelector('input').value;

        friends.forEach(item => {
            let name = item.querySelector('.friend__name').innerText;

            if (name.toLowerCase().indexOf(filter) !== -1) {
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

    function saveFriends(friends) {
        let storage = localStorage;

        storage.selectedFriends = JSON.stringify(friends);

        console.log(storage);
    }

    function getFriendsList(friends) {
        let select = [];
        let all = [];

        friends.forEach(item => {
            if (item.selected) {
                select.push(item);
            } else {
                all.push(item);
            }
        });

        renderFriends(select, selectedContainer);
        renderFriends(all, friendsContainer);
    }

//
// TODO - сделать авторизацию по клику на кнопке
    this.init = function(VKfriends, container) {
        friendsContainer = container.querySelector('.all');
        selectedContainer = container.querySelector('.selected');
        // let Friends = {
        //     all: {
        //         items: [],
        //         container: friendsContainer
        //     },
        //     selected: {
        //         items: [],
        //         container: selectedContainer
        //     }
        // };

        if (localStorage.hasOwnProperty('selectedFriends')) {
            let answer = confirm('Загрузить последнее сохранение?');

            if (answer) {
                allFriends = JSON.parse(localStorage.selectedFriends);
                getFriendsList(allFriends);
            } else {
                allFriends = VKfriends;
                renderFriends(allFriends, friendsContainer);
                delete localStorage.selectedFriends;
            }
        } else {
            allFriends = VKfriends;
            renderFriends(allFriends, friendsContainer);
        }

        // поиск друзей
        container.addEventListener('keyup', function (e) {
            let target = e.target;

            if (e.target.tagName === 'INPUT') {
                let container = target.parentNode.parentNode;

                searchFriendsInDOM(container);
            }
        });

        // перенос элемента по клику на кнопке
        container.addEventListener('click', function (e) {
            let target = e.target;

            if (target.tagName === 'BUTTON') {
                let friendID = e.target.parentNode.dataset.id;
                let where;

                allFriends.forEach(item => {
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
    }
};