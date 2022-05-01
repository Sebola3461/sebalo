import { Client } from "tmi.js";
import { twitchChannels, users } from "../../../database";

export default async (channel: string, client: Client) => {
	console.log(channel);
	const user = await twitchChannels.findOne({
		username: channel.slice(1),
	});

	if (!user) return;

	console.log(`Leaving channel ${channel} cuz i'm banned.`);

	user.twitch = {
		token: "",
		channel: "",
		id: "",
	};

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		user
	);

	console.log(`Bye ${channel}`);

	return;
};
