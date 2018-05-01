var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Category', new Schema({ 
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  }
}));
