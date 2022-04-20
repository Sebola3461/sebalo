import { Client } from "tmi.js";
import { twitchUsers } from "../../database";
import calculateDate from "./calculateDate";
import getChannelUsers from "./getChannelUsers";

export default (client: Client) => {
	console.log("Updating levels...");

	client.getChannels().forEach(async (channel) => {
		const channel_users = await getChannelUsers(channel.slice(1));

		console.log(`Updating for ${channel}`);

		if (channel_users.chatters.broadcaster.length < 1) {
			console.log(`Skipping ${channel} cuz its offline`);

			return;
		}

		updateFor(channel);
	});

	async function updateFor(channel: string) {
		const db_users = await twitchUsers.find();

		db_users.forEach((u) => {
			const level = u.levels.filter((l: any) => l.channel == channel)[0];

			if (!level) return;

			let points_add =
				60 -
				Math.round(
					calculateDate(new Date(level.last_message_date), new Date())
				);

			if (points_add < 0) points_add = 0;
			if (points_add > 20) points_add = 20;

			updateUserLevel(points_add, u);
		});

		async function updateUserLevel(points: number, user: any) {
			let channel_level = user.levels.filter((l: any) => {
				return l.channel == channel;
			})[0];

			if (!channel_level) {
				channel_level = {
					last_update: new Date(),
					channel: channel,
					level: 0,
					xp: 0,
					next_level_xp: 120,
					last_message: "",
					last_message_date: new Date(),
				};

				await twitchUsers.findByIdAndUpdate(user._id, user);
			}

			channel_level.xp += points;
			channel_level.last_update = new Date();

			if (channel_level.xp > channel_level.next_level_xp) {
				channel_level.level++;
				channel_level.next_level_xp += channel_level.xp * 1.5;

				client
					.action(
						channel,
						`${user.username} has advanced to level ${channel_level.level}!`
					)
					.catch((e) => {
						console.log(e);
					});
			}

			const channel_level_index = user.levels.findIndex(
				(l: any) => l == channel_level
			);

			user.levels[channel_level_index] = channel_level;

			await twitchUsers.findByIdAndUpdate(user._id, user);
		}
	}

	console.log("Levels updated!");
};
