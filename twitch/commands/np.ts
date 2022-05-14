import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels } from "../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const db_channel = await twitchChannels.findById(tags["room-id"]);

	function generateLink(data: {
		beatmapset_id: number;
		beatmap_id: number;
		title: string;
		artist: string;
	}) {
		if (data.beatmap_id < 0)
			return `https://osu.ppy.sh/s/${data.beatmapset_id}`;

		return `https://osu.ppy.sh/b/${data.beatmap_id}`;
	}

	if (!db_channel)
		return client.say(channel, "Streamer not found.").catch((e) => {
			console.log(e);
		});

	if (!db_channel.now_playing)
		return client
			.say(
				channel,
				`@${channel.slice(
					1
				)} Doesn't downloaded the np client here: https://github.com/Sebola3461/sebalo-np/releases/tag/Beta I can't send the beatmap.`
			)
			.catch((e) => {
				console.log(e);
			});

	if (
		db_channel.now_playing.beatmap_id < 0 &&
		db_channel.now_playing.beatmapset_id < 0
	)
		return client
			.say(channel, `The beatmap isn't submitted.`)
			.catch((e) => {
				console.log(e);
			});

	return client
		.say(
			channel,
			`${db_channel.now_playing.artist} - ${
				db_channel.now_playing.title
			} | ${generateLink(db_channel.now_playing)}`
		)
		.catch((e) => {
			console.log(e);
		});
};
