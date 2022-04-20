import { PrivateMessage } from "bancho.js";
import { users } from "../../database";

export default async (user_id: number, pm: PrivateMessage) => {
	await users.findByIdAndUpdate(user_id, {
		twitch: {
			token: "",
			channel: "",
			id: "",
		},
	});

	return pm.user.sendMessage("Done! I don't will send more requests here.");
};
