const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const dbConnection = require("./config/db/index.db");
const dotenv = require('dotenv');
const initRoutes = require('./routes/index.route');

dotenv.config();

const frontendHostName = process.env.FRONTEND_HOST;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,          //access-control-allow-credentials: true
    optionSuccessStatus: 200,
};

// const conn = dbConnection();
// conn.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// })

const app = express();
app.use(cors(corsOptions));

//------ Middleware -----//
//[express] Serving static files in express
app.use(express.static(path.join(__dirname, 'public')));
//[cookie-parser] Parse cookie header
app.use(cookieParser());
//[body-parser] Parse request object as a JSON object: application/json
app.use(bodyParser.json());
//[body-parser] Parse urlencoded bodies: application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

initRoutes(app);

app.listen(3030, () => {
    console.log(`Running`);
});
