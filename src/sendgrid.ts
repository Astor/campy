import { ISendGridMessage } from "./messages";

const sgMail = require('@sendgrid/mail');
const sendGridKey = process.env.SENDGRID_API_KEY || 'SendGridKeyMissing';
console.log('sendGridKey', sendGridKey);
sgMail.setApiKey(sendGridKey);

// SEND GRID

/**
 * Send a message object using SendGrid.
 * @param msg Message object to send via SendGrid.
 * @returns true if in development and if the Message succeeded or false if the Message failed.
 */
export async function sendMessage(msg: ISendGridMessage): Promise<boolean> {
    try {
        await sgMail.send(msg);
      } catch (error:any) {
        console.error(error);
        
        if (error.response) {
          console.error(error.response.body)
        }
        return false;
      }
    return true;
  }