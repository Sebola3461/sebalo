import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, users } from "../../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../../helpers/fetcher/fetchBeatmap";
import fetchUser from "../../../helpers/fetcher/fetchUser";
import getTwitchRequestMessage from "../../../helpers/messages/getTwitchRequestMessage";
import { Beatmap, Beatmapset } from "../../../types/beatmap";
import parseModes from "./parseModes";
import placeholderParser from "./placeholderParser";
import sendTwitchRequest from "./sendTwitchRequest";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	beatmap: Beatmap | undefined,
	beatmapset: Beatmapset | undefined,
	db_channel: any
) => {
	if (db_channel.requests.blacklist.includes(tags.username)) return;

	if (db_channel.requests.pause)
		return client.say(channel, db_channel.requests.messages.paused);

	const mods = (
		(message.split(" ").pop()?.startsWith("+")
			? message.split(" ").pop()
			: undefined) || "+NM"
	).slice(1);

	if (!beatmap || !beatmapset)
		return client
			.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
			.catch((e) => {
				console.log(e);
			});

	const beatmapAttributtes = await getTwitchRequestMessage(
		beatmap,
		mods,
		true
	);

	if (
		Number(beatmapAttributtes.att.starRating.toFixed(2)) <
			db_channel.requests.sr.min_sr ||
		Number(beatmapAttributtes.att.starRating.toFixed(2)) >
			db_channel.requests.sr.max_sr
	)
		return client
			.say(
				channel,
				placeholderParser(db_channel.requests.messages.bad_sr, {
					min_sr: {
						regex: /{sr_min}/g,
						text: db_channel.requests.sr.min_sr.toFixed(2),
					},
					max_sr: {
						regex: /{sr_max}/g,
						text: db_channel.requests.sr.max_sr.toFixed(2),
					},
					separator: {
						regex: /{separator}/g,
						text: db_channel.requests.separator,
					},
				})
			)
			.catch((e) => {
				console.log(e);
			});

	if (!db_channel.requests.modes.includes(beatmap.mode_int))
		return client
			.say(
				channel,
				placeholderParser(db_channel.requests.messages.invalid_mode, {
					modes: {
						regex: /{modes}/g,
						text: parseModes(db_channel.requests.modes),
					},
				})
			)
			.catch((e) => {
				console.log(e);
			});

	if (!db_channel.requests.status.includes(beatmap.status))
		return client
			.say(
				channel,
				placeholderParser(db_channel.requests.messages.invalid_status, {
					modes: {
						regex: /{beatmap_status}/g,
						text: db_channel.requests.status.join(", "),
					},
				})
			)
			.catch((e) => {
				console.log(e);
			});

	const osuUser = await fetchUser(db_channel.osu_id);

	if (osuUser.status != 200 || !osuUser.data)
		return client.say(
			channel,
			`I can't find the streamer pm, sorry. @${channel.slice(
				1
			)} can try to use !twitch link command in the bot pm to fix.`
		);

	const banchoUser = bancho.getUser(osuUser.data.username);

	sendTwitchRequest(
		banchoUser,
		beatmap,
		beatmapset,
		channel,
		client,
		tags,
		beatmapAttributtes,
		db_channel
	);

	await users.findByIdAndUpdate(banchoUser.id, {
		last_beatmap: beatmap.id,
	});
};
