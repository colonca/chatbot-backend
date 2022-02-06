import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Work = new Schema({
	startTime: { type: Date },
	endTime: { type: Date },
	createdOn: { type: Date },
	ticket: { type: Schema.Types.ObjectId, ref: 'tickets' }
});

export default mongoose.model('works', Work);
