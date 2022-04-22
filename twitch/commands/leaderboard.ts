import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";

export default async (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	return client
		.say(
			channel,
			`Check level leaderboards here: https://sebola-web.herokuapp.com/levels/${channel.slice(
				1
			)}`
		)
		.catch((e) => {
			console.log(e);
		});
};
