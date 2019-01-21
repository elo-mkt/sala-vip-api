require('dotenv-safe').load();
let mongodb = require('./../config/mongodb');
let Request = require('request');


module.exports = function () {

    console.log('sync init...');
    console.log('search token...');
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    mongodb(function (db) {

        db.collection('lounge_token').findOne(function (err, result) {

            if (result != null){

                let now = new Date();

                var diffHours = now.getHours() - result.created_at.getHours();

                if (diffHours > 2){
                    Request.post({
                        "url": process.env.API_LOUNGE_URL_TOKEN,
                        "strictSSL": false,
                        "body": JSON.stringify({
                            "username": process.env.API_LOUNGE_USERNAME,
                            "password": process.env.API_LOUNGE_PASSWORD
                        })
                    }, (error, response, body) => {
                        if(error) {return console.log(error);}

                        var resultNewToken = JSON.parse(body);

                        db.collection('lounge_token').updateOne(
                            {token: result.token},
                            {$set: {token: resultNewToken.token, created_at: new Date()}}, function (error, result) {
                                console.log('update facilities...');

                                Request.get({
                                    'headers': {
                                        'content_type' : "application/json; charset=UTF-8",
                                        'accept-language' : "en-US,en;q=0.5",
                                        'api_key' : result.token,
                                        'authorization' : 'Bearer ' + result.token
                                    },
                                    'url': process.env.API_LOUNGE_URL_FACILITIES + '?lang=pt-br',
                                }, (error, response, body) => {
                                    if(error) {
                                        return console.dir(error);
                                    }

                                    var facilities = JSON.parse(body);

                                    facilities.result.forEach(function (valor, chave) {

                                        db.collection('lounge_facilities').findOne({token: valor.token, lang: valor.lang},
                                            function (error, result) {

                                                if (result != null){
                                                    db.collection('lounge_facilities').updateOne(
                                                        {token: valor.token, lang: valor.lang},
                                                        {
                                                            $set: {
                                                                name: valor.string,
                                                                updated_at: new Date(),
                                                            }
                                                        }
                                                    )
                                                }else{
                                                    db.collection('lounge_facilities').insertOne({
                                                        lang: valor.lang,
                                                        token: valor.token,
                                                        name: valor.string,
                                                        created_at: new Date(),
                                                        updated_at: new Date()

                                                    })
                                                }
                                            })

                                    });
                                });

                                console.log('finished update facilities...');
                                console.log('updated lounges...');


                                Request.get({
                                    'headers': {
                                        'content_type' : "application/json; charset=UTF-8",
                                        'accept-language' : "en-US,en;q=0.5",
                                        'api_key' : result.token,
                                        'authorization' : 'Bearer ' + result.token
                                    },
                                    'url': process.env.API_LOUNGE_URL_LOUNGES + '?lang=pt-br',
                                }, (error, response, body) => {
                                    if(error) {
                                        return console.dir(error);
                                    }

                                    var list = JSON.parse(body);

                                    db.collection('lounges').deleteMany({});

                                    list.result.forEach(function (valor, chave) {
                                        db.collection('lounges').insertOne({
                                            dci_code: valor.dci_code,
                                            lang: 'pt-br',
                                            facilities: valor.facilities,
                                            telephone: valor.telephone,
                                            fax: valor.fax,
                                            lounge_name: valor.lounge_name,
                                            airport_name: valor.airport_name,
                                            updated_at: valor.updated_at,
                                            lounge_status: valor.lounge_status,
                                            comments: valor.comments,
                                            guest_currency: valor.guest_currency,
                                            guest_fee_rate: valor.guest_fee_rate,
                                            fee_notes: valor.fee_notes,
                                            slug: valor.slug,
                                            provider: valor.provider,
                                            country: valor.country,
                                            city: valor.city,
                                            id_country_slug: valor.country.toString().toLowerCase()
                                                .replace(/\s+/g, '-')           // Replace spaces with -
                                                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                                .replace(/^-+/, '')             // Trim - from start of text
                                                .replace(/-+$/, ''),
                                            id_city_slug: valor.city.toString().toLowerCase()
                                                .replace(/\s+/g, '-')           // Replace spaces with -
                                                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                                .replace(/^-+/, '')             // Trim - from start of text
                                                .replace(/-+$/, ''),
                                            terminal: valor.terminal,
                                            location: valor.location,
                                            marketing_copy:valor.marketing_copy,
                                            opening_hours:valor.opening_hours,
                                            conditions: valor.conditions,
                                            additional: valor.additional,
                                            terminal_accessibility: valor.terminal_accessibility,
                                            created_at: new Date()
                                        });

                                        db.collection('lounges').count({}, function (err, count) {
                                            if (count == list.result.length){
                                                dbClient.close();
                                            }
                                        })
                                    })

                                });
                            })
                    });
                }else{
                    console.log('update facilities...');

                    Request.get({
                        'headers': {
                            'content_type' : "application/json; charset=UTF-8",
                            'accept-language' : "en-US,en;q=0.5",
                            'api_key' : result.token,
                            'authorization' : 'Bearer ' + result.token
                        },
                        'url': process.env.API_LOUNGE_URL_FACILITIES + '?lang=pt-br',
                    }, (error, response, body) => {
                        if(error) {
                            return console.dir(error);
                        }

                        var facilities = JSON.parse(body);

                        facilities.result.forEach(function (valor, chave) {

                            db.collection('lounge_facilities').findOne({token: valor.token, lang: valor.lang},
                                function (error, result) {

                                    if (result != null){
                                        db.collection('lounge_facilities').updateOne(
                                            {token: valor.token, lang: valor.lang},
                                            {
                                                $set: {
                                                    name: valor.string,
                                                    updated_at: new Date(),
                                                }
                                            }
                                        )
                                    }else{
                                        db.collection('lounge_facilities').insertOne({
                                            lang: valor.lang,
                                            token: valor.token,
                                            name: valor.string,
                                            created_at: new Date(),
                                            updated_at: new Date()

                                        })
                                    }
                                })

                        });
                    });

                    console.log('finished update facilities...');
                    console.log('updated lounges...');


                    Request.get({
                        'headers': {
                            'content_type' : "application/json; charset=UTF-8",
                            'accept-language' : "en-US,en;q=0.5",
                            'api_key' : result.token,
                            'authorization' : 'Bearer ' + result.token
                        },
                        'url': process.env.API_LOUNGE_URL_LOUNGES + '?lang=pt-br',
                    }, (error, response, body) => {
                        if(error) {
                            return console.dir(error);
                        }

                        var list = JSON.parse(body);

                        db.collection('lounges').deleteMany({});

                        list.result.forEach(function (valor, chave) {
                            db.collection('lounges').insertOne({
                                dci_code: valor.dci_code,
                                lang: 'pt-br',
                                facilities: valor.facilities,
                                telephone: valor.telephone,
                                fax: valor.fax,
                                lounge_name: valor.lounge_name,
                                airport_name: valor.airport_name,
                                updated_at: valor.updated_at,
                                lounge_status: valor.lounge_status,
                                comments: valor.comments,
                                guest_currency: valor.guest_currency,
                                guest_fee_rate: valor.guest_fee_rate,
                                fee_notes: valor.fee_notes,
                                slug: valor.slug,
                                provider: valor.provider,
                                country: valor.country,
                                city: valor.city,
                                id_country_slug: valor.country.toString().toLowerCase()
                                    .replace(/\s+/g, '-')           // Replace spaces with -
                                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                    .replace(/^-+/, '')             // Trim - from start of text
                                    .replace(/-+$/, ''),
                                id_city_slug: valor.city.toString().toLowerCase()
                                    .replace(/\s+/g, '-')           // Replace spaces with -
                                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                    .replace(/^-+/, '')             // Trim - from start of text
                                    .replace(/-+$/, ''),
                                terminal: valor.terminal,
                                location: valor.location,
                                marketing_copy:valor.marketing_copy,
                                opening_hours:valor.opening_hours,
                                conditions: valor.conditions,
                                additional: valor.additional,
                                terminal_accessibility: valor.terminal_accessibility,
                                created_at: new Date()
                            });

                            db.collection('lounges').count({}, function (err, count) {
                                if (count == list.result.length){
                                    dbClient.close();
                                }
                            })
                        })
                    });

                }

            }else{
                Request.post({
                    "url": process.env.API_LOUNGE_URL_TOKEN,
                    "body": JSON.stringify({
                        "username": process.env.API_LOUNGE_USERNAME,
                        "password": process.env.API_LOUNGE_PASSWORD
                    })
                }, (error, response, body) => {
                    if(error) {return console.log(error);}

                    var resultNewToken = JSON.parse(body);

                    db.collection('lounge_token').insertOne({token: resultNewToken.token, created_at: new Date()},
                        function (error, result) {
                            console.log('update facilities...');

                            Request.get({
                                'headers': {
                                    'content_type' : "application/json; charset=UTF-8",
                                    'accept-language' : "en-US,en;q=0.5",
                                    'api_key' : resultNewToken.token,
                                    'authorization' : 'Bearer ' + resultNewToken.token
                                },
                                'url': process.env.API_LOUNGE_URL_FACILITIES + '?lang=pt-br',
                            }, (error, response, body) => {
                                if(error) {
                                    return console.dir(error);
                                }

                                var facilities = JSON.parse(body);

                                facilities.result.forEach(function (valor, chave) {

                                    db.collection('lounge_facilities').findOne({token: valor.token, lang: valor.lang},
                                        function (error, result) {


                                            if (result != null){
                                                db.collection('lounge_facilities').updateOne(
                                                    {token: valor.token, lang: valor.lang},
                                                    {
                                                        $set: {
                                                            name: valor.string,
                                                            updated_at: new Date(),
                                                        }
                                                    }
                                                )
                                            }else{
                                                db.collection('lounge_facilities').insertOne({
                                                    lang: valor.lang,
                                                    token: valor.token,
                                                    name: valor.string,
                                                    created_at: new Date(),
                                                    updated_at: new Date()

                                                })
                                            }
                                        })

                                });
                            });

                            console.log('finished update facilities...');
                            console.log('updated lounges...');


                            Request.get({
                                'headers': {
                                    'content_type' : "application/json; charset=UTF-8",
                                    'accept-language' : "en-US,en;q=0.5",
                                    'api_key' : resultNewToken.token,
                                    'authorization' : 'Bearer ' + resultNewToken.token
                                },
                                'url': process.env.API_LOUNGE_URL_LOUNGES + '?lang=pt-br',
                            }, (error, response, body) => {
                                if(error) {
                                    return console.dir(error);
                                }

                                var list = JSON.parse(body);

                                db.collection('lounges').deleteMany({});

                                list.result.forEach(function (valor, chave) {
                                    db.collection('lounges').insertOne({
                                        dci_code: valor.dci_code,
                                        lang: 'pt-br',
                                        facilities: valor.facilities,
                                        telephone: valor.telephone,
                                        fax: valor.fax,
                                        lounge_name: valor.lounge_name,
                                        airport_name: valor.airport_name,
                                        updated_at: valor.updated_at,
                                        lounge_status: valor.lounge_status,
                                        comments: valor.comments,
                                        guest_currency: valor.guest_currency,
                                        guest_fee_rate: valor.guest_fee_rate,
                                        fee_notes: valor.fee_notes,
                                        slug: valor.slug,
                                        provider: valor.provider,
                                        country: valor.country,
                                        city: valor.city,
                                        id_country_slug: valor.country.toString().toLowerCase()
                                            .replace(/\s+/g, '-')           // Replace spaces with -
                                            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                            .replace(/^-+/, '')             // Trim - from start of text
                                            .replace(/-+$/, ''),
                                        id_city_slug: valor.city.toString().toLowerCase()
                                            .replace(/\s+/g, '-')           // Replace spaces with -
                                            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                                            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                                            .replace(/^-+/, '')             // Trim - from start of text
                                            .replace(/-+$/, ''),
                                        terminal: valor.terminal,
                                        location: valor.location,
                                        marketing_copy:valor.marketing_copy,
                                        opening_hours:valor.opening_hours,
                                        conditions: valor.conditions,
                                        additional: valor.additional,
                                        terminal_accessibility: valor.terminal_accessibility,
                                        created_at: new Date()
                                    });

                                    db.collection('lounges').count({}, function (err, count) {
                                        if (count == list.result.length){
                                            dbClient.close();
                                        }
                                    })
                                })

                            });
                        })
                });
            }

        });

    });

};