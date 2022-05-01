import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, users } from "../../../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const db_channel = await twitchChannels.findOne({
		username: channel.slice(1),
	});

	if (!db_channel)
		return client.say(channel, "User not found.").catch((e) => {
			console.log(e);
		});

	const valid_modes = ["osu", "taiko", "fruits", "mania"];

	args.shift();

	if (args.length < 1)
		return client
			.say(channel, `@${tags["display-name"]}: Provide valid modes!`)
			.catch((e) => {
				console.log(e);
			});

	const new_modes: number[] = [];

	args.forEach((mode) => {
		const mode_index = valid_modes.findIndex((m) => {
			return m == mode;
		});

		if (mode_index > -1) {
			new_modes.push(mode_index);
		}
	});

	if (new_modes.length < 1)
		return client
			.say(
				channel,
				`@${tags["display-name"]}: Provide valid modes! You can use "osu", "taiko", "fruits" and "mania"`
			)
			.catch((e) => {
				console.log(e);
			});

	db_channel.requests.modes = new_modes;

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	const new_modes_string: string[] = [];

	new_modes.forEach((mode, i) => {
		return new_modes_string.push(valid_modes[mode]);
	});

	return client
		.say(
			channel,
			`@${
				tags["display-name"]
			}: Request modes changed to ${new_modes_string.join(", ")}!`
		)
		.catch((e) => {
			console.log(e);
		});
};
