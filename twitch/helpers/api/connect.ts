import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import { twitchChannels, twitchUsers, users } from "../../../database";
dotenv.config();

let lv: any = {};

async function connect() {
	console.log("Updating twitch authorization token...");

	try {
		const r = await axios("https://id.twitch.tv/oauth2/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: querystring.stringify({
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				grant_type: "client_credentials",
			}),
		});

		if (r.status != 200) throw new Error(r.data);

		process.env.twitch_token = r.data.access_token;

		// (await twitchChannels.find()).forEach(async (u: any) => {
		// 	console.log(
		// 		`${"Task Running".bgYellow.bgCyan} Atualizando ${u.username}`
		// 	);

		// 	const levels = u.levels.users;

		// 	for (const level of levels) {
		// 		const l_user = await twitchUsers.findOne({
		// 			username: level.user,
		// 		});

		// 		if (l_user == null) return;

		// 		const index = levels.findIndex(
		// 			(l: any) => l.user == l_user.username
		// 		);

		// 		u.levels.users[index]["avatar"] = l_user.avatar;
		// 		u.levels.users[index]["user_id"] = l_user._id;
		// 	}

		// 	console.log(
		// 		`${"Sucesso".bgGreen.black} levels de ${
		// 			u.username
		// 		} atualizados!`
		// 	);
		// });

		setTimeout(() => {
			connect();
		}, r.data.expires_in);

		console.log("Twitch token updated!");
	} catch (e) {
		console.error(e);
	}
}

connect();
