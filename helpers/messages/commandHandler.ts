import { PrivateMessage } from "bancho.js";
import commands from "../../commands";
import parseNP from "./parseNP";
import dotenv from "dotenv";
dotenv.config();

export default async (pm: PrivateMessage, user: any) => {
	if (pm.user.ircUsername == process.env.IRC_USERNAME) return;

	if (
		pm.content.includes("https://osu.ppy.sh/beatmapsets/") &&
		pm.user.ircUsername != process.env.IRC_USERNAME
	)
		parseNP(pm, user);

	if (
		!pm.content.startsWith("!") &&
		pm.user.ircUsername != process.env.IRC_USERNAME
	)
		return;

	const args = pm.content.slice(1).trim().split(" ");

	const requested_command = commands[args[0]];

	if (!requested_command)
		return pm.user.sendMessage(
			"Hm? Command not found! Use !help to see a list of avaliable commands."
		);

	try {
		const user = await pm.user.fetchFromAPI();
		args.shift();
		requested_command(pm, args, user);
	} catch (e) {
		pm.user.sendMessage("Oh firetruck! An error has ocurred. Sorry");
		console.log(e);
	}
};
