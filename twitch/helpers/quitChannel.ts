import { Client } from "tmi.js";
import { users } from "../../database";

export default async (channel: string, client: Client) => {
	const user = (await users.find()).filter(
		(u) => u.twitch.channel == channel.slice(1)
	)[0];

	if (!user) {
		console.log(`Leaving channel ${channel} cuz i'm banned.`);

		await client.part(channel);

		console.log(`Bye ${channel}`);

		return;
	}

	console.log(`Leaving channel ${channel} cuz i'm banned.`);

	await client.part(channel);

	user.twitch = {
		token: "",
		channel: "",
		id: "",
	};

	await users.findByIdAndUpdate(user._id, user);

	console.log(`Bye ${channel}`);

	return;
};
