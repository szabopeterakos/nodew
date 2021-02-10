const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // set mongoose io style to golbal promiste like browser global variable
const slug = require('slugs');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates!',
      },
    ],
    address: {
      type: String,
      required: 'You must supply an address!',
    },
  },
  photo: String
});

schema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Store', schema);
