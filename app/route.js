let request = require('request');

var express = require('express'),
    cors = require('cors'),
    router = express.Router(),
    cmd = require('./command'),
    loungeApi = require('./services/apiExternaLounge'),
    app = express();

    // app.use(cors());
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://sala-vip.test/');

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

//SYNC
router.get('/sync1', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    cmd.importFileJsonLoungeToken(req, res);
});

router.get('/sync2', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    cmd.importFileJsonLounge(req, res);
});

router.get('/sync3', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    cmd.importFileJsonLoungeFacilities(req, res);
});

router.get('/sync', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    cmd.importFileJsonLoungeToken(req, res);
    cmd.importFileJsonLounge(req, res);
    cmd.importFileJsonLoungeFacilities(req, res);
});

//APP
router.get('/get-countries', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cmd.getCountries(req, res)
});

router.get('/get-cities-by-country', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cmd.getCitiesByCountry(req, res)
});

router.get('/get-lounges-by-city-and-country', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    cmd.getLoungesByCityAndCountry(req, res)
});

router.get('/administrador/reset-token', function (req, res, next) {
    cmd.resetToken(req, res)
});

router.get('/administrador/last-sync', function (req, res, next) {
    cmd.lastSync(req, res)
});


router.get('/administrador/import-file-lounge-token-json', function (req, res, next) {
    cmd.importFileJsonLoungeToken(req, res)
});

router.get('/adminsitrador/import-file-lounges-json', function (req, res, next) {
    cmd.importFileJsonLounge(req, res)
});

router.get('/administrador/import-file-lounges-facilities', function (req, res, next) {
    cmd.importFileJsonLoungeFacilities(req, res)
});

router.get('/administrador/clean-all', function (req, res, next) {
    cmd.cleanALl(req, res)
});

// //
// router.get('/sync', function (req, res, next) {
//     res.set('Content-Type', 'application/json');
//     request
//         .get({
//                 url: process.env.API_LOUNGE_URL_FACILITIES + '?lang=pt-br',
//                 rejectUnauthorized: false,
//                 strictSSL: false
//             }
//         )
//         .on('response', function (response) {
//             res.send(JSON.stringify({'msg': response}));
//         });
// });

//CONTROL
router.get('/', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({1: 1}));
});

router.get('/pagecount', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({a: 1}));
});

module.exports = router;
