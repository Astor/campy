import { IContactMessage, ISendGridMessage, buildContactMessage } from "../messages";
import { sendMessage } from "../sendgrid";

export async function contactMessageHandler(verifiedEmail:string, msg:IContactMessage):Promise<boolean> {
    try {
      let userName:string = msg.name;
      let email:string = msg.email;
      let message:ISendGridMessage = buildContactMessage(verifiedEmail, userName, email, msg.message);
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