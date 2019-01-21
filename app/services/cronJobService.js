const CronJob = require('cron').CronJob;
let apiExternalLounge = require('./apiExternaLounge');

module.exports = function(){

    console.log('Antes de iniciar job');

    new CronJob('*/5 * * * *', function() {

        apiExternalLounge();

        const d = new Date();
        console.log('Job executado em ' + d);

    }, null, true, 'America/Fortaleza');

    console.log('Depois de iniciar job');

};
