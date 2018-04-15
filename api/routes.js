'use strict';
module.exports = function(app) {
  var auth = require('./controllers/authController');
  var categories = require('./controllers/categoryController');
  var events = require('./controllers/eventController');
  var VerifyToken = require('./auth/verifyToken');

  app.route('/api/auth/')
    .post(auth.login);

  app.route('/api/auth/register')
    .post(auth.register);
  
  app.route('/api/auth/count')
    .get(auth.getUserCount);
  
  app.route('/api/categories')
    .get(categories.getCategories);
  
  app.route('/api/categories/count')
    .get(categories.getCategoryCount);
  
  app.route('/api/events')
    .get(events.getEvents)
    .post(events.addEvent, VerifyToken);
  
  app.route('/api/events/count')
    .get(events.getEventCount);
};
