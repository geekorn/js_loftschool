module.exports = {
    array: [],
    getRandomString() {

    },
    getRandomWord() {
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

        return fetch(url)
            .then( response => response.json() )
            .then( json => {
                let i = Math.floor(Math.random() * json.length);

                this.array = json;

                return json[i].name;
            })
    }
};