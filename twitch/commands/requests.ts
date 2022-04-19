import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import pause from "./subcommands/requests/pause";
import resume from "./subcommands/requests/resume";

export default (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	switch (args[0]) {
		case "pause": {
			if (tags.username == channel.slice(1)) {
				pause(message, tags, channel, bancho, client);

				break;
			} else if (tags.mod) {
				pause(message, tags, channel, bancho, client);

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
		case "resume": {
			if (tags.username == channel.slice(1)) {
				return resume(message, tags, channel, bancho, client);
			} else if (tags.mod) {
				return resume(message, tags, channel, bancho, client);
			} else {
				return client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);
			}

			break;
		}
		default: {
			client.say(
				channel,
				`@${tags["display-name"]}: Need help? Use "!requests pause" to pause requests and "!requests resume" to resume.`
			);

			break;
		}
	}
};
