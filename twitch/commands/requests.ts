import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import pause from "./subcommands/requests/pause";
import resume from "./subcommands/requests/resume";
import setconfirm from "./subcommands/requests/setconfirm";
import setmessage from "./subcommands/requests/setmessage";
import setmodes from "./subcommands/requests/setmodes";

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
		case "setconfirm": {
			if (tags.username == channel.slice(1)) {
				return setconfirm(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setconfirm(message, tags, channel, bancho, client, args);
			} else {
				return client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);
			}

			break;
		}
		case "setconfirm": {
			if (tags.username == channel.slice(1)) {
				return setmessage(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setmessage(message, tags, channel, bancho, client, args);
			} else {
				return client.say(
					channel,
					`@${tags["display-name"]}: Invalid permissions.`
				);
			}

			break;
		}
		case "setmodes": {
			if (tags.username == channel.slice(1)) {
				return setmodes(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setmodes(message, tags, channel, bancho, client, args);
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
				`@${tags["display-name"]}: Need help? Use "!requests pause" to pause requests, "!requests setconfirm" to set request sent confirmation message, "!requests setsr" to set sr error mesage, "!requests setmodes" to set allowed beatmap playmodes and "!requests setmessage" to set the ingame message.`
			);

			break;
		}
	}
};
