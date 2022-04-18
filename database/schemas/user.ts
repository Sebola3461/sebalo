import { Schema } from "mongoose";

export default new Schema({
	_id: {
		type: Number,
	},
	twitch: {
		type: Object,
		default: {
			token: "",
			channel: "",
			id: "",
		},
	},
	twitch_config: {
		type: Object,
		default: {
			request: "{artist} - {title} [{version}] | {statistics}",
		},
	},
	osu: {
		access_token: "",
		refresh_token: "",
	},
	last_beatmap: {
		type: String,
		default: "",
	},
});
