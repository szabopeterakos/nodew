const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log('>>>>>>>>>>>>>>', req.name);
  res.render('index');
};

exports.middleWare = (req, res, next) => {
  req.name = 'dfghjk'.toUpperCase();
  next();
};

exports.err = (req, resp, next) => {
  throw Error('That is so so bad :(');
};

exports.add = (req, res) => {
  // res.send('oke');
  res.render('edit', { title: 'Add Store >>' });
};

exports.create = async (req, res) => {
  // res.send('done');
  // try {
  //   const store = new Store(req.body);
  //   await store.save();
  // } catch (err) {
  // store
  //   .save()
  //   .then((store) => {
  //     return Store.find();
  //   })
  //   .then((store) => {
  //     res.json(store);
  //   })
  //   .catch((err) => {
  //     throw Error(err);
  //   });
  // res.json(req.body);
};

exports.createWrapped = async (req, res) => {
  const store = await new Store(req.body).save(); // a save return value contains the store.slug what is generated on db side.
  await store.save();
  req.flash('info', `Successfully created ${store.name}`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. query the db to get list of all
  const stores = await Store.find();
  console.log('🚀 ~ file: storectrl.js ~ line 53 ~ exports.getStores= ~ stores', stores);
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  //find
  const store = await Store.findOne({ _id: req.params.id });
  // res.json(store);
  // confirm

  // render out
  res.render('edit', { title: `Edit Store ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true, // return the new data not the old
      runValidators: true,
    }
  ).exec();
  req.flash('success', 'Updated');
  // render out
  res.redirect(`/stores/${store._id}/edit`);
};
