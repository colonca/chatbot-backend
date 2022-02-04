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

const app = express();
app.use(express.json());
app.use(cors({
	origin: '*'
}));
app.use('/', auth);
const server = http.createServer(app);

const PORT = 5000;

Socket(server);

server.listen(PORT, () => {
	console.log('listening on *:' + PORT);
});
