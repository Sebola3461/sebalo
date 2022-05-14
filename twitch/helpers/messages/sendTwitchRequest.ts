import { BanchoUser } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { Beatmap, Beatmapset } from "../../../types/beatmap";
import placeholderParser from "./placeholderParser";

export default async (
	bancho: BanchoUser,
	beatmap: Beatmap,
	beatmapset: Beatmapset,
	channel: string,
	client: Client,
	tags: ChatUserstate,
	beatmapData: {
		pps: any;
		metadata: string;
		att: any;
		extras: string;
	},
	db_channel: any
) => {
	if (!beatmapset || !beatmapset)
		return client.say(
			channel,
			`@${tags["display-name"]}: Invalid beatmap!`
		);

	const mods =
		beatmapData.att.mods.acronyms.length > 0
			? beatmapData.att.mods.acronyms.join("")
			: "NM";

	const beatmap_url = `[https://osu.ppy.sh/s/${beatmap.id} ${beatmapset.artist} - ${beatmapset.title} [${beatmap.version}]]`;

	// ? Send the beatmap ingame
	bancho.sendMessage(
		placeholderParser(db_channel.requests.messages.request, {
			username: {
				regex: /{username}/g,
				text: `${tags["display-name"]}`,
			},
			beatmap: {
				regex: /{beatmap_url}/g,
				text: `${beatmap_url}`,
			},
			attributes: {
				regex: /{attributes}/g,
				text: `${beatmapData.extras}`,
			},
			stars: {
				regex: /{stars}/g,
				text: `${beatmapData.att.starRating.toFixed(2)}`,
			},
			mods: {
				regex: /{mods}/g,
				text: `${mods != "NM" ? ` +${mods}` : ""}`,
			},
			pp100: {
				regex: /{pp100}/g,
				text: `${beatmapData.pps.pp100}pp`,
			},
			pp99: {
				regex: /{pp99}/g,
				text: `${beatmapData.pps.pp99}pp`,
			},
			pp995: {
				regex: /{pp99\.5}/g,
				text: `${beatmapData.pps["pp99.5"]}pp`,
			},
			pp98: {
				regex: /{pp98}/g,
				text: `${beatmapData.pps.pp98}pp`,
			},
			pp95: {
				regex: /{pp95}/g,
				text: `${beatmapData.pps.pp95}pp`,
			},
			separator: {
				regex: /{separator}/g,
				text: db_channel.requests.separator,
			},
			mode: {
				regex: /{mode}/g,
				text: ` ${
					beatmap.mode != "osu" ? `<osu!${beatmap.mode}>` : ""
				}`,
			},
		})
	);

	// ? Send Beatmap confirmation
	try {
		return await client.say(
			channel,
			placeholderParser(db_channel.requests.messages.confirmation, {
				beatmap: {
					regex: /{beatmap}/g,
					text: `${beatmapset.artist} - ${beatmapset.title} [${
						beatmap.version
					}] (${beatmapData.att.starRating.toFixed(2)}★${
						mods == "NM" ? "" : ` +${mods}`
					}) ${beatmap.mode != "osu" ? `<osu!${beatmap.mode}>` : ""}`,
				},
				separator: {
					regex: /{separator}/g,
					text: db_channel.requests.separator,
				},
				username: {
					regex: /{username}/g,
					text: tags["display-name"],
				},
				user: {
					regex: /{user}/g,
					text: tags["display-name"],
				},
			})
		);
	} catch (e_1) {
		console.log(e_1);
	}
};
