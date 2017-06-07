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
 * @param {} container - элемент DOM в который отрисовывать данные
 */
function showFriends(friends, container) {
    let htmlFragment = new DocumentFragment;

    friends.forEach(friend => {
        let template = document.createElement('div');

        template.innerHTML = `
                     <div class="friend" data-id="${friend.id}">
                         <div class="friend__avatar">
                            <img src="${friend.photo_100}" class="friend__img">
                         </div>
                         <a href="https://vk.com/id${friend.id}" class="friend__name" target="_blank">
                            ${friend.first_name} ${friend.last_name}
                         </a>
                         <button class="friend__btn" type="button">+</button>
                     </div>
                  `;
        htmlFragment.appendChild(template);
    });

    container.appendChild(htmlFragment);
}

/**
 * фильтрация друзей по строке поиска
 * @param {array} array - массив друзей в котором производим поиск
 * @param {string} filter - строка по которой фильтруем друзей
 * @return {array} массив отфильтрованных друзей
 */
function filterFriends (array, filter) {
    let filteredUsers;

    if (filter !== '') {
        filteredUsers = array.filter( user => {
            if (user.first_name.toLowerCase().indexOf(filter) !== -1 ||
                user.last_name.toLowerCase().indexOf(filter) !== -1) {
                return user;
            }
        })
    } else {
        filteredUsers = users;
    }

    return filteredUsers;
}

let users = [];
let selectedUsers = [];
let friendsContainer = document.querySelector('.all-friends .friends-container');
let selectedContainer = document.querySelector('.all-friends .selected-friends');

// авторизация и загрузка списка друзей ()
// TODO - сделать авторизацию по клику на кнопке
window.onload = function () {
    vkInit()
        .then( () => vkApi('friends.get', {fields: 'photo_100, city'}) )
        .then( response => {
            users = response.items;
            showFriends(users, friendsContainer);
        });
};

// поиск
// TODO - сделать делегированием на обе колонки
search.addEventListener('keyup', function (e) {
    let filter = this.value.toLowerCase();
    let container = this.parentNode.nextElementSibling.children[1];

    console.log(container);
    container.innerHTML = '';
    showFriends(filterFriends(users, filter), container);
});

// перенос элемента по клику на кнопке
friendsContainer.addEventListener('click', function (e) {
    let target = e.target;
    console.log(target);

    if (target.tagName === 'BUTTON') {
        let friendID = e.target.parentNode.dataset.id;
        let ndx = users.findIndex( item => +item.id === +friendID);

        selectedUsers = selectedUsers.concat(users.splice(ndx, 1));

        console.log(selectedUsers);
        console.log(users)

        showFriends(selectedUsers);
    }
});
