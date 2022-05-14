import { PrivateMessage } from "bancho.js";
import { twitchChannels } from "../../../database";

export default async (pm: PrivateMessage, user: any) => {
	const db_user = await twitchChannels.findOne({ osu_id: user.id });

	if (!db_user)
		return pm.user.sendMessage(
			"You don't have a channel linked. Use !twitch link to link a channel"
		);

	if (db_user.requests.pause == true)
		return pm.user.sendMessage(
			`The requests are already paused, use !requests resume to resume.`
		);

	db_user.requests.pause = true;

	await twitchChannels.findOneAndUpdate({ osu_id: user.id });

	return pm.user.sendMessage(`Requests paused!`);
};
