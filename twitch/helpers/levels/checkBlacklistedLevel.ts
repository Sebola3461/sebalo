import { ChatUserstate, Client } from "tmi.js";
import "colors";
import { twitchUsers } from "../../../database";

export default async (tags: ChatUserstate, channel: string) => {
	let user = await twitchUsers.findById(tags["user-id"]);

	if (user == null) return;

	const level = user.levels.findIndex((l: any) => l.channel == channel);

	if (level < 0) return;

	user.levels.splice(level, 1);

	await twitchUsers.findByIdAndUpdate(tags["user-id"], user);

	return void {};
};
