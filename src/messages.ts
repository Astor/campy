export interface IContactMessage {
  name:string,
  email:string,
  message:string
}

export interface ISendGridMessage {
  to:string,
  from:string,
  subject:string,
  html:string
};

export interface IVolunteerMessage {
  email:string,
  name:string,
  phone:string,
  activities:Array<string>
}

// MESSAGE BUILDERS (TODO Pull Subject and Messages from CAMPY DB)

export function buildContactMessage(verifiedEmail:string, name:string, from:string, msg:string):ISendGridMessage {
  const message:ISendGridMessage = {
      to: `${verifiedEmail}`,
      from: `${verifiedEmail}`,
      subject: 'New Message from GuadalupeReyesForAssemblyDistrict41.com',
      html: `Name:${name}, Email:${from}, <br/> ${msg}`
    };
  return message;
}

export function buildVolunteerMessage(verifiedEmail:string, to:string):ISendGridMessage {
  const message = {
      to: to,
      from: `${verifiedEmail}`,
      subject: 'Message from Team Reyes',
      html: `Thank you for volunteering! A member of our team will be in touch with your shortly.<br/>Team Reyes`,
    };
  return message;
}

export function buildVolunteerBackupMessage(verifiedEmail:string, vol:IVolunteerMessage):ISendGridMessage {
  const message:ISendGridMessage = {
      to: `${verifiedEmail}`,
      from: `${verifiedEmail}`,
      subject: 'New Volunteer Message from GuadalupeReyesForAssemblyDistrict41.com',
      html: `Name:${vol.name}, Email:${vol.email}, Phone:${vol.phone} <br/> Activities:${(vol.activities && vol.activities.length > 0)? vol.activities.toString(): 'None'}`
    };
  return message;
}