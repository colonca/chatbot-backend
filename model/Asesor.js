import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Asesor = new Schema({
	session: { type: String, required: true },
	name: { type: String, required: true },
	disponible: { type: Boolean, required: true }
});

export default mongoose.model('asesores', Asesor);
