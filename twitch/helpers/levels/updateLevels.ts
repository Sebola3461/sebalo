import { ChatUserstate, Client } from "tmi.js";
import { twitchUsers, users } from "../../../database";
import createNewTwitchUser from "../../../database/utils/createNewTwitchUser";
import getChannelUsers from "../channel/getChannelUsers";
import calculatePointsFor from "./calculatePointsFor";
import checkBlacklistedLevel from "./checkBlacklistedLevel";
import createLevelObjectFor from "./createLevelObjectFor";
import dotenv, { config } from "dotenv";
dotenv.config();

// TODO: Add typing for twitchUsers and users
export async function updateLevels(
	client: Client,
	tags: ChatUserstate,
	channel: string,
	message: string
) {
	if (tags.username == process.env.TWITCH_LOGIN) return;
	console.log(`Updating levels for user ${tags.username} in ${channel}...`);

	if (!tags["user-id"]) {
		return console.log(
			`Skipping ${tags.username} in ${channel} cuz it's a bot...`
		);
	}

	const chat_users = await getChannelUsers(channel.slice(1));

	if (chat_users.chatters.broadcaster.length != 1) {
		console.log(
			`Skipping ${tags.username} in ${channel} cuz the streamer is offline...`
		);

		return;
	}

	let user = await twitchUsers.findById(tags["user-id"]);

	if (user == null) {
		user = await createNewTwitchUser(tags);

		if (!user._id) return;
		await createLevelObjectFor(tags, channel, message);
	}

	let streamer = (await users.find()).filter(
		(u: any) => u.twitch.channel == channel.slice(1)
	)[0];

	if (!streamer) return;

	if (streamer.twitch_options.blacklist.includes(tags.username)) {
		console.log(
			`Skipping ${tags.username} in ${channel} cuz its blacklisted...`
		);

		checkBlacklistedLevel(tags, channel);

		return;
	}

	// ? Level object index for this channel
	let level_index = user.levels.findIndex((l: any) => l.channel == channel);

	// ? Check if the user have a level object in this channel
	if (level_index == -1) {
		level_index = await createLevelObjectFor(tags, channel, message);

		// ? Update current user object after add the level object
		user = await twitchUsers.findById(tags["user-id"]);
	}

	await calculatePointsFor(client, tags, channel, user, level_index, message);

	console.log(`Levels for user ${tags.username} in ${channel} updated!`);
}
