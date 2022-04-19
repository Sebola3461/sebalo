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
				`@${tags["display-name"]}: Need help? Follow this link: https://github.com/Sebola3461/sebalo/wiki/Request-Star-Rating-Configuration`
			);

			break;
		}
	}
};
