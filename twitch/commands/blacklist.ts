import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
import add from "./subcommands/blacklist/add";
import remove from "./subcommands/blacklist/remove";
import modemsg from "./subcommands/requests/modemsg";
import pause from "./subcommands/requests/pause";
import resume from "./subcommands/requests/resume";
import setconfirm from "./subcommands/requests/setconfirm";
import setmessage from "./subcommands/requests/setmessage";
import setmodes from "./subcommands/requests/setmodes";
import setstatus from "./subcommands/requests/setstatus";
import statusmsg from "./subcommands/requests/statusmsg";

export default (
	message: string,
	tags: ChatUserstate,
	channel: string,
	bancho: BanchoClient,
	client: Client,
	args: string[]
) => {
	switch (args[0]) {
		case "add": {
			if (tags.username == channel.slice(1)) {
				add(message, tags, channel, bancho, client, args);

				break;
			} else {
				client
					.say(
						channel,
						`@${tags["display-name"]}: Invalid permissions.`
					)
					.catch((e) => {
						console.log(e);
					});

				break;
			}

			break;
		}
		case "remove": {
			if (tags.username == channel.slice(1)) {
				return remove(message, tags, channel, bancho, client, args);
			} else {
				return client
					.say(
						channel,
						`@${tags["display-name"]}: Invalid permissions.`
					)
					.catch((e) => {
						console.log(e);
					});
			}

			break;
		}
		default: {
			client
				.say(
					channel,
					`@${tags["display-name"]}: Need help? Follow this link: https://github.com/Sebola3461/sebalo/wiki/Requests-Configuration`
				)
				.catch((e) => {
					console.log(e);
				});

			break;
		}
	}
};
