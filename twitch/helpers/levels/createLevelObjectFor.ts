import { ChatUserstate } from "tmi.js";
import { twitchUsers } from "../../../database";

export default async (
	user_data: ChatUserstate,
	channel: string,
	message: string
) => {
	let user = await twitchUsers.findById(user_data.id);

	if (user == null)
		return {
			status: 403,
			message: "This user doesnt exist in the database.",
		};

	const new_level = {
		last_update: new Date(),
		channel: channel,
		level: 0,
		xp: 0,
		next_level_xp: 120,
		last_message: message,
		last_message_date: new Date(),
	};

	// ? Add level object to user
	user.levels.push(new_level);

	await twitchUsers.findByIdAndUpdate(user._id, user);

	const index = user.levels.findIndex((l: any) => l.channel == channel);

	return index;
};
