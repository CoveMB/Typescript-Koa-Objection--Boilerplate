const sgMail = require('@sendgrid/mail');
const { sendGridSecret } = require('config/variables');

sgMail.setApiKey(sendGridSecret);

module.exports = {
  setApiKey() {

  },
  send() {

    // const msg = {
    //   to           : 'recipient@example.org',
    //   from         : 'sender@example.org',
    //   subject      : 'Hello world',
    //   html         : 'Hello HTML world!',
    //   mail_settings: {
    //     sandbox_mode: {
    //       enable: true
    //     }
    //   },
    // };

    // sgMail.send(msg);

  }
};
