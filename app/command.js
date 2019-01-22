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
        db.collection('lounge_token').insertOne({token: data.token, created_at: new Date()})
    });


    // return response.send('ok');

};
command.cleanALl = function (request, response) {

    mongodb(function (db) {
        db.collection('lounge_token').deleteMany();
        db.collection('lounges').deleteMany();
        db.collection('lounge_facilities').deleteMany();
    });

}

command.importFileJsonLounge = function (request, response) {

    var jsonData = fs.readFileSync("./lounges.json", "utf8");
    var data = JSON.parse(jsonData);
    console.log(data);
    for (var i = 0; data.length < i; i++) {
        mongodb(function (db) {
            console.log(data[i].country, data[i].city)
            db.collection('lounges').insertOne({
                dci_code: data[i].dci_code,
                lang: 'pt-br',
                facilities: data[i].facilities,
                telephone: data[i].telephone,
                fax: data[i].fax,
                lounge_name: data[i].lounge_name,
                airport_name: data[i].airport_name,
                updated_at: data[i].updated_at,
                lounge_status: data[i].lounge_status,
                comments: data[i].comments,
                guest_currency: data[i].guest_currency,
                guest_fee_rate: data[i].guest_fee_rate,
                fee_notes: data[i].fee_notes,
                slug: data[i].slug,
                provider: data[i].provider,
                country: data[i].country,
                city: data[i].city,
                id_country_slug: data[i].country.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, ''),
                id_city_slug: data[i].city.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, ''),
                terminal: data[i].terminal,
                location: data[i].location,
                marketing_copy: data[i].marketing_copy,
                opening_hours: data[i].opening_hours,
                conditions: data[i].conditions,
                additional: data[i].additional,
                terminal_accessibility: data[i].terminal_accessibility,
                created_at: new Date()
            });

        });
    }


    // return response.send('ok');

};

command.importFileJsonLoungeFacilities = function (request, response) {
    var jsonData = fs.readFileSync("./lounges_facilities.json", "utf8");
    var data = JSON.parse(jsonData);
    console.log(data);

    for (var i = 0; i < data.length; i++) {
        mongodb(function (db) {
            console.log(data[i])
            db.collection('lounge_facilities').insertOne({
                lang: 'pt-br',
                token: data[i].token,
                name: data[i].string,
                created_at: new Date(),
                updated_at: new Date()

            })

        });
    }

    // return response.send('ok');

};


module.exports = command;