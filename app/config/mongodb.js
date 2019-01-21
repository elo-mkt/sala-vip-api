let MongoClient = require('mongodb').MongoClient;
const HOST = 'mongodb.sala-vip-api-production.svc'
const PORT = '27017'
const DB = 'salavip'
const USER = 'userMONGOX'
const PASS = 'uSF6mr0QhuWT'
const HOST_MONGO = 'mongodb://' + USER + ':' + PASS + '@' + HOST + ':' + PORT + '/' + DB

module.exports = function (callback) {
    MongoClient.connect(HOST_MONGO, function (err, client) {
        if (err) throw err;

        console.log('success connection!');
        let db = client.db(DB);

        callback(db);
    });
};
