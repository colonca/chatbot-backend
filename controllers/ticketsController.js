import Asesor from '../model/Asesor.js';
import Ticket from '../model/Ticket.js';

const ticketsController = {};

ticketsController.client = async (req, res) => {
	try {
		const { id } = req.params;
		let ticket = await Ticket.findOne({ client: { $eq: id } }).populate('messages');
		return res.status(200).send({
			status: 200,
			result: ticket
		});
	} catch (err) {
		res.status(500).send({
			status: 500,
			message: 'Server Error.'
		});
	}
}

ticketsController.asesor = async (req, res) => {
	try {
		const { id } = req.params;
		const asesor = await Asesor.findOne({ session: { $eq: id } });
		if (!asesor) {
			return res.status(400).send({
				status: 400,
				message: 'BAD REQUEST'
			});
		}
		let ticket = await Ticket.findOne({ $and: [{ asesor: { $eq: asesor._id } }, { estado: { $eq: 'IN CONVERSATION' } }] }).populate('messages');
		if (!ticket) {
			return res.status(200).send({
				status: 200,
				message: []
			});
		}
		return res.status(200).send({
			status: 200,
			result: ticket
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: 500,
			message: 'Server Error.'
		});
	}
}


export default ticketsController;
