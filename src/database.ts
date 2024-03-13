import { createPool } from 'mysql2/promise';
import { IVolunteerMessage } from "./messages";

const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;
const dbSchema = process.env.DB_SCHEMA;

console.log('dbHost', dbHost);
console.log('dbPort', dbPort);
console.log('dbUser', dbUser);
console.log('dbSchema', dbSchema);

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

// MYSQL

/**
 * Insert volunteer IVolunteerMessage into database.
 * @param payload IVolunteerMessage message payload to insert into CAMP DB.
 */
export async function insertUserData(payload:IVolunteerMessage) {
    
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
