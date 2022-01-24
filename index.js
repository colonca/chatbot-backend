import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { setInterval } from 'timers';
import Queue from './queue.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const PORT = 5000;

let asesores = [];
let tickets = [];
let queue = new Queue();
let conversations = [];

io.on('connection', (socket) => {

	socket.on('new ticket', (ticket) => {
		const tikectClient = tickets.filter(item => item.client === ticket.client);
		if (tikectClient.length === 0) {
			tickets = [...tickets, ticket];
			if (ticket.area === 'soporte' && conversations.filter(item => item.client === ticket.client).length === 0)
				queue.enqueue(ticket);
		}
	});

	socket.on('new asesor', (asesor) => {
		const asesoresConEstaIdentificacion = asesores.filter(item => item.id === asesor.id);
		if (asesoresConEstaIdentificacion.length === 0)
			asesores = [...asesores, asesor];
	});

	socket.on('message', (msg) => {
		const { isAsesor } = msg;
		const ticketsDelUsuario = tickets.filter(item => {
			if (isAsesor) return item.asesor === msg.client;
			return item.client === msg.client
		});
		if (ticketsDelUsuario.length === 0)
			return;
		const ticket = ticketsDelUsuario[0];
		io.emit('message', {
			'emisor': msg.client,
			'receptor': isAsesor ? ticket.client : ticket.asesor,
			'text': msg.text,
		});
	});

	socket.on('disconnect', () => {
		console.log('hello world');
	});
});

setInterval(() => {
	const ticket = queue.dequeue();
	if (ticket) {
		const asesoresDisponibles = asesores.filter(item => {
			return conversations.filter(conversation => conversation.asesor === item.id).length === 0;
		});
		if (asesoresDisponibles.length === 0) {
			queue.enqueue(ticket);
			return;
		}
		ticket.asesor = asesoresDisponibles[0].id;
		conversations = [...conversations, { client: ticket.client, asesor: asesoresDisponibles[0].id }];
		tickets = tickets.filter(item => item.client !== ticket.client);
		tickets = [...tickets, ticket];
	}
}, 1000);

server.listen(PORT, () => {
	console.log('listening on *:' + PORT);
});
