import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../helpers/fetcher/fetchBeatmap";
import fetchUser from "../../helpers/fetcher/fetchUser";
import getBeatmapMessage from "../../helpers/messages/getBeatmapMessage";
import getTwitchRequestMessage from "../../helpers/messages/getTwitchRequestMessage";
import parseModes from "./parseModes";
import placeholderParser from "./placeholderParser";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	let url = "";

	const db_channel = (await users.find()).filter(
		(u) => u.twitch.channel == channel.slice(1)
	)[0];

	if (db_channel.twitch_options.pause)
		return client.say(channel, db_channel.twitch_options.messages.paused);

	const mods = (
		(message.split(" ").pop()?.startsWith("+")
			? message.split(" ").pop()
			: undefined) || "+NM"
	).slice(1);

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

		const user = await fetchUser(db_channel.id);

		if (!user.data) return;

		if (!beatmap.data.beatmapset) return;

		const message = await getTwitchRequestMessage(beatmap.data, mods, true);

		if (
			Number(message.att.starRating.toFixed(2)) <
				db_channel.twitch_options.sr.min_sr ||
			Number(message.att.starRating.toFixed(2)) >
				db_channel.twitch_options.sr.max_sr
		)
			return client.say(
				channel,
				placeholderParser(db_channel.twitch_options.messages.bad_sr, {
					min_sr: {
						regex: /{sr_min}/g,
						text: db_channel.twitch_options.sr.min_sr.toFixed(2),
					},
					max_sr: {
						regex: /{sr_max}/g,
						text: db_channel.twitch_options.sr.max_sr.toFixed(2),
					},
				})
			);

		await users.findByIdAndUpdate(user.data.id, {
			last_beatmap: beatmap.data.id,
		});

		if (!db_channel.twitch_options.modes.includes(beatmap.data.mode_int))
			return client.say(
				channel,
				placeholderParser(
					db_channel.twitch_options.messages.invalid_mode,
					{
						modes: {
							regex: /{modes}/g,
							text: parseModes(db_channel.twitch_options.modes),
						},
					}
				)
			);

		bancho.getUser(user.data.username).sendMessage(
			placeholderParser(db_channel.twitch_options.messages.request, {
				username: {
					regex: /{username}/g,
					text: `${tags["display-name"]}`,
				},
				beatmap: {
					regex: /{beatmap}/g,
					text: `${message.text}`,
				},
				separator: {
					regex: /{separator}/g,
					text: db_channel.twitch_options.separator,
				},
				mode: {
					regex: /{mode}/g,
					text: ` ${
						beatmap.data.mode != "osu"
							? `<osu!${beatmap.data.mode}>`
							: ""
					}`,
				},
			})
		);

		return client.say(
			channel,
			placeholderParser(db_channel.twitch_options.messages.confirmation, {
				beatmap: {
					regex: /{beatmap}/g,
					text: `${beatmap.data.beatmapset.artist} - ${
						beatmap.data.beatmapset.title
					} [${
						beatmap.data.version
					}] (${message.att.starRating.toFixed(2)}★${
						mods == "NM" ? "" : ` +${mods}`
					}) ${
						beatmap.data.mode != "osu"
							? `<osu!${beatmap.data.mode}>`
							: ""
					}`,
				},
				separator: {
					regex: /{separator}/g,
					text: db_channel.twitch_options.separator,
				},
				user: {
					regex: /{user}/g,
					text: tags["display-name"],
				},
			})
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

		const user = await fetchUser(db_channel.id);

		if (!user.data) return;

		if (!db_channel.twitch_options.modes.includes(beatmap.mode_int))
			return client.say(
				channel,
				placeholderParser(
					db_channel.twitch_options.messages.invalid_mode,
					{
						modes: {
							regex: /{modes}/g,
							text: parseModes(db_channel.twitch_options.modes),
						},
					}
				)
			);

		const message = await getTwitchRequestMessage(beatmap, mods, true);

		if (
			Number(message.att.starRating.toFixed(2)) <
				db_channel.twitch_options.sr.min_sr ||
			Number(message.att.starRating.toFixed(2)) >
				db_channel.twitch_options.sr.max_sr
		)
			return client.say(
				channel,
				placeholderParser(db_channel.twitch_options.messages.bad_sr, {
					min_sr: {
						regex: /{sr_min}/g,
						text: db_channel.twitch_options.sr.min_sr.toFixed(2),
					},
					max_sr: {
						regex: /{sr_max}/g,
						text: db_channel.twitch_options.sr.max_sr.toFixed(2),
					},
					separator: {
						regex: /{separator}/g,
						text: db_channel.twitch_options.separator,
					},
				})
			);

		await users.findByIdAndUpdate(user.data.id, {
			last_beatmap: beatmap.id,
		});

		bancho.getUser(user.data.username).sendMessage(
			placeholderParser(db_channel.twitch_options.messages.request, {
				username: {
					regex: /{username}/g,
					text: `${tags["display-name"]}`,
				},
				beatmap: {
					regex: /{beatmap}/g,
					text: `${message.text}`,
				},
				separator: {
					regex: /{separator}/g,
					text: db_channel.twitch_options.separator,
				},
				mode: {
					regex: /{mode}/g,
					text: ` ${
						beatmap.mode != "osu" ? `<osu!${beatmap.mode}>` : ""
					}`,
				},
			})
		);

		return client.say(
			channel,
			placeholderParser(db_channel.twitch_options.messages.confirmation, {
				beatmap: {
					regex: /{beatmap}/g,
					text: `${beatmap.beatmapset.artist} - ${
						beatmap.beatmapset.title
					} [${beatmap.version}] (${message.att.starRating.toFixed(
						2
					)}★${mods == "NM" ? "" : ` +${mods}`}) ${
						beatmap.mode != "osu" ? `<osu!${beatmap.mode}>` : ""
					}`,
				},
				separator: {
					regex: /{separator}/g,
					text: db_channel.twitch_options.separator,
				},
				user: {
					regex: /{user}/g,
					text: tags["display-name"],
				},
			})
		);
	}
};
