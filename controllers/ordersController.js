import Order from '../model/Order.js';

const ordersController = {};

ordersController.save = async (req, res) => {
	try {
		const { tipo, content } = req.body;
		const order = new Order({ tipo: tipo, content: content, estado: 'PENDIENTE', created_At: new Date() });
		await order.save();
		return res.status(200).send({
			status: 200,
			result: order
		})
	} catch (e) {
		return res.status(500).send({
			status: 500,
			message: 'Server Error'
		})
	}
}

ordersController.get = async (req, res) => {
	try {
		const orders = await Order.find({});
		return res.status(200).send({
			status: 200,
			result: orders
		})
	} catch (e) {
		return res.status(500).send({
			status: 500,
			message: 'Server Error'
		})
	}
}

ordersController.changestatus = async (req, res) => {
	try {
		const { id, estado } = req.body;
		const order = await Order.findByIdAndUpdate(id, { estado }, { new: true });
		return res.status(200).send({
			status: 200,
			result: order,
		})
	} catch (e) {
		return res.status(500).send({
			status: 500,
			message: 'Server Error'
		})
	}
}

export default ordersController;
