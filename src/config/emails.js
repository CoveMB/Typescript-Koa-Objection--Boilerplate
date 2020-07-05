const sgMail = require('@sendgrid/mail');
const { sendGridSecret } = require('config/variables');

sgMail.setApiKey(sendGridSecret);

module.exports = sgMail;
