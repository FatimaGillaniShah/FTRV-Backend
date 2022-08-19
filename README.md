## FunTown Backend


## Setup
* Clone the code in any directory
* Move to directory from terminal
* Rename .envtemplate to .env and add values to variables accordingly
* Create postgres database and schema. provide credential details in .env
* Run migrations ` npx sequlize-cli db:migrate`
* Run seed data ` npx sequlize-cli db:seed:all`
* Run `npm install`
* The command `npm run migration:scripts` is for running feature related scripts, to run acl feature script you must pass parameter e.g `npm run migration:scripts acl-feature`
* Run `npm run dev` to start with `nodemon`. This will launch application at http://localhost:3000. You can change port in env variable PORT
* Create folder `/public/uploads`
## Authentication

Authentication is based on [json web tokens](https://jwt.io). `passport-jwt` strategy is used to handle the email /
password authentication.

## PM2 Logs rotation

* To enable pm2 logs file rotation ,use the pm2 module ` pm2-logrotate` 
* Run ` pm2 install pm2-logrotate`  to install   Note: the command is ` pm2 install`  NOT ` npm install` 

## API

All APIs documentation is available on: `/api-docs` as openapi spec
