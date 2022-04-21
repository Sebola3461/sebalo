import { PrivateMessage } from "bancho.js";
import { users } from "../../../database";

export default async (user_id: number, pm: PrivateMessage) => {
	let user = await users.findById(user_id);

	user.twitch = {
		token: "",
		channel: "",
		id: "",
	};

	await users.findByIdAndUpdate(user._id, user);

	return pm.user.sendMessage("Done! I don't will send more requests here.");
};
