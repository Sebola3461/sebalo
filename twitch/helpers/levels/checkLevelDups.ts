import { ChatUserstate } from "tmi.js";
import { twitchUsers } from "../../../database";

export default async (
	user_data: ChatUserstate,
	channel: string,
	message: string
) => {
	console.log(`Checking dups for ${user_data.username} on ${channel}`);

	let user = await twitchUsers.findById(user_data["user-id"]);

	if (user == null)
		return {
			status: 403,
			message: "This user doesnt exist in the database.",
		};

	// ? Add level object to user
	const levels = user.levels.filter((l: any) => {
		l.channel == channel;
	});

	if (levels.length > 1) {
		const index = user.levels.findIndex((l: any) => {
			l.channel == channel;
		});

		user.levels.splice(index, levels.length - 1);

		console.log(
			`Removed ${levels.length - 1} dups for ${
				user_data.username
			} on ${channel}!`
		);
	}

	await twitchUsers.findByIdAndUpdate(user._id, user);

	const index = user.levels.findIndex((l: any) => l.channel == channel);

	console.log(`Dups checked for ${user_data.username} on ${channel}!`);

	return index;
};
