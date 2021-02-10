const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // set mongoose io style to global promise like browser global variable
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
    trim: true,
    required: 'Please supply an email address',
  },
  name: {
    type: String,
    trim: true,
    required: 'Please supply a  name',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

schema.virtual('gravatar').get(function () {
  // return `https://6b33.net/wp-content/uploads/2019/11/black-widow-big-boobs-pictures_4475_1_beautiful.jpg`;
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

schema.plugin(passportLocalMongoose, { usernameField: 'email' });
schema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', schema); // this is the main thing to add when somebody require something :D rather than exports.something=
