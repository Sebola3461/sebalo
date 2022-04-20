import { Client } from "tmi.js";
import { users } from "../../database";

export default async (channel: string, client: Client) => {
	console.log(channel);
	const user = (await users.find()).filter(
		(u) => u.twitch.channel == channel
	)[0];

	if (!user) return;

	console.log(`Leaving channel ${channel} cuz i'm banned.`);

	user.twitch = {
		token: "",
		channel: "",
		id: "",
	};

	await users.findByIdAndUpdate(user._id, user);

	console.log(`Bye ${channel}`);

	return;
};
