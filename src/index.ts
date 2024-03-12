import cors from 'cors';
import express from 'express';
import { createPool } from 'mysql2/promise';

const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;
const dbSchema = process.env.DB_SCHEMA;

console.log('dbHost', dbHost);
console.log('dbPort', dbPort);
console.log('dbUser', dbUser);
console.log('dbSchema', dbSchema);

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
const verifiedEmail = 'guadalupe@guadalupereyesforassemblydistrict41.com';

const sgMail = require('@sendgrid/mail');
const sendGridKey = process.env.SENDGRID_API_KEY;
console.log('sendGridKey', sendGridKey);
sgMail.setApiKey(sendGridKey);

// Set up database connection
const pool = createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPass,
  database: dbSchema,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface IContactMessage {
  name:string,
  email:string,
  message:string
}

interface ISendGridMessage {
  to:string,
  from:string,
  subject:string,
  html:string
};

interface IVolunteerMessage {
  email:string,
  name:string,
  phone:string,
  activities:Array<string>
}

// MYSQL

/**
 * Insert volunteer IVolunteerMessage into database.
 * @param payload IVolunteerMessage message payload to insert into CAMP DB.
 */
async function insertUserData(payload:IVolunteerMessage) {
    
  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Insert user data
    const [userResult, userFields] = await connection.execute(
      'INSERT INTO users (username, email, phone) VALUES (?, ?, ?)',
      [payload.name, payload.email, payload.phone]
    );
      console.log(userResult);

      const userResultSetHeader:any = userResult;
      const userId = userResultSetHeader.insertId;

    // Assuming 'activities' contains the activity names to be looked up in the activities table.
    for (const activityName of payload.activities) {
      // First, find the activity_id based on the activity_name
      const [activityRows] = await connection.execute(
        'SELECT activity_id FROM activities WHERE activity_name = ?',
        [activityName]
      );
      
      const rows:any = activityRows;
      if (rows.length > 0) {
        const activityId = rows[0].activity_id;

        // Insert into user_activities
        await connection.execute(
          'INSERT INTO user_activities (user_id, activity_id) VALUES (?, ?)',
          [userId, activityId]
        );
      }
    }

    // Commit transaction
    await connection.commit();
  } catch (error) {
    // If error, rollback any changes made during the transaction
    await connection.rollback();
    throw error;
  } finally {
    // Always close the connection
    await connection.release();
  }
}

// SEND GRID

/**
 * Send a message object using SendGrid.
 * @param msg Message object to send via SendGrid.
 * @returns true if in development and if the Message succeeded or false if the Message failed.
 */
async function sendMessage(msg: ISendGridMessage): Promise<boolean> {
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

// MESSAGE BUILDERS

function buildContactMessage(name:string, from:string, msg:string):ISendGridMessage {
  const message:ISendGridMessage = {
      to: `${verifiedEmail}`,
      from: `${verifiedEmail}`,
      subject: 'New Message from GuadalupeReyesForAssemblyDistrict41.com',
      html: `Name:${name}, Email:${from}, <br/> ${msg}`
    };
  return message;
}

function buildVolunteerMessage(to:string):ISendGridMessage {
  const message = {
      to: to,
      from: `${verifiedEmail}`,
      subject: 'Message from Team Reyes',
      html: `Thank you for volunteering! A member of our team will be in touch with your shortly.<br/>Team Reyes`,
    };
  return message;
}

function buildVolunteerBackupMessage(vol:IVolunteerMessage):ISendGridMessage {
  const message:ISendGridMessage = {
      to: `${verifiedEmail}`,
      from: `${verifiedEmail}`,
      subject: 'New Volunteer Message from GuadalupeReyesForAssemblyDistrict41.com',
      html: `Name:${vol.name}, Email:${vol.email}, Phone:${vol.phone} <br/> Activities:${(vol.activities && vol.activities.length > 0)? vol.activities.toString(): 'None'}`
    };
  return message;
}

// ROUTE HANDLERS

async function contactMessageHandler(msg:IContactMessage):Promise<boolean> {
  try {
    let userName:string = msg.name;
    let email:string = msg.email;
    let message:ISendGridMessage = buildContactMessage(userName, email, msg.message);
    let sendResult:boolean = await sendMessage(message);
    console.log('sendResult:', sendResult);
    return sendResult;
  } catch(error:any) {
    console.error(error);
      
    if (error.response) {
      console.error(error.response.body)
    }
    return false;
  }
}

async function volunteerMessageHandler(msg:IVolunteerMessage):Promise<boolean> {
  try {
    let email:string = msg.email;
    let volPayload:IVolunteerMessage = {
      email: email,
      name:  msg.name,
      phone: msg.phone,
      activities: msg.activities
    };
    // Save Volunteer to DB
    try {
      await insertUserData(volPayload);
    } catch (error:any) {
      // Send email stating the Volunteer data was not added
      // to the database for some reason to not lose the volunteer opportunity
      console.log('insertUserData Error:', error.message);
    } finally {
      const volMessage = buildVolunteerBackupMessage(volPayload);
    }
    // Send Volunteer Thank you Message
    let message:ISendGridMessage = buildVolunteerMessage(email);
    let sendResult:boolean = await sendMessage(message);
    console.log('sendResult:', sendResult);
    return sendResult;

  } catch (error:any) {
    console.error(error);
      
    if (error.response) {
      console.error(error.response.body)
    }
    return false;
  }
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
  console.log(req.body);
  let msg:IContactMessage = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };
  let result = await contactMessageHandler(msg);
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
  let result = await volunteerMessageHandler(msg);
  res.send({ message: 'Volunteer data received', success: result });
});

/**
 * Start CAMPY on port.
 */
app.listen(port, () => {
  console.log(`CAMPY running at http://${hostname}:${port}/`);
});