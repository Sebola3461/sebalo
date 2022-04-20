import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import { users, twitchUsers } from "../../database";
import createNewTwitchUser from "../../database/utils/createNewTwitchUser";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	console.log(`Updating last message for user ${tags["user-id"]}`);

	if (!tags["user-id"]) return;

	let db_user = await twitchUsers.findById(tags["user-id"]);

	if (db_user == null) db_user = await createNewTwitchUser(tags);

	let current_level_data = db_user.levels.filter((level: any) => {
		return level.channel == channel;
	})[0];

	if (!current_level_data)
		current_level_data = {
			last_update: new Date(),
			channel: channel,
			level: 0,
			xp: 0,
			next_level_xp: 120,
			last_message: message,
			last_message_date: new Date(),
		};

	const level_index = db_user.levels.findIndex(
		(l: any) => l == current_level_data
	);

	current_level_data.last_message_date = new Date();
	current_level_data.last_message = message;

	db_user.levels[level_index] = current_level_data;

	await twitchUsers.findByIdAndUpdate(db_user._id, db_user);

	console.log(`Message for user ${tags["user-id"]} updated!`);
};
