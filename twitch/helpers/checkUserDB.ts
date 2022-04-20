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
	let db_user = await twitchUsers.findById(tags["user-id"]);

	if (!tags["user-id"]) return;

	if (db_user == null) return;
	let current_level_data = db_user.levels.filter(
		(level: any) => level.channel == channel
	)[0];

	if (!current_level_data) {
		current_level_data = {
			last_update: new Date(),
			channel: channel,
			level: 0,
			xp: 0,
			next_level_xp: 120,
			last_message: message,
			last_message_date: new Date(),
		};

		db_user.levels.push(current_level_data);
	}

	await twitchUsers.findByIdAndUpdate(db_user._id, db_user);
};
