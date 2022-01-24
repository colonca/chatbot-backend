export default class Queue {

	constructor() {
		this.data = [];
	}

	enqueue(value) {
		this.data.push(value);
	}

	dequeue() {
		return this.data.shift();
	}

	isEmpty() {
		return this.data.length === 0;
	}

	print() {
		this.data.forEach(item => {
			console.log(item, ' -> ');
		});
	}
}
