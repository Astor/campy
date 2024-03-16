import cors from 'cors';
import express from 'express';

import { IContactMessage, IVolunteerMessage} from './messages';
import { contactMessageHandler } from './services/contact';
import { volunteerMessageHandler } from './services/volunteer';
import { decodeMessage, encryptMessage } from './services/crypto';

const app = express();
app.use(express.json());
// Enable CORS for any origin and for all routes
// for specific add the url: 'http://localhost:3000'
const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

const hostname = process.env.HOSTNAME;
const port = parseInt(process.env.PORT || '5000');
const verifiedEmail = process.env.VERIFIED_EMAIL || 'VerifiedEmailMissing';
console.log('verifiedEmail', verifiedEmail);

// Server KeyPair (Todo pull from DB or Secrets)
const SERVER_PUBLIC_KEY = process.env.SERVER_PUBLIC_KEY || 'ServerPublicKeyMissing';
const SERVER_PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY || 'ServerPrivateKeyMissing';

// Campaign Public Key (Todo pull from DB or Secrets)
const CAMPAIGN_PUBLIC_KEY = process.env.CAMPAIGN_PUBLIC_KEY || 'CampaignPublicKeyMissing';

const keyPair = {
  pk: SERVER_PUBLIC_KEY,
  sk: SERVER_PRIVATE_KEY
}

// ROUTES

/**
 * Base / route
 */
app.get('/', (_, res) => {
  res.send('Campy v1.0.0');
});

/**
 * Simple PINGU /ping route
 */
app.get('/ping', (_, res) => {
  res.send('pong!');
});

// POST contact method route
app.post('/service/contact', async (req, res) => {
  try {
    const messageBody = req.body;
    const decoded = decodeMessage(messageBody, keyPair.sk);
    const contactMessage = JSON.parse(decoded.toString('utf-8'));
    // Contact message is not saved to DB. Ephemeral data.
    let msg:IContactMessage = {
      name: contactMessage.name,
      email: contactMessage.email,
      message: contactMessage.message
    };

    let result = await contactMessageHandler(verifiedEmail, msg);
    res.send({ message: 'Contact data received', success: result });
  } catch (error:any) {
    res.send({ message: 'Contact error', error:error.message, success: false });
  }
});

// POST volunteer method route
app.post('/service/volunteer', async (req, res) => {
  try {
    const messageBody = req.body;
    const decoded = decodeMessage(messageBody, keyPair.sk);
    const volMessage = JSON.parse(decoded.toString('utf-8'));
    // Volunteer message data saved to DB. Non-ephemeral data.
    let msg:IVolunteerMessage = {
      email: encryptMessage(volMessage.email, CAMPAIGN_PUBLIC_KEY),
      name:  encryptMessage(volMessage.name, CAMPAIGN_PUBLIC_KEY),
      phone: encryptMessage(volMessage.phone, CAMPAIGN_PUBLIC_KEY),
      activities: volMessage.activities
    };
    
    let result = await volunteerMessageHandler(verifiedEmail, msg);
    res.send({ message: 'Volunteer data received', success: result });
  } catch (error:any) {
    res.send({ message: 'Volunteer error', error:error.message, success: false });
  }
});

/**
 * Start CAMPY on port.
 */
app.listen(port, () => {
  console.log(`CAMPY running at http://${hostname}:${port}/`);
});