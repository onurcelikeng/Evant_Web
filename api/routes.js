'use strict';
module.exports = function(app) {
  var account = require('./controllers/accountController');
  var statistics = require('./controllers/statisticsController');
  var categories = require('./controllers/categoryController');

  app.route('/api/account/')
    .post(account.login);

  app.route('/api/account/register')
    .post(account.register);

  app.route('/api/statistics')
    .get(statistics.getStatistics);

  app.route('/api/categories')
    .get(categories.getCategories);
};
