import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import pause from "./subcommands/requests/pause";
import resume from "./subcommands/requests/resume";
import setmax from "./subcommands/stars/setmax";
import setmessage from "./subcommands/stars/setmessage";
import setmin from "./subcommands/stars/setmin";

export default (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	switch (args[0]) {
		case "setmin": {
			if (tags.username == channel.slice(1)) {
				setmin(message, tags, channel, bancho, client, args);

				break;
			} else if (tags.mod) {
				setmin(message, tags, channel, bancho, client, args);

				break;
			} else {
				client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);

				break;
			}

			break;
		}
		case "setmax": {
			if (tags.username == channel.slice(1)) {
				setmax(message, tags, channel, bancho, client, args);

				break;
			} else if (tags.mod) {
				setmax(message, tags, channel, bancho, client, args);

				break;
			} else {
				client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);

				break;
			}

			break;
		}
		case "setmessage": {
			if (tags.username == channel.slice(1)) {
				setmessage(message, tags, channel, bancho, client, args);

				break;
			} else if (tags.mod) {
				setmessage(message, tags, channel, bancho, client, args);

				break;
			} else {
				client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);

				break;
			}

			break;
		}
		default: {
			client.say(
				channel,
				`@${tags["display-name"]}: Need help? Use "!stars setmessage" to set the error message, "!stars setmin" to set a minimum star rating value and "!stars setmax" to set a max star rating.`
			);

			break;
		}
	}
};
