const mongoose = require('mongoose');

exports.login = async (req, res) => {
  res.render('login', { title: 'Master Login' });
  // res.send('login :D')
};

exports.register = async (req, res) => {
  res.render('register', { title: 'Master Register' });
  // res.send('login :D')
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
