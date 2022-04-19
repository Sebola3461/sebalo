import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import commands from "../commands";

export default (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client
) => {
	if (!message.startsWith("!")) return;

	const args = message.slice(1).trim().split(" ");

	const requested_command = commands[args[0]];

	if (!requested_command) return;

	try {
		args.shift();
		requested_command(message, tags, channel, bancho, client, args);
	} catch (e) {
		client.say(channel, "Oh firetruck! An error has ocurred. Sorry");
		console.log(e);
	}
};
