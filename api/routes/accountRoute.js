'use strict';
module.exports = function(app) {
  var account = require('../controllers/accountController');

  app.route('/account/login')
    .post(account.login);

  app.route('/account/register')
    .post(account.register);
};
