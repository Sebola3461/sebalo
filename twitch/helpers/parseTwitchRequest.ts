import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../helpers/fetcher/fetchBeatmap";
import getBeatmapMessage from "../../helpers/messages/getBeatmapMessage";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	let url = "";

	message.split(" ").forEach((arg) => {
		if (arg.startsWith("https://osu.ppy.sh/beatmapsets/")) url = arg;
	});

	let beatmap_id = url.split("/").pop() || "banana";

	if (isNaN(Number(beatmap_id)) && !beatmap_id.includes("#"))
		return client.say(
			channel,
			`@${tags["display-name"]}: Invalid beatmap!`
		);

	if (url.split("/").length == 6) {
		const beatmap = await fetchBeatmap(beatmap_id);

		if (beatmap.status != 200)
			return client.say(
				channel,
				`@${tags["display-name"]}: Invalid beatmap!`
			);

		if (!beatmap.data) return;

		const message = await getBeatmapMessage(beatmap.data, "NM", true);

		const db_channel = (await users.find()).filter(
			(u) => u.twitch.channel == channel.slice(1)
		)[0];

		return bancho
			.getUser(db_channel.id)
			.sendMessage(`${tags["display-name"]} || ${message}`);
	} else if (url.split("/").length == 5) {
		beatmap_id = beatmap_id.split("#")[0];

		const beatmapset = await fetchBeatmapset(beatmap_id);

		if (beatmapset.status != 200)
			return client.say(
				channel,
				`@${tags["display-name"]}: Invalid beatmap!`
			);

		if (!beatmapset.data || !beatmapset.data.beatmaps) return;

		const beatmap =
			beatmapset.data.beatmaps[beatmapset.data.beatmaps.length - 1];

		const message = await getBeatmapMessage(beatmap, "NM", true);

		const db_channel = (await users.find()).filter(
			(u) => u.twitch.channel == channel.slice(1)
		)[0];

		bancho
			.getUser(db_channel.id)
			.sendMessage(`${tags["display-name"]} || ${message}`);

		return client.say(channel, `@${tags["display-name"]}: Request sended!`);
	}
};
