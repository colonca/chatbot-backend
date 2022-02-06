import { Server } from 'socket.io';
import Asesor from './model/Asesor.js';
import Work from './model/Work.js';
import Message from './model/Message.js';
import Ticket from './model/Ticket.js';
import { setInterval } from 'timers';

const Socket = (server) => {

	const io = new Server(server);
	//TO-DO: validar los errores con try/catch
	io.on('connection', (socket) => {
		//TO-DO: cuando se ingresa el ticket a la cola se debe indicar al usuario en que turno se encuentra
		socket.on('TICKET', async (value) => {
			let ticket = await Ticket.findOne({ client: { $eq: value.client } });
			if (!ticket) {
				ticket = new Ticket({ ...value, estado: 'PENDIENTE' });
				await ticket.save();
				const work = new Work({
					createdOn: new Date(),
					ticket: { ...ticket }
				});
				work.save();
			}
		});

		socket.on('ASESOR', async (value) => {
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

		socket.on('MESSAGE', async (msg) => {
			try {
				let ticket = null;
				let receptor = null;
				if (msg.type === 'ASESOR') {
					const asesor = await Asesor.findOne({ session: { $eq: msg.emisor } });
					if (asesor) {
						ticket = await Ticket.findOne({ $and: [{ asesor: { $eq: asesor._id } }, { estado: { $eq: 'IN CONVERSATION' } }] });
						if (ticket)
							receptor = ticket.client;
					}
				}
				if (msg.type === 'CLIENTE') {
					ticket = await Ticket.findOne({ client: { $eq: msg.emisor } }).populate('asesor', null, 'asesores');
					if (ticket && ticket.asesor) {
						receptor = ticket.asesor.session;
					}
				}
				if (receptor) {
					const message = new Message({
						ticket: ticket._id,
						emisor: msg.emisor,
						receptor,
						text: msg.text,
					});
					await message.save();
					ticket.messages = ticket.messages.concat(message._id);
					await ticket.save();
					io.emit('MESSAGE', {
						receptor,
						text: msg.text,
					});
				}
			} catch (err) {

				console.log(err);
			}
		});

		setInterval(async () => {

			//TO-DO: establece comunicacón entre el asesor y el cliente basandose en la cola 
			const work = await Work.findOne({ startTime: { $eq: null } }).sort({ createdOn: 1 });

			if (work) {
				const asesorDisponible = await Asesor.findOneAndUpdate({ disponible: { $eq: true } }, {
					$set: { disponible: false }
				}, { new: true });
				if (asesorDisponible) {
					const ticket = await Ticket.findByIdAndUpdate(work.ticket._id, { asesor: asesorDisponible._id, estado: 'IN CONVERSATION' });
					await Work.findByIdAndUpdate(work._id, { startTime: new Date(), ticket: ticket._id });
					const text = `¡Hola! 👋 Mi nombre es ${asesorDisponible.name} y 
					estoy muy contento de poder ayudarte hoy. 
					😀 ¿Cuál es tu nombre?`;
					const message = new Message({
						ticket: ticket._id,
						emisor: asesorDisponible.session,
						receptor: ticket.client,
						text,
					});
					await message.save();
					ticket.messages = ticket.messages.concat(message._id);
					await ticket.save();
					io.emit('MESSAGE', {
						receptor: ticket.client,
						text
					});
					io.emit('QUEUE', {
						receptor: ticket.client,
						position: 0
					})
				}
			}

			//TO-DO: notifica a cada cliente en que posicion de la cola se encuentra.
			const works = await Work.find({ startTime: { $eq: null } }).sort({ createdOn: -1 }).populate('ticket');
			works.forEach((work, index) => {
				const position = works.length - index;
				io.emit('QUEUE', {
					receptor: work.ticket.client,
					position
				});
			});


			//TO-DO: finaliza conversación despues de 5 minutos.

		}, 1000);
	});
}

export default Socket;
