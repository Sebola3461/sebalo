import { ChatUserstate } from "tmi.js";
import * as database from "..";
import user from "../schemas/user";

export default async function createNewUser(user_data: ChatUserstate) {
	console.log(
		"createNewUser",
		`Creating a new twitch user ${user_data["display-name"]}.`
	);

	if (!user_data["user-id"]) return;

	try {
		const fallback = await database.twitchUsers.findById(
			user_data["user-id"]
		);

		if (fallback != null) return fallback;

		const u = new database.twitchUsers({
			_id: user_data["user-id"],
			username: user_data.username,
		});

		await u.save();

		const r = await database.twitchUsers.findById(u.id);

		console.log("createNewUser", `Twitch user ${u.id} created!`);

		return r;
	} catch (e) {
		console.error(e);
		return {};
	}
}
