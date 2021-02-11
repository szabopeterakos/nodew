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
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // refer the created User in the user.js
    required: 'You must supply an author',
  },
});

schema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  // find other in already stored
  const regex = new RegExp(`^(${this.slug})((-[0-9]*$)?)`, 'i'); // -i case insensitive
  const storesWithPostFix = await this.constructor.find({ slug: regex });
  if (storesWithPostFix.length) {
    this.slug = `${this.slug}-${storesWithPostFix.length + 1}`;
  }
  next();
});

// default function needed to bound via this to the model itself.
schema.statics.getTags = function () {
  // https://docs.mongodb.com/manual/reference/operator/aggregation/
  return this.aggregate([
    { $unwind: '$tags' },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
};

module.exports = mongoose.model('Store', schema);
