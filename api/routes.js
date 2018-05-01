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
  
  app.route('/api/auth/me')
    .get(auth.me);
  
  app.route('/api/auth/count')
    .get(auth.userCount);
  
  app.route('/api/categories')
    .get(categories.categories);
  
  app.route('/api/categories/count')
    .get(categories.categoryCount);
  
  app.route('/api/events')
    .get(events.events)
    .post(events.addEvent, VerifyToken);

  app.route('/api/events/:id')
    .post(events.deleteEvent, VerifyToken);
  
  app.route('/api/eventDetail/:id')
    .get(events.eventDetail)

  app.route('/api/events/count')
    .get(events.eventCount);
};
