import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Message = new Schema({
	receptor: { type: String, required: true },
	emisor: { type: String, required: true },
	text: { type: String, required: true },
	ticket: { type: Schema.Types.ObjectId, required: true }
});

export default mongoose.model('messages', Message);
