import { PrivateMessage } from "bancho.js";
import { users } from "../../../database";

export default async (pm: PrivateMessage, user: any) => {
	const db_user = await users.findById(user.id);

	if (!db_user)
		return pm.user.sendMessage(
			"You dont exist in my database, wait some secounds and try again."
		);

	if (db_user.twitch.channel.trim() == "")
		return pm.user.sendMessage(
			"You need to link your twitch account first. Use !twitch link to link your account."
		);

	if (db_user.twitch_options.pause == false)
		return pm.user.sendMessage(
			`The requests are already allowed, use !requests resume to pause.`
		);

	db_user.twitch_options.pause = false;

	await users.findByIdAndUpdate(user.id, db_user);

	return pm.user.sendMessage(`Requests allowed again!`);
};
