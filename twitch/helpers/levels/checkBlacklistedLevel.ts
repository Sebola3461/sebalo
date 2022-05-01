import { ChatUserstate } from "tmi.js";
import "colors";
import { twitchChannels } from "../../../database";

export default async (tags: ChatUserstate, channel: string) => {
	let db_channel = await twitchChannels.findOne({
		username: channel.slice(1),
	});

	if (db_channel == null) return;

	const level = db_channel.levels.users.findIndex(
		(l: any) => l.user == tags.username
	);

	if (level == -1) return;

	db_channel.levels.users.splice(level, 1);

	await twitchChannels.findOneAndUpdate(
		{
			username: channel.slice(1),
		},
		db_channel
	);

	return void {};
};
