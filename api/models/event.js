var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Event', new Schema({ 
  photo: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createDate: {
    type: String,
    format: Date,
    required: true
  },
  start: {
    type: String,
    format: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true,
    properties: {
        id: mongoose.SchemaTypes.ObjectId,
        name: String
    }
  },
  category: {
    type: Object,
    required: true,
    properties: {
        id: mongoose.SchemaTypes.ObjectId,
        name: String
    }
  },
  address: {
    type: Object,
    required: true,
    properties: {
        city: String,
        town: String,
        fullAddress: String
    }
  },
  isDeleted: {
      type: Boolean,
      required: true
  }
}));
