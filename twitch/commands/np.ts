import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels } from "../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../helpers/fetcher/fetchBeatmap";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const db_channel = await twitchChannels.findById(tags["room-id"]);

	async function generateLink(data: {
		beatmapset_id: number;
		beatmap_id: number;
		title: string;
		artist: string;
	}) {
		console.log(data);

		if (data.beatmap_id != -1) {
			const beatmap = await fetchBeatmap(data.beatmap_id);

			if (
				beatmap.status != 200 ||
				!beatmap.data ||
				!beatmap.data?.beatmapset
			)
				return "Beatmap not found!";

			return `${beatmap.data.beatmapset.artist} - ${
				beatmap.data.beatmapset.title
			} [${
				beatmap.data.version
			}] (${beatmap.data.difficulty_rating.toFixed(
				2
			)}★) | https://osu.ppy.sh/b/${data.beatmap_id}`;
		}

		const beatmap = await fetchBeatmapset(data.beatmapset_id);

		if (beatmap.status != 200 || !beatmap.data) return "Beatmap not found!";

		return `${beatmap.data.artist} - ${beatmap.data.title} | https://osu.ppy.sh/s/${data.beatmapset_id}`;
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
		.say(channel, await generateLink(db_channel.now_playing))
		.catch((e) => {
			console.log(e);
		});
};
