import { insertUserData } from "../database";
import { ISendGridMessage, IVolunteerMessage, buildVolunteerBackupMessage, buildVolunteerMessage } from "../messages";
import { sendMessage } from "../sendgrid";

export async function volunteerMessageHandler(verifiedEmail:string, msg:IVolunteerMessage):Promise<boolean> {
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
      const volMessage = buildVolunteerBackupMessage(verifiedEmail, volPayload);
    }
    // Send Volunteer Thank you Message
    let message:ISendGridMessage = buildVolunteerMessage(verifiedEmail, email);
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