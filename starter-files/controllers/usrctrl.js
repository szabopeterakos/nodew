const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = async (req, res) => {
  res.render('login', { title: 'Master Login' });
};

exports.registerFrom = async (req, res) => {
  res.render('register', { title: 'Master Login' });
};

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new User({ email, name });
  // User.register(user, password, function(err,user){}); // from passport local model
  const registerWithPromise = promisify(User.register, User);
  await registerWithPromise(user, password);
  next();
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Error: supply a name').notEmpty();
  req.checkBody('email', 'Error: supply a valid email address').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Error: pass is required').notEmpty();
  req.checkBody('password-confirm', 'Error: pass is required').notEmpty();
  req.checkBody('password-confirm', 'Error: Do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash(
      'error',
      errors.map((err) => err.msg)
    );
    res.render('register', { title: 'Error in Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};
