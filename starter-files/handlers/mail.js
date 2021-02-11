const nodemailer = require('nodemailer'); // sending the email in our case smtp
const pug = require('pug');
const juice = require('juice'); // inline css
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// transport.sendMail({
//   from: 'test <test@mail.com>',
//   to: 'random@tommy.com',
//   subject: 'hy guys',
//   html: 'Hy <strong>guys</strong> :)',
//   text: 'Hy guys :(',
// });

const generateHtml = (filename, options = {}) => {
  let html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options); // __dirname - current dir what we are running from file.
  html = juice(html);
  return html;
};

exports.send = async (options) => {
  console.log('🚀 ~ file: mail.js ~ line 25 ~ exports.send= ~ options', options.user);
  const html = generateHtml(options.filename, options);
  const mailOpt = {
    from: process.env.MAIL_FROM,
    to: options.user.email,
    subject: options.subject,
    html,
    text: htmlToText.fromString(html),
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOpt);
};
