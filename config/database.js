import mongoose from 'mongoose';

export async function connect() {
	try {
		await mongoose.connect('mongodb://mongo/chatbot');
		console.log('MongoDb Connected...');
	} catch (error) {
		console.log(error);
	}
}

