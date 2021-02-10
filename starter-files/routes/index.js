const express = require('express');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const router = express.Router();
const ctrl = require('./../controllers/storectrl');
const usrctrl = require('./../controllers/usrctrl');
const { catchErrors } = require('../handlers/errorHandlers'); // object descructoring

// Do work here
// router.get('/', (req, res) => {
//   // req data what coming in
//   // res methods to sent to back
//   // next middleware
//   console.log('incoming request');
//   const mjson = {
//     router: 'this is good',
//     query: `name in query params => ${req.query.name}`,
//     req: req.query,
//   };
//   res.json(mjson);
// });

// variable as params in the request
router.get('/test/:name', (req, res) => {
  res.send(req.params.name);
});

router.get('/rv/:rv', (req, res) => {
  const reverse = [...req.params.rv].reverse().join('');
  res.json({
    task: `new rv task : ${reverse}.765`,
  });
});

// pug jade and res.render views folder
router.get('/pug', (req, res) => {
  res.render('hi');
});
router.get('/pug2/:owner', (req, res) => {
  const owner = req.params.owner;
  res.render('hi2', {
    name: 'Binky',
    owner: [owner[0].toUpperCase(), owner.slice(1)].join(''),
    title: ':LOL',
  });
});

router.get('/ctrl', ctrl.middleWare, ctrl.homePage);
router.get('/err', ctrl.err);

router.get('/add', ctrl.add);
// router.post('/add', ctrl.create);
router.post('/add', ctrl.upload, catchErrors(ctrl.resize), catchErrors(ctrl.createWrapped)); // immediately runs catchErrors funciton ->
router.post('/add/:id', ctrl.upload, catchErrors(ctrl.resize), catchErrors(ctrl.updateStore));

// --------------------------------------------------

router.get('/', catchErrors(ctrl.getStores));
router.get('/stores', catchErrors(ctrl.getStores));
router.get('/stores/:id/edit', catchErrors(ctrl.editStore));

router.get('/store/:slug', catchErrors(ctrl.getStoreBySlug));

router.get('/tags', catchErrors(ctrl.getStoresByTag));
router.get('/tags/:tag', catchErrors(ctrl.getStoresByTag));

// --------------------------------------------------

router.get('/login', catchErrors(usrctrl.login));
router.get('/register', catchErrors(usrctrl.register));

// validate reg data
// register the user
// log in
router.post(
  '/register',
  usrctrl.validateRegister
  // ,
  // catchErrors(usrctrl.login)
);

module.exports = router;
