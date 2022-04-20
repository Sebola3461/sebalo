import { Schema } from "mongoose";

export default new Schema({
	_id: {
		type: String,
	},
	username: {
		type: String,
	},
	last_message: {
		type: Object,
		default: {
			date: "",
			content: "",
		},
	},
	levels: {
		type: Array,
		default: [],
	},
});
