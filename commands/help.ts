import { PrivateMessage } from "bancho.js";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | sending help for ${
			user.username
		} (${user.id})`
	);

	pm.user.sendMessage(`List of avaliable commands:
	/np: Calculate the pp for the given map
	!with <mods>: Calculate the map with given mods`);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | help sended for ${
			user.username
		} (${user.id})`
	);
};
