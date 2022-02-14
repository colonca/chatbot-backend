import express from 'express';
import http from 'http';
import 'dotenv/config'
import { connect } from './config/database.js';
import cors from 'cors';
import Socket from './socketServer.js';

//database connect
connect();

//routes
import auth from './routes/auth.js';
import tickets from './routes/tickets.js';
import orders from './routes/orders.js';

const app = express();
app.use(express.json());
app.use(cors({
	origin: '*'
}));

//Routes
app.use('/', auth);
app.use('/', tickets);
app.use('/', orders);

const PORT = 5000;

//Socket
const server = http.createServer(app);
Socket(server);

server.listen(PORT, () => {
	console.log('listening on *:' + PORT);
});
