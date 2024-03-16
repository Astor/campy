# CAMPY

CAMPY offers a comprehensive Campaign Management Software solution, designed to streamline and optimize your campaign operations. Whether you're managing political campaigns, marketing initiatives, or community outreach programs, our software equips you with the tools you need for success. Key features include advanced contact management, volunteer coordination, personalized newsletter distribution, and sophisticated polling tools. 

With CAMPY, you can effectively organize your contacts, mobilize volunteers, engage your audience through targeted newsletters, and gain valuable insights from polls. Our intuitive interface and robust functionality make it easier than ever to coordinate your campaigns, ensuring maximum impact and efficiency. Elevate your campaign strategy with CAMPY, the ultimate tool for modern campaign management.

## Introducing CAMPY: The Ultimate Campaign Management Solution

Unlock the potential of your campaigns with CAMPY, the leading Software as a Service (SaaS) platform designed to revolutionize how you manage contacts, volunteers, newsletters, and polls. Our comprehensive suite, comprising both an API and a Client API alongside a user-friendly Desktop Administration interface, offers unparalleled flexibility and control, catering to all your campaign management needs.

## Key Features

**Integrated APIs**: Seamlessly manage your campaign's contacts, volunteers, newsletters, and polls with our robust API and Client API. These tools are designed to integrate effortlessly into your existing systems, providing a streamlined experience that saves time and enhances efficiency.

**Desktop Administration**: Gain complete oversight of your campaign operations with our Desktop Administration tool. Its intuitive design ensures that managing your campaign's moving parts is simpler and more effective than ever before.

## Unmatched Data Security

At CAMPY, we understand the paramount importance of data security. Our end-to-end encryption protocol ensures that your campaign's data is protected at every stage:

**Encryption at the Source**: We use ECIES Public/Private Keys to encrypt form data on the client side, safeguarding information from the moment it's captured.

**Secure Data Transmission**: Data is decrypted on our API server using ECIES Public/Private Keys, ensuring that it remains protected during transit.

**Campaign-Specific Encryption**: Once on our API server, data is re-encrypted using the Campaign Public Keys. This means that only the campaign owner has access to their data, ensuring absolute confidentiality and security.

With CAMPY, you can be confident that all your data is encrypted and stored with the highest security standards, giving you the freedom to focus on what truly matters—running successful campaigns.

## Why Choose CAMPY?

Choosing CAMPY means opting for a secure, efficient, and comprehensive campaign management solution. Whether you're looking to mobilize volunteers, engage with your contacts through personalized newsletters, or gather insights through polls, CAMPY provides all the tools and security you need to succeed.

Elevate your campaign management with CAMPY—where powerful features meet uncompromising security.

## Setup
CAMPY is using node v20.11.1 (npm v10.2.4). Install Node using [Node Version Manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

Once nvm is installed you can select 'lts/iron'
```sh
nvm use lts/iron
```

## CAMP-DB
Initialize a new MySQL database name 'camp_db', then generate the tables using the SQL file located in the data directory.

## Install
```sh
npm install
```

## Build
```sh
npm run build
```

## Watch
```sh
npm run watch
```

## Start
```sh
npm run start
```
