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

	await client.part(channel);

	await users.findByIdAndUpdate(user._id, {
		twitch: {
			token: "",
			channel: "",
			id: "",
		},
	});

	console.log(`Bye ${channel}`);

	return;
};
