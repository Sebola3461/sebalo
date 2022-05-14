import { ChatUserstate } from "tmi.js";
import { twitchChannels, twitchUsers } from "../../../database";
import getChannelInfo from "../api/getChannelInfo";

export default async (
	user_data: ChatUserstate,
	channel: string,
	message: string
) => {
	if (!user_data["user-id"]) return;

	console.log(
		`Creating level object for ${user_data.username} on ${channel}`
	);

	let db_channel = await twitchChannels.findById(user_data["room-id"]);

	if (db_channel == null)
		return {
			status: 403,
			message: "This user doesnt exist in the database.",
		};

	const new_level = {
		user_id: user_data["user-id"],
		avatar: (await getChannelInfo(user_data.username || "")).data?.avatar,
		user: user_data.username,
		last_update: new Date(),
		channel: channel,
		level: 0,
		xp: 0,
		next_level_xp: 120,
		last_message: message,
		last_message_date: new Date(),
	};

	// ? If exists, fallback
	if (
		db_channel.levels.users.findIndex(
			(l: any) => l.user_id == user_data["user-id"]
		) != -1
	)
		return db_channel.levels.users.findIndex(
			(l: any) => l.user_id == user_data["user-id"]
		);

	// ? Add level object to user
	db_channel.levels.users.push(new_level);

	await twitchChannels.findByIdAndUpdate(db_channel._id, db_channel);

	const index = db_channel.levels.users.findIndex(
		(l: any) => l.user == user_data.username
	);

	console.log(
		`Level object for ${user_data.username} on ${channel} created!`
	);

	return index;
};
