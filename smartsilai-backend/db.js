// gragging just specific 'Pool' tool from pg library instead of other not in use tools.
// A "Pool" keeps multiple database connections open so the server
//  can handle many requests quickly without restarting the connection every time.
const {Pool} = require('pg');

//we tell Node to look at pur .env file for the secrets
// Reads the .env file and loads its variables into process.env so the code can access them.
require('dotenv').config();

//Creating pool using secret creds => pool acts as a brigde between server and database.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

//We export this 'pool' so other files (like server.js) can use it
module.exports =pool;
