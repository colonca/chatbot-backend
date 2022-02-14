import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Order = new Schema({
	tipo: { type: String, required: true },
	content: { type: Object, required: true },
	created_At: { type: Date },
	updated_At: { type: Date },
	estado: { type: String, required: true }
});

export default mongoose.model('orders', Order);

