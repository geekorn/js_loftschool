module.exports = {
    login(appID, permissions) {
        return new Promise((resolve, reject) => {
            VK.init({
                apiId: appID
            });

            VK.Auth.login(data => {
                if (data.session) {
                    resolve(data);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, permissions);
        });
    },
    callApi (method, options) {
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
    },
    getUser() {
        return this.callApi('users.get', {});
    },
    getFriends () {
        return this.callApi('friends.get', { fields: 'photo_100,city,country' });
    }
};