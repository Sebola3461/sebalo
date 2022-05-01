import { ChatUserstate } from "tmi.js";
import * as database from "..";
import getChannelInfo from "../../twitch/helpers/api/getChannelInfo";

export default async function createNewTwitchChannel(
	channel: string,
	osu_id: string
) {
	console.log("createNewUser", `Creating a new twitch channel ${channel}.`);

	try {
		const fallback = await database.twitchChannels.findOne({
			username: channel,
		});

		if (fallback != null) return fallback;

		const twitch_data = await getChannelInfo(channel);

		const u = new database.twitchChannels({
			_id: twitch_data.data?.id,
			osu_id: osu_id,
			username: twitch_data.data?.login,
			avatar: twitch_data.data?.avatar || "",
			offline_cover: twitch_data.data?.offline_cover || "",
		});

		await u.save();

		const r = await database.twitchChannels.findById(u._id);

		console.log("createNewUser", `Twitch user ${u._id} created!`);

		return r;
	} catch (e) {
		console.error(e);
		return {};
	}
}
