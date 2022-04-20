import { PrivateMessage } from "bancho.js";
import pause from "./subcommands/requests/pause";
import resume from "./subcommands/requests/resume";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	switch (args[0]) {
		case "pause": {
			args.shift();

			pause(pm, user);

			break;
		}
		case "resume": {
			args.shift();

			resume(pm, user);

			break;
		}
		default: {
			pm.user.sendMessage(
				`[https://github.com/Sebola3461/sebalo/wiki/Requests-Configuration Need help?]`
			);

			break;
		}
	}
};
