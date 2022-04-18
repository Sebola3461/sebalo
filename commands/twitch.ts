import { PrivateMessage } from "bancho.js";
import unlinkTwitchChannel from "../twitch/helpers/unlinkTwitchChannel";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | sending twitch help for ${
			user.username
		} (${user.id})`
	);

	switch (args[0]) {
		case "link": {
			pm.user.sendMessage(
				`Click [https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=https://sebola-twitch-authorization.herokuapp.com/twitch&client_id=14230 here] to enable twitch beatmap requests`
			);

			break;
		}
		case "unlink": {
			unlinkTwitchChannel(user.id, pm);

			break;
		}
		default: {
			pm.user.sendMessage(
				`Invalid option! Use !twitch link or !twitch unlink`
			);

			break;
		}
	}

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | twitch help sended for ${
			user.username
		} (${user.id})`
	);
};
