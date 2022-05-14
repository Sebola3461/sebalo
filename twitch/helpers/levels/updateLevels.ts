import { ChatUserstate, Client } from "tmi.js";
import { twitchChannels, twitchUsers, users } from "../../../database";
import createNewTwitchUser from "../../../database/utils/createNewTwitchUser";
import getChannelUsers from "../channel/getChannelUsers";
import calculatePointsFor from "./calculatePointsFor";
import checkBlacklistedLevel from "./checkBlacklistedLevel";
import createLevelObjectFor from "./createLevelObjectFor";
import dotenv, { config } from "dotenv";
import checkDuplicates from "./checkDuplicates";
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

	if (user == null) user = await createNewTwitchUser(tags);

	let streamer = await twitchChannels.findById(tags["room-id"]);

	if (!streamer) return;

	if (streamer.levels.enable == false)
		return console.log(
			`Skipping ${tags.username} in ${channel} cuz levels are disabled...`
		);

	// streamer.levels.users = checkDuplicates(streamer.levels.users);
	// await twitchChannels.findByIdAndUpdate(streamer._id, streamer);

	if (streamer.requests.blacklist.includes(tags.username)) {
		console.log(
			`Skipping ${tags.username} in ${channel} cuz its blacklisted...`
		);

		checkBlacklistedLevel(tags, channel);

		return;
	}

	// ? Level object index for this channel
	let level_index = streamer.levels.users.findIndex(
		(l: any) => l.user == tags.username
	);

	// ? Check if the user have a level object in this channel
	if (level_index == -1) {
		level_index = await createLevelObjectFor(tags, channel, message);

		// ? Update current user object after add the level object
		user = await twitchUsers.findById(tags["user-id"]);
	}

	await calculatePointsFor(
		client,
		tags,
		channel,
		streamer,
		level_index,
		message
	);

	console.log(`Levels for user ${tags.username} in ${channel} updated!`);
}
