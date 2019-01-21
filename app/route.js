let request = require('request');

var express = require('express'),
    router = express.Router(),
    cmd = require('./command'),
    loungeApi = require('./services/apiExternaLounge');

router.get('/', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    // cmd.getCountries(req, res);
    res.send(JSON.stringify({a: 1}));
});

router.get('/teste', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    cmd.getCountries(req, res);

});
//
router.get('/sync', function (req, res, next) {
    res.set('Content-Type', 'application/json');

    request
        .get({
                url: process.env.API_LOUNGE_URL_FACILITIES + '?lang=pt-br',
                insecure: true
            }
        )
        .on('response', function (response) {
            res.send(JSON.stringify({'msg': response}));
        }).on('error', function (err) {
        res.send(JSON.stringify({'msg': err}));
    })
})
;

router.get('/get-countries', function (req, res, next) {
    cmd.getCountries(req, res)
});

router.get('/pagecount', function (req, res, next) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({a: 1}));
});

module.exports = router;
