import { users } from "../../../database";

export default async () => {
	const db = (await users.find()).filter((u) => {
		return u.twitch.channel != "";
	});

	const channels: string[] = [];

	db.forEach((u) => {
		channels.push(u.twitch.channel);
	});

	return channels;
};
