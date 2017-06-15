// let hbs = require();

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
    let friendsList;
    let input = container.querySelector('input');
    let htmlContainer = container.querySelector('.friends-container');

    // if (input.value) {
    //     friendsList = searchFriendsInArray(friends, input.value)
    // } else {
    //     friendsList = friends;
    // }

    if (friends.length) {
        htmlContainer.innerHTML = templateFN({ items: friends });
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

let allFriends,
    selectFriends = [];
let content = document.querySelector('.content');
let friendsContainer = document.querySelector('.all-friends');
let selectedContainer = document.querySelector('.selected-friends');

let template = `
{{#each items}}
  <div class="friend" data-id="{{id}}">
    <div class="friend__avatar">
      <img src="{{photo_100}}" class="friend__img">
    </div>
    <a href="https://vk.com/id{{id}}" class="friend__name" target="_blank">
        {{first_name}} {{last_name}}
     </a>
     <button class="friend__btn" type="button">+</button>
  </div>
{{/each}}
`;
let templateFN = Handlebars.compile(template);

// авторизация и загрузка списка друзей ()
// TODO - сделать авторизацию по клику на кнопке
window.onload = function () {
    vkInit()
        .then(() => vkApi('friends.get', {fields: 'photo_100, city'}))
        .then(response => {
            allFriends = response.items;
            renderFriends(allFriends, friendsContainer);
        });
};

// поиск друзей
content.addEventListener('keyup', function (e) {
    let target = e.target;

    if (e.target.tagName === 'INPUT') {
        let filter = e.target.value;
        let container = target.parentNode.parentNode;
        let friendsClass = container.classList[1];
        let friends = (friendsClass === 'all-friends') ? allFriends : selectFriends;

        searchFriendsInDOM (container);
        // renderFriends(friends, container);
    }
});

// перенос элемента по клику на кнопке
content.addEventListener('click', function (e) {
    let target = e.target;

    if (target.tagName === 'BUTTON') {
        let friendID = e.target.parentNode.dataset.id;
        let where;

        if (selectFriends.includes(friendID)) {
            let index = selectFriends.findIndex((item) => item === friendID);

            selectFriends.splice(index, 1);
            where = friendsContainer;
        } else {
            selectFriends.push(friendID);
            where = selectedContainer;
        }

        moveFriend(friendID, where);
    }
});

function moveFriend(id, container) {
    let friend = document.querySelector(`[data-id="${id}"]`);
    let htmlContainer = container.querySelector('.friends-container');
    let cloneFriend = friend.cloneNode(true);

    htmlContainer.appendChild(cloneFriend);
    friend.parentNode.removeChild(friend);
    searchFriendsInDOM(container)
}
