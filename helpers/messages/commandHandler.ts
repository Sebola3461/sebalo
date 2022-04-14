import { PrivateMessage } from "bancho.js";
import commands from "../../commands";
import parseNP from "./parseNP";

export default async (pm: PrivateMessage, user: any) => {
	if (pm.content.includes("https://osu.ppy.sh/beatmapsets/"))
		parseNP(pm, user);

	if (!pm.content.startsWith("!")) return;

	const args = pm.content.slice(1).trim().split(" ");

	const requested_command = commands[args[0]];

	if (!requested_command)
		return pm.recipient.sendMessage(
			"Hm? Command not found! Use !help to see a list of avaliable commands."
		);

	try {
		const user = await pm.user.fetchFromAPI();
		args.shift();
		requested_command(pm, args, user);
	} catch (e) {
		pm.recipient.sendMessage("Oh firetruck! An error has ocurred. Sorry");
	}
};
