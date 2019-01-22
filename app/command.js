let mongodb = require('./config/mongodb');
const fs = require('fs');

// Api end points...
let command = {}

// Api end points...
command.getCountries = function (request, response) {

    mongodb(function (db) {
        db.collection('lounges').aggregate([
            {
                $group: {
                    _id: {
                        country: '$country',
                        id_country_slug: '$id_country_slug'
                    }
                }
            }
        ]).toArray(function (err, result) {
            return response.send(result);
        })

    });

};

command.getCitiesByCountry = function (request, response) {

    mongodb(function (db) {
        db.collection('lounges').aggregate([
            {
                $match: {
                    id_country_slug: request.query.id_country_slug
                }
            },
            {
                $group: {
                    _id: {
                        city: '$city', id_city_slug: '$id_city_slug'
                    }
                }
            }
        ]).toArray(function (err, result) {
            return response.send(result);
        });
    });

};

command.getLoungesByCityAndCountry = function (request, response) {

    mongodb(function (db) {
        db.collection('lounges').find(
            {id_city_slug: request.query.id_city_slug, id_country_slug: request.query.id_country_slug},
            {projection: {_id: 0}}
        ).toArray(function (err, result) {
            return response.send(result);
        });

    });
};


// Api end points para verificação interna...
command.resetToken = function (request, response) {
    mongodb(function (db) {
        db.collection('lounge_token').deleteMany({}, function (error, result) {

            return response.send({result: 'token deletado com sucesso.'});

        });
    });

};

command.lastSync = function (request, response) {
    mongodb(function (db) {
        db.collection('lounges').find({},
            {projection: {_id: 0, created_at: 1}}).sort({created_at: -1}
        ).toArray(function (err, result) {
            return response.send(result);
        })
    });

};


command.importFileJsonLoungeToken = function (request, response) {
    var jsonData = fs.readFileSync("./export_lounge_token.json", "utf8");
    var data = JSON.parse(jsonData);

    mongodb(function (db) {
        db.collection('lounge_token').deleteMany();
        db.collection('lounge_token').insertOne({token: data.token, created_at: new Date()})
    });


    return response.send('ok');

};

command.importFileJsonLounge = function (request, response) {

    var jsonData = fs.readFileSync("./lounges.json", "utf8");
    var data = JSON.parse(jsonData);

    mongodb(function (db) {
        db.collection('lounges').deleteMany();
    });

    for (var item in data) {

        mongodb(function (db) {

            db.collection('lounges').insertOne({
                dci_code: data[item].dci_code,
                lang: 'pt-br',
                facilities: data[item].facilities,
                telephone: data[item].telephone,
                fax: data[item].fax,
                lounge_name: data[item].lounge_name,
                airport_name: data[item].airport_name,
                updated_at: data[item].updated_at,
                lounge_status: data[item].lounge_status,
                comments: data[item].comments,
                guest_currency: data[item].guest_currency,
                guest_fee_rate: data[item].guest_fee_rate,
                fee_notes: data[item].fee_notes,
                slug: data[item].slug,
                provider: data[item].provider,
                country: data[item].country,
                city: data[item].city,
                id_country_slug: data[item].country.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, ''),
                id_city_slug: data[item].city.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, ''),
                terminal: data[item].terminal,
                location: data[item].location,
                marketing_copy: data[item].marketing_copy,
                opening_hours: data[item].opening_hours,
                conditions: data[item].conditions,
                additional: data[item].additional,
                terminal_accessibility: data[item].terminal_accessibility,
                created_at: new Date()
            });

        });
    }


    return response.send('ok');

};

command.importFileJsonLoungeFacilities = function (request, response) {
    var jsonData = fs.readFileSync("./lounges_facilities.json", "utf8");
    var data = JSON.parse(jsonData);


    mongodb(function (db) {
        db.collection('lounge_facilities').deleteMany();
    });

    for (var item in data) {

        mongodb(function (db) {

            db.collection('lounge_facilities').insertOne({
                lang: data[item].lang,
                token: data[item].token,
                name: data[item].string,
                created_at: new Date(),
                updated_at: new Date()

            })

        });
    }

    return response.send('ok');

};


module.exports = command;