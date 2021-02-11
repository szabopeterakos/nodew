const passport = require('passport');
const crypto = require('crypto'); // cryptographically secure random string
const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out now!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Oops must be logged in');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  // 1. see if a user whit that email exists
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    req.flash('error', 'Security issue to tell in this point the check happened, so email send to you :D');
    res.redirect('/login');
    return;
  }
  // 2. set reset token and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  // 3. send them an email whit token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `Here link with your secure token :D ${resetURL}`);
  // 4. redirect to login
  res.redirect('/login');
};

exports.token = async (req, res) => {
  // res.json(req.params.token);
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    res.redirect('/login');
    return;
  }
  // res.json(user);
  res.render('reset', { title: 'Reset your password' });
};

exports.confirmPass = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'The passwords do not match!');
  res.redirect('back');
};
exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    res.redirect('/login');
    return;
  }
  // user.setPassword();
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  const loggedUser = await user.save();
  await req.login(loggedUser); // passport js
  // res.send('OK');
  req.flash('success', 'Password update was successful, you are logged in !');
  res.redirect('/');
};
