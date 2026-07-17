//Call Express app
const express = require('express');
//Create app
const app = express();
app.use(express.json());
const compression = require('compression');
//Call Cors
const cors = require('cors');
//Body Parser
const bodyParser = require('body-parser');
const http = require('http');
// const path = require('path');


const path = require('path');
// const fs = require('fs');
const { Server } = require('socket.io');
// const socketIo = require('socket.io');
const server = http.createServer(app);
// const app1 = require('./apps/app1/index');
// const app2 = require('./apps/app2/index');
// const app3 = require('./apps/app3/index');
const createSocketBroadcaster = require('./middleWare/createSocketBroadcaster.js');
// // Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: '*', // allow frontend connection
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    transports: ['websocket'], // force websocket only if needed
});

app.use(cors())
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: '50mb' }));

const AssetsPath = path.join(
    'X:',
    'RD',
    'RDGROUP',
    '115. Tongmean',
    '000 Sytem Assets',
    'Bom_Portal'
);

app.use('/Assets', express.static(AssetsPath));

const UserRouter = require('./Route/userRoute')
const app2 = require('./apps/app2/index');
const authRequire  = require('./middleWare/requireAuth.js')

app.use('/user', UserRouter);

app.use('/app2', authRequire, app2);


// // Socket.IO connection event
io.on('connection', (socket) => {
    console.log('Socket.IO connected:', socket.id);
});
app.use(createSocketBroadcaster(io));





// app.use('/user', UserRouter);
// const requireAuth = require('./Middleware/requireAuth');


// app.use('/exiting', requireAuth, app1);
// app.use('/new',requireAuth, app2);
// app.use('/changedrawing',
//     requireAuth
//     , 
//     app3
// );

require('dotenv').config();
const port = process.env.PORT || 5051;
const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
    console.log(`Backend running at http://${host}:${port}`);
    console.log("Server run on port:", port);
});
  