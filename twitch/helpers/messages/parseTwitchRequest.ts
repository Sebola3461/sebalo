import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels } from "../../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../../helpers/fetcher/fetchBeatmap";
import checkTwitchRequest from "./checkTwitchRequest";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	let url = "";

	const db_channel = await twitchChannels.findById(tags["room-id"]);

	if (!db_channel) {
		console.log(`Channel ${channel} does not exist. Sending help`);

		return client
			.say(
				channel,
				`The streamer does not exist in my database! @${channel.slice(
					1
				)} need to run a command here: https://osu.ppy.sh/community/chat?sendto=15821708 to sync again.`
			)
			.catch((e) => {
				console.log(e);
			});
	}

	if (db_channel.requests.blacklist.includes(tags.username)) return;

	if (db_channel.requests.pause)
		return client.say(channel, db_channel.requests.messages.paused);

	message.split(" ").forEach((arg) => {
		if (
			arg.startsWith("https://osu.ppy.sh/beatmapsets/") &&
			!arg.includes("discussion")
		)
			url = arg;
	});

	let beatmap_id = url.split("/").pop() || "banana"; // ? Beatmapset link
	if (url.split("/").length == 5) beatmap_id = beatmap_id.split("#")[0]; // ? Beatmap link

	let beatmap;

	// ? Check if the id is valid
	if (isNaN(Number(beatmap_id)) && !beatmap_id.includes("#"))
		return client
			.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
			.catch((e) => {
				console.log(e);
			});

	if (url.split("/").length == 5) {
		let beatmapset = await fetchBeatmapset(beatmap_id);

		if (
			beatmapset.status != 200 ||
			!beatmapset.data ||
			!beatmapset.data.beatmaps
		)
			return client
				.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
				.catch((e) => {
					console.log(e);
				});

		beatmap = beatmapset.data.beatmaps[0];

		checkTwitchRequest(
			message,
			tags,
			channel,
			bancho,
			client,
			beatmap,
			beatmapset.data,
			db_channel
		);
	}

	if (url.split("/").length == 6) {
		beatmap = await fetchBeatmap(beatmap_id);

		if (beatmap.status != 200 || !beatmap.data)
			return client
				.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
				.catch((e) => {
					console.log(e);
				});

		beatmap = beatmap.data;

		let beatmapset = await fetchBeatmapset(beatmap.beatmapset_id);

		if (beatmapset.status != 200 || !beatmapset.data)
			return client
				.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
				.catch((e) => {
					console.log(e);
				});

		checkTwitchRequest(
			message,
			tags,
			channel,
			bancho,
			client,
			beatmap,
			beatmapset.data,
			db_channel
		);
	}
};
