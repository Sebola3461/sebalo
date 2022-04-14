import { Schema } from "mongoose";

export default new Schema({
	_id: {
		type: Number,
	},
	last_beatmap: {
		type: String,
		default: "",
	},
});
