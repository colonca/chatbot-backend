import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Ticket = new Schema({
	client: { type: String, required: true },
	area: { type: String, required: true },
	asesor: { type: Schema.Types.ObjectId, ref: 'asesor' }
});

export default mongoose.model('tickets', Ticket);
