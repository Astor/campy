import cors from 'cors';
import express from 'express';

import { IContactMessage, IVolunteerMessage} from './messages';
import { contactMessageHandler } from './services/contact';
import { volunteerMessageHandler } from './services/volunteer';

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
  console.log(req.body);
  let msg:IContactMessage = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };
  let result = await contactMessageHandler(verifiedEmail, msg);
  res.send({ message: 'Contact data received', success: result });
});

// POST volunteer method route
app.post('/service/volunteer', async (req, res) => {
  console.log(req.body);
  let msg:IVolunteerMessage = {
    email: req.body.email,
    name:  req.body.name,
    phone: req.body.phone,
    activities: req.body.activities
  };
  let result = await volunteerMessageHandler(verifiedEmail, msg);
  res.send({ message: 'Volunteer data received', success: result });
});

/**
 * Start CAMPY on port.
 */
app.listen(port, () => {
  console.log(`CAMPY running at http://${hostname}:${port}/`);
});