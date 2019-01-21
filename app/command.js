let mongodb = require('./config/mongodb');

// Api end points...
var command = {}

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


module.exports = command;