import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchUsers } from "../../database";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	const user = await twitchUsers.findById(tags["user-id"]);

	const all_users = await twitchUsers.find();
	const channel_users: any[] = [];

	all_users.forEach((user) => {
		user.levels.forEach((l: any) => {
			if (l.channel == channel) {
				l.username = user.username;

				channel_users.push(l);
			}
		});
	});

	channel_users.sort((a: any, b: any) => {
		return b.xp - a.xp;
	});

	if (user == null)
		return client.say(
			channel,
			`@${tags.username} Wait... You don't exist in my database, wait some secounds and try again.`
		);

	const level = user.levels.filter((l: any) => l.channel == channel)[0];

	if (!level)
		return client
			.say(channel, `@${tags.username} [#0] Level 0, Xp: 0 | Next: 0/120`)
			.catch((e) => {
				console.log(e);
			});

	const user_rank = channel_users.findIndex(
		(l) => l.username == tags.username
	);

	return client.say(
		channel,
		`@${tags.username} [#${user_rank + 1}] Level ${level.level}, Xp: ${
			level.xp
		} | Next: ${level.xp}/${level.next_level_xp}`
	);
};
