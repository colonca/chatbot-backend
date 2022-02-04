import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		min: 8
	},
	name: {
		type: String,
		required: true
	}
});

export default mongoose.model('users', User);
