## FunTown Backend


## Setup
* Clone the code in any directory
* Move to directory from terminal
* Rename .envtemplate to .env and add values to variables accordingly
* Create postgres database and schema. provide credential details in .env
* Run seed data ` npx sequlize-cli db:seed:all`
* Run `npm install`
* Run `npm run dev` to start with `nodemon`. This will launch application at http://localhost:3000. You can change port in env variable PORT
* Create folder `/public/uploads`
## Authentication

Authentication is based on [json web tokens](https://jwt.io). `passport-jwt` strategy is used to handle the email /
password authentication.

<br />

## API

All APIs documentation is available on: `/api-docs` as openapi spec