import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users } from "../../../database";
import fetchBeatmap, {
	fetchBeatmapset,
} from "../../../helpers/fetcher/fetchBeatmap";
import fetchUser from "../../../helpers/fetcher/fetchUser";
import getBeatmapMessage from "../../../helpers/messages/getBeatmapMessage";
import getTwitchRequestMessage from "../../../helpers/messages/getTwitchRequestMessage";
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

	if (db_channel.twitch_options.blacklist.includes(tags.username)) return;

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
		return client
			.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
			.catch((e) => {
				console.log(e);
			});

	if (url.split("/").length == 6) {
		// ? Beatmap link

		const beatmap = await fetchBeatmap(beatmap_id);

		if (beatmap.status != 200)
			return client
				.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
				.catch((e) => {
					console.log(e);
				});

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
			return client
				.say(
					channel,
					placeholderParser(
						db_channel.twitch_options.messages.bad_sr,
						{
							min_sr: {
								regex: /{sr_min}/g,
								text: db_channel.twitch_options.sr.min_sr.toFixed(
									2
								),
							},
							max_sr: {
								regex: /{sr_max}/g,
								text: db_channel.twitch_options.sr.max_sr.toFixed(
									2
								),
							},
							separator: {
								regex: /{separator}/g,
								text: db_channel.twitch_options.separator,
							},
						}
					)
				)
				.catch((e) => {
					console.log(e);
				});

		await users.findByIdAndUpdate(user.data.id, {
			last_beatmap: beatmap.data.id,
		});

		if (!db_channel.twitch_options.modes.includes(beatmap.data.mode_int))
			return client
				.say(
					channel,
					placeholderParser(
						db_channel.twitch_options.messages.invalid_mode,
						{
							modes: {
								regex: /{modes}/g,
								text: parseModes(
									db_channel.twitch_options.modes
								),
							},
						}
					)
				)
				.catch((e) => {
					console.log(e);
				});

		if (!db_channel.twitch_options.status.includes(beatmap.data.status))
			return client
				.say(
					channel,
					placeholderParser(
						db_channel.twitch_options.messages.invalid_status,
						{
							modes: {
								regex: /{beatmap_status}/g,
								text: db_channel.twitch_options.status.join(
									", "
								),
							},
						}
					)
				)
				.catch((e) => {
					console.log(e);
				});

		bancho
			.getUser(user.data.username)
			.sendMessage(
				placeholderParser(db_channel.twitch_options.messages.request, {
					username: {
						regex: /{username}/g,
						text: `${tags["display-name"]}`,
					},
					beatmap: {
						regex: /{beatmap_url}/g,
						text: `${message.metadata}`,
					},
					attributes: {
						regex: /{attributes}/g,
						text: `${message.extras}`,
					},
					pp100: {
						regex: /{pp100}/g,
						text: `${message.pps.pp100}pp`,
					},
					pp995: {
						regex: /{pp99\.5}/g,
						text: `${message.pps["99.5"]}pp`,
					},
					pp99: {
						regex: /{pp99}/g,
						text: `${message.pps.pp99}pp`,
					},
					pp98: {
						regex: /{pp98}/g,
						text: `${message.pps.pp98}pp`,
					},
					pp95: {
						regex: /{pp95}/g,
						text: `${message.pps.pp95}pp`,
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
			)
			.catch((e) => {
				console.log(e);
			});

		return client
			.say(
				channel,
				placeholderParser(
					db_channel.twitch_options.messages.confirmation,
					{
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
						username: {
							regex: /{username}/g,
							text: tags["display-name"],
						},
						user: {
							regex: /{user}/g,
							text: tags["display-name"],
						},
					}
				)
			)
			.catch((e) => {
				console.log(e);
			});
	} else if (url.split("/").length == 5) {
		// ? Beatmapset link

		beatmap_id = beatmap_id.split("#")[0];

		const beatmapset = await fetchBeatmapset(beatmap_id);

		if (beatmapset.status != 200)
			return client
				.say(channel, `@${tags["display-name"]}: Invalid beatmap!`)
				.catch((e) => {
					console.log(e);
				});

		if (!beatmapset.data || !beatmapset.data.beatmaps) return;

		const beatmap =
			beatmapset.data.beatmaps[beatmapset.data.beatmaps.length - 1];

		beatmap.beatmapset = beatmapset.data;

		const user = await fetchUser(db_channel.id);

		if (!user.data) return;

		if (!db_channel.twitch_options.modes.includes(beatmap.mode_int))
			return client
				.say(
					channel,
					placeholderParser(
						db_channel.twitch_options.messages.invalid_mode,
						{
							modes: {
								regex: /{modes}/g,
								text: parseModes(
									db_channel.twitch_options.modes
								),
							},
						}
					)
				)
				.catch((e) => {
					console.log(e);
				});

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

		if (!db_channel.twitch_options.status.includes(beatmap.status))
			return client
				.say(
					channel,
					placeholderParser(
						db_channel.twitch_options.messages.invalid_status,
						{
							modes: {
								regex: /{beatmap_status}/g,
								text: db_channel.twitch_options.status.join(
									", "
								),
							},
						}
					)
				)
				.catch((e) => {
					console.log(e);
				});

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
					regex: /{beatmap_url}/g,
					text: `${message.metadata}`,
				},
				attributes: {
					regex: /{attributes}/g,
					text: `${message.extras}`,
				},
				pp100: {
					regex: /{pp100}/g,
					text: `${message.pps.pp100}pp`,
				},
				pp99: {
					regex: /{pp99}/g,
					text: `${message.pps.pp99}pp`,
				},
				pp995: {
					regex: /{pp99\.5}/g,
					text: `${message.pps["pp99.5"]}pp`,
				},
				pp98: {
					regex: /{pp98}/g,
					text: `${message.pps.pp98}pp`,
				},
				pp95: {
					regex: /{pp95}/g,
					text: `${message.pps.pp95}pp`,
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

		return client
			.say(
				channel,
				placeholderParser(
					db_channel.twitch_options.messages.confirmation,
					{
						beatmap: {
							regex: /{beatmap}/g,
							text: `${beatmap.beatmapset.artist} - ${
								beatmap.beatmapset.title
							} [${
								beatmap.version
							}] (${message.att.starRating.toFixed(2)}★${
								mods == "NM" ? "" : ` +${mods}`
							}) ${
								beatmap.mode != "osu"
									? `<osu!${beatmap.mode}>`
									: ""
							}`,
						},
						separator: {
							regex: /{separator}/g,
							text: db_channel.twitch_options.separator,
						},
						username: {
							regex: /{username}/g,
							text: tags["display-name"],
						},
						user: {
							regex: /{user}/g,
							text: tags["display-name"],
						},
					}
				)
			)
			.catch((e) => {
				console.log(e);
			});
	}
};
