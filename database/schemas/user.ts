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
	now_playing: {
		type: Object,
		default: {
			beatmapset_id: -1,
			beatmap_id: -1,
			title: "",
			artist: "",
		},
	},
	twitch_options: {
		type: Object,
		default: {
			separator: "|",
			pause: false,
			levels_enable: true,
			sr: {
				min_sr: 0,
				max_sr: 10,
			},
			messages: {
				paused: "Sorry, the streamer isn't accepting requests right now.",
				confirmation: "{username}: Request sent! -> {beatmap}",
				invalid_mode: "The streamer does not accept this gamemode.",
				invalid_status:
					"The streamer only accept {beatmap_status} beatmaps.",
				bad_sr: "The streamer does not accept this sr (min: {sr_min} {separator} max: {sr_max}).",
				request:
					"{username} || {mode} {beatmap_url} ({stars} {mods}) | {attributes} | {pp100} • {pp99} • {pp98} • {pp95}",
			},
			modes: [0, 1, 2, 3],
			blacklist: [],
			status: [
				"ranked",
				"wip",
				"graveyard",
				"pending",
				"loved",
				"qualified",
				"approved",
			],
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
