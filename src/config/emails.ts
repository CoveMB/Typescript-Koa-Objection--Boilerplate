import sgMail from '@sendgrid/mail';
import { sendGridSecret } from 'config/variables';

sgMail.setApiKey(sendGridSecret);

export default sgMail;
