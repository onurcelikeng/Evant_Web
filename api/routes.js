'use strict';
module.exports = function(app) {
  var account = require('./controllers/accountController');
  var statistics = require('./controllers/statisticsController');

  app.route('/account/login')
    .post(account.login);

  app.route('/account/register')
    .post(account.register);

  app.route('/statistics')
    .get(statistics.getStatistics)
};
