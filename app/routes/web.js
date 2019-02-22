/*
|
| Arquivo de rotas ...
|
*/

// importando controller...
let appController = require('../command');

module.exports = function (app) {

    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
        next();
    });

    app.get('/get-countries', function (request, response) {

        appController.getCountries(request, response)

    });

    app.get('/get-cities-by-country', function (request, response) {

        appController.getCitiesByCountry(request, response)

    });

    app.get('/get-lounges-by-city-and-country', function (request, response) {

        appController.getLoungesByCityAndCountry(request, response)

    });

    app.get('/administrador/reset-token', function (request, response) {

        appController.resetToken(request, response)

    });

    app.get('/administrador/last-sync', function (request, response) {

        appController.lastSync(request, response)

    });

};