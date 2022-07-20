import { twitchChannels } from "../../../database";

export default async () => {
	const db = await twitchChannels.find();

	if (!db) return;

	const channels: string[] = [];

	db.forEach((u) => {
		channels.push(u.username);
	});

	return channels;
};
