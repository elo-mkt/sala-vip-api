/*
|
| Arquivo de rotas ...
|
*/

// importando controller...
let appController = require('../command');

module.exports = function (app) {

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