import { Server } from 'socket.io';
import Ticket from './model/Ticket.js';
import Asesor from './model/Asesor.js';
import Work from './model/Work.js';

import { setInterval } from 'timers';

const Socket = (server) => {

	const io = new Server(server);

	io.on('connection', (socket) => {
		//TO DO: cuando se ingresa el ticket a la cola se debe indicar al usuario en que turno se encuentra
		socket.on('ticket', async (value) => {
			let ticket = await Ticket.findOne({ client: { $eq: value.client } });
			if (!ticket) {
				ticket = new Ticket({ ...value });
				await ticket.save();
				const works = await Work.find({ startTime: { $eq: null } });
				if (works.length !== 0) {
					//TO DO: enviar un evento que indique la posicion en la cola del cliente 
				}
				const work = new Work({
					createdOn: new Date(),
					ticket: { ...ticket }
				});
				work.save();
			}
		});

		socket.on('asesor', async (value) => {
			let asesor = await Asesor.findOne({ session: { $eq: value.id } });
			if (!asesor) {
				asesor = new Asesor({
					session: value.id,
					name: value.name,
					disponible: true
				});
				asesor.save();
			}
		});

		socket.on('message', async (msg) => {
			let ticket = null;
			let receptor = null;
			if (msg.type === 'asesor') {
				const asesor = await Asesor.findOne({ session: { $eq: msg.emisor } });
				if (asesor) {
					ticket = await Ticket.findOne({ asesor: { $eq: asesor._id } });
					if (ticket)
						receptor = ticket.client;
				}
			}
			if (msg.type === 'cliente') {
				ticket = await Ticket.findOne({ client: { $eq: msg.emisor } }).populate('asesor', null, 'asesores');
				if (ticket) {
					receptor = ticket.asesor.session;
				}
			}

			if (receptor) {
				io.emit('message', {
					receptor,
					text: msg.text
				});
			}

		});

	});

	setInterval(async () => {

		const work = await Work.findOne({ startTime: { $eq: null } }).sort({ createdOn: 1 });

		if (work) {
			const asesorDisponible = await Asesor.findOneAndUpdate({ disponible: { $eq: true } }, {
				$set: { disponible: false }
			}, { new: true });
			if (asesorDisponible) {
				const ticket = await Ticket.findByIdAndUpdate(work.ticket._id, { asesor: asesorDisponible._id });
				await Work.findByIdAndUpdate(work._id, { startTime: new Date(), ticket: ticket._id });
				io.emit('message', {
					receptor: ticket.client,
					text: `¡Hola! 👋 Mi nombre es ${asesorDisponible.name} y 
					estoy muy contento de poder ayudarte hoy. 
					😀 ¿Cuál es tu nombre?`
				});
			}
		}
	}, 1000);
}

export default Socket;
