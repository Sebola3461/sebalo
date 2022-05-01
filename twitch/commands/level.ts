import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, twitchUsers, users } from "../../database";
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
			const db_channel = await twitchChannels.findOne({
				username: channel.slice(1),
			});

			if (!db_channel)
				return client.say(channel, "Streamer not registred!");

			if (db_channel.levels.enable == false)
				return client.say(channel, "Levels are disabled here!");

			const user = await twitchUsers.findById(tags["user-id"]);

			db_channel.levels.users.sort((a: any, b: any) => {
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

			const level = db_channel.levels.users.find(
				(l: any) => l.user == tags.username
			);

			const rank =
				db_channel.levels.users.findIndex(
					(u: any) => u.user == tags.username
				) + 1;

			if (!level)
				return client
					.say(
						channel,
						`@${tags.username} [#0] Level: 0, Xp: 0 | Next: 0/120`
					)
					.catch((e) => {
						console.log(e);
					});

			return client
				.say(
					channel,
					`${tags["display-name"]}: [#${rank}] Level: ${level.level}, Xp: ${level.xp} | Next: ${level.xp}/${level.next_level_xp}`
				)
				.catch((e) => {
					console.log(e);
				});

			break;
		}
	}
};
