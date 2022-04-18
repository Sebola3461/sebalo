import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../helpers/fetcher/fetchBeatmap";
import fetchUser from "../../helpers/fetcher/fetchUser";
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

		const user = await fetchUser(db_channel.id);

		if (!user.data) return;

		if (!beatmap.data.beatmapset) return;

		await users.findByIdAndUpdate(user.data.id, {
			last_beatmap: beatmap.data.id,
		});

		bancho
			.getUser(user.data.username)
			.sendMessage(`${tags["display-name"]} || ${message}`);

		return client.say(
			channel,
			`@${tags["display-name"]}: Request sended! -> ${
				beatmap.data.beatmapset.artist
			} - ${beatmap.data.beatmapset.title} [${
				beatmap.data.version
			}] (${beatmap.data.difficulty_rating.toFixed(2)}★) ${
				beatmap.data.mode != "osu" ? `<osu!${beatmap.data.mode}>` : ""
			}`
		);
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

		beatmap.beatmapset = beatmapset.data;

		const message = await getBeatmapMessage(beatmap, "NM", true);

		const db_channel = (await users.find()).filter(
			(u) => u.twitch.channel == channel.slice(1)
		)[0];

		const user = await fetchUser(db_channel.id);

		if (!user.data) return;

		await users.findByIdAndUpdate(user.data.id, {
			last_beatmap: beatmap.id,
		});

		bancho
			.getUser(user.data.username)
			.sendMessage(`${tags["display-name"]} || ${message}`);

		return client.say(
			channel,
			`@${tags["display-name"]}: Request sended! -> ${
				beatmap.beatmapset.artist
			} - ${beatmap.beatmapset.title} [${
				beatmap.version
			}] (${beatmap.difficulty_rating.toFixed(2)}★) ${
				beatmap.mode != "osu" ? `<osu!${beatmap.mode}>` : ""
			}`
		);
	}
};
