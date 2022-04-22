import { Schema } from "mongoose";

export default new Schema({
	_id: {
		type: String,
	},
	username: {
		type: String,
	},
	avatar: {
		type: String,
		default: "",
	},
	offline_cover: {
		type: String,
		default: "",
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
