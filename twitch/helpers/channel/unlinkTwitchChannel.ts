import { PrivateMessage } from "bancho.js";
import { twitchChannels, users } from "../../../database";

export default async (user_id: number, pm: PrivateMessage) => {
	await twitchChannels.findOneAndDelete({
		osu_id: user_id,
	});

	return pm.user.sendMessage("Done! I don't will send more requests here.");
};
