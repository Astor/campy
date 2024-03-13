# CAMPY

Campaign API Services to manage:
- Contact
- Volunteers
- Newsletters

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