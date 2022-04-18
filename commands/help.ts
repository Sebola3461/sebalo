import { PrivateMessage } from "bancho.js";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | sending help for ${
			user.username
		} (${user.id})`
	);

	pm.user.sendMessage(
		`Click [https://github.com/sebola3461/sebalo/wiki here] to see a list of avaliable commands`
	);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | help sended for ${
			user.username
		} (${user.id})`
	);
};
