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
    if (friends.length) {
        let obg = {items: friends};
        let html = templateFN(obg);

        container.innerHTML = html;
    }
}

/**
 * фильтрация друзей по строке поиска
 * @param {array} array - массив друзей в котором производим поиск
 * @param {string} filter - строка по которой фильтруем друзей
 * @return {array} массив отфильтрованных друзей
 */
function filterFriends(array, filter) {
    let filteredUsers;

    if (filter !== '' && array.length) {
        filteredUsers = array.filter(user => {
            if (user.first_name.toLowerCase().indexOf(filter) !== -1 ||
                user.last_name.toLowerCase().indexOf(filter) !== -1) {
                return user;
            }
        })
    } else {
        filteredUsers = array;
    }

    return filteredUsers;
}

let allFriends, selectFriends = [];
let content = document.querySelector('.content');
let friendsContainer = document.querySelector('.all-friends .friends-container');
let selectedContainer = document.querySelector('.selected-friends .friends-container');

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
// let template = document.querySelector('#entry-template');
let templateFN = Handlebars.compile(template);

// авторизация и загрузка списка друзей ()
// TODO - сделать авторизацию по клику на кнопке
window.onload = function () {
    vkInit()
        .then(() => vkApi('friends.get', {fields: 'photo_100, city'}))
        .then(response => {
            allFriends = response.items;
            showFriends(allFriends, friendsContainer);
        });
};

// поиск друзей
content.addEventListener('keyup', function (e) {
    let target = e.target;

    if (e.target.tagName === 'INPUT') {
        let filterString = target.value.toLowerCase();
        let container = target.parentNode.nextElementSibling.children[1];
        let parent = target.parentNode.nextElementSibling.classList[1];
        let friends = (parent === 'all-friends') ? allFriends : selectFriends;

        container.innerHTML = '';
        //проверка на пустой массив
        friends = filterFriends(friends, filterString);
        showFriends(friends, container);
    }
});

// перенос элемента по клику на кнопке
friendsContainer.addEventListener('click', function (e) {
    let target = e.target;

    if (target.tagName === 'BUTTON') {
        let friendID = e.target.parentNode.dataset.id;

        let ndx = allFriends.findIndex(item => +item.id === +friendID);

        selectFriends = selectFriends.concat(allFriends.splice(ndx, 1));

        showFriends(allFriends, friendsContainer);
        showFriends(selectFriends, selectedContainer);
    }
});
