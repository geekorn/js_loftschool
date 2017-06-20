let friendTemplate = require('./template/friends.hbs');
let VKAPI = require('./VKmodel');
let MAPAPI = require('./map');
let FriendFilter = require('./friendsFilter');

let VKID = 6062935;
let VKPERMISSIONS = 2;

window.onload = function () {
    let auth = document.querySelector('.auth');
    let flipper = document.querySelector('.flipper');
    let container = document.querySelector('.friend-list');
    let mapButton = document.querySelector('.map-btn');
    let flag;
    let Friends = [
        {
            class: "all",
            title: "Ваши друзья"
        },
        {
            class: "selected",
            title: "Друзья в списке"
        }];

    auth.addEventListener('click', function () { //todo авторизация по кнопке (раскомментировать)
        VKAPI.login(VKID, VKPERMISSIONS)
            .then(response => new Promise(resolve => ymaps.ready(resolve)))
            .then(() => VKAPI.getFriends())
            .then((friends) => {
                auth.classList.add('friend_hidden');
                mapButton.classList.remove('friend_hidden');
                container.innerHTML = friendTemplate({items: Friends});
                FriendFilter.init(friends.items, container);
                MAPAPI.init(friends.items);
            });
    });

    mapButton.addEventListener('click', () => {
        if (!flag) {
            flipper.style.transform = 'rotateY(180deg)';
            flag = true;
            this.innerText = 'Вернуться к спискам';
        } else {
            flipper.style.transform = 'rotateY(0)';
            flag = false;
            this.innerText = 'Показать на карте';
        }
    })
};