import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export function extractToken(req) {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	} else if (req.query && req.query.token) {
		return req.query.token;
	}
	return null;
}

export const verifyToken = (req, res, next) => {
	try {
		const token = extractToken(req);
		if (!token) return res.status(403).send({
			status: 403,
			message: 'No token provided'
		});
		const decode = jwt.verify(token, process.env.SECRET_KEY);
		const user = User.findById(decode.id);
		if (!user) return res.status(404).send({
			status: 404,
			message: 'No User Found.'
		});
		next();
	} catch (err) {
		return res.status(203).send({
			status: 203,
			message: 'Unauthorized User.'
		});
	}
}


