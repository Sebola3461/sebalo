import { BanchoClient } from "bancho.js";
import { ChatUserstate, Client } from "tmi.js";
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
		case "pause": {
			if (tags.username == channel.slice(1)) {
				pause(message, tags, channel, bancho, client);

				break;
			} else if (tags.mod) {
				pause(message, tags, channel, bancho, client);

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
		case "resume": {
			if (tags.username == channel.slice(1)) {
				return resume(message, tags, channel, bancho, client);
			} else if (tags.mod) {
				return resume(message, tags, channel, bancho, client);
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
		case "setconfirm": {
			if (tags.username == channel.slice(1)) {
				return setconfirm(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setconfirm(message, tags, channel, bancho, client, args);
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
		case "setmessage": {
			if (tags.username == channel.slice(1)) {
				return setmessage(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setmessage(message, tags, channel, bancho, client, args);
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
		case "setmodes": {
			if (tags.username == channel.slice(1)) {
				return setmodes(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setmodes(message, tags, channel, bancho, client, args);
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
		case "setstatus": {
			if (tags.username == channel.slice(1)) {
				return setstatus(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return setstatus(message, tags, channel, bancho, client, args);
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
		case "modemsg": {
			if (tags.username == channel.slice(1)) {
				return modemsg(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return modemsg(message, tags, channel, bancho, client, args);
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
		case "statusmsg": {
			if (tags.username == channel.slice(1)) {
				return statusmsg(message, tags, channel, bancho, client, args);
			} else if (tags.mod) {
				return statusmsg(message, tags, channel, bancho, client, args);
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
