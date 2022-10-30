const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const server = require('http').Server(app);

const dbConnection = require("./config/db/index.db");
const socketHandler = require('./services/socket');
const dotenv = require('dotenv');
const initRoutes = require('./routes/index.route');

dotenv.config();
const frontendHostName = process.env.FRONTEND_HOST;

const corsOptions = {
    origin: frontendHostName,
    credentials: true,          //access-control-allow-credentials: true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const io = require('socket.io')(server, {
    cors: corsOptions
});

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
io.on('connection', (socket) => {
    socketHandler(io, socket);
});

server.listen(3030, () => {
    console.log(`Running`);
});
