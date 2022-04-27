import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchUsers, users } from "../../database";
import disable from "./subcommands/level/disable";
import enable from "./subcommands/level/enable";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	switch (args[0]) {
		case "disable": {
			if (tags.username == channel.slice(1)) {
				disable(message, tags, channel, bancho, client, args);

				break;
			} else {
				client
					.say(
						channel,
						`@${tags["display-name"]}: Invalid permissions.`
					)
					.catch((e) => {
						console.log(e);
					});

				break;
			}
		}
		case "enable": {
			if (tags.username == channel.slice(1)) {
				enable(message, tags, channel, bancho, client, args);

				break;
			} else {
				client
					.say(
						channel,
						`@${tags["display-name"]}: Invalid permissions.`
					)
					.catch((e) => {
						console.log(e);
					});

				break;
			}
		}
		default: {
			const db_channel = (await users.find()).find(
				(u) => u.twitch.channel == channel.slice(1)
			);

			if (!db_channel)
				return client.say(channel, "Streamer not registred!");

			if (db_channel.twitch_options.levels_enable == false)
				return client.say(channel, "Levels are disabled here!");

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
				return client
					.say(
						channel,
						`@${tags.username} Wait... You don't exist in my database, wait some seconds and try again.`
					)
					.catch((e) => {
						console.log(e);
					});

			const level = user.levels.filter(
				(l: any) => l.channel == channel
			)[0];

			const rank =
				channel_users.findIndex(() => user.username == tags.username) +
				1;

			if (!level)
				return client
					.say(
						channel,
						`@${tags.username} [#0] Level 0, Xp: 0 | Next: 0/120`
					)
					.catch((e) => {
						console.log(e);
					});

			return client
				.say(
					channel,
					`${tags["display-name"]}: [#${rank}] Level ${level.level}, Xp: ${level.xp} | Next: ${level.xp}/${level.next_level_xp}`
				)
				.catch((e) => {
					console.log(e);
				});

			break;
		}
	}
};
