const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const server = require('http').Server(app);

const socketHandler = require('./services/socket');
const dotenv = require('dotenv');
const initRoutes = require('./routes/index.route');

dotenv.config();
const ip = (process.env.NODE_ENV === 'production')
    ? process.env.PROD_HTTPD_IP
    : process.env.DEV_HTTPD_IP;
const port = (process.env.NODE_ENV === 'production')
    ? process.env.PROD_HTTPD_PORT
    : process.env.DEV_HTTPD_PORT
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
const root = path.join(__dirname, 'public');
app.use(express.static(root));
//[cookie-parser] Parse cookie header
app.use(cookieParser());
//[body-parser] Parse request object as a JSON object: application/json
app.use(bodyParser.json({
    extended: true,
    limit: '50mb'
}));
//[body-parser] Parse urlencoded bodies: application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

//API routes
initRoutes(app);

//Serving React
app.get('*', (req, res) => {
    res.sendFile('index.html', { root });
});

io.on('connection', (socket) => {
    socketHandler(io, socket);
});

server.listen(port, ip, () => {
    console.log(`Running on [${ip}]:${port}`);
    console.log(`Mode: ${process.env.NODE_ENV}`)
});
