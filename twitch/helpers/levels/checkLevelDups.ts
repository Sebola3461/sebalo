import { ChatUserstate } from "tmi.js";
import { twitchUsers } from "../../../database";

export default async (channel: string) => {
	console.log(`Checking dups for ${channel}`);

	// ? Add level object to user
	const levels = (await twitchUsers.find()).filter((u: any) => {
		return u.levels.filter((l: any) => l.channel == channel).length > 1;
	});

	levels.forEach(async (u) => {
		const index = u.levels.findIndex((l: any) => {
			return l.channel == channel;
		});

		const user_levels = u.levels.filter((l: any) => {
			return l.channel == channel;
		});

		user_levels.sort((a: { xp: number }, b: { xp: number }) => a.xp - b.xp);

		u.levels.splice(index, user_levels.length - 1);

		console.log(
			`Removed ${user_levels.length - 1} dups for ${
				u.username
			} on ${channel}!`
		);

		await twitchUsers.findByIdAndUpdate(u._id, u);
	});

	console.log(`Dups checked for ${channel}!`);
};
