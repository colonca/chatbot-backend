import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import { extractToken } from '../middleware/authJWT.js';

const authController = {};

authController.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ $and: [{ email: { $eq: email } }, { password: { $eq: password } }] });
	if (!user) return res.status(203).send({
		status: 203,
		message: 'Unauthorized User.'
	});
	const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
		expiresIn: 60 * 60
	});
	return res.status(200).send({
		status: 200,
		token
	});
}

authController.whoami = async (req, res) => {
	try {
		const token = extractToken(req);
		const decode = jwt.verify(token, process.env.SECRET_KEY);
		const user = await User.findById(decode.id);
		if (!user)
			return res.status(200).send({
				status: 203,
				message: 'Unauthorized User.'
			});
		return res.status(200).send({
			status: 200,
			result: { email: user.email, name: user.name, id: user._id }
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			status: 500,
			message: 'Server Error'
		});
	}
}

export default authController;
