const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(), // where to strored,
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true); // next callback promise, first value means error, if first null, second something means is fine.
    } else {
      next({ message: 'This file is not allowed' }, false);
    }
  }, // what is allowed
};

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

// to upload a file for creation
exports.upload = multer(multerOptions).single('photo');
//resize
exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written to our filesystem -> keep going
  next();
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

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) return next();
  // res.json(store);
  res.render('store', { store, title: store.name });
};

exports.getStoresByTag1 = async (req, res) => {
  const tags = await Store.getTags();
  // res.json(tags);
  const activeTag = req.params.tag;
  res.render('tags', { tags, title: 'Tags', activeTag });
};

exports.getStoresByTag = async (req, res) => {
  const activeTag = req.params.tag;
  const _tags = Store.getTags();
  const _stores = Store.find({ tags: activeTag || { $exists: true } });
  const promiseLand = await Promise.all([_tags, _stores]);
  const [tags, stores] = await Promise.all([_tags, _stores]);

  // res.json(promiseLand);
  res.render('tags', { tags, stores, title: 'Tags', activeTag });
};
