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

		// (await users.find())
		// 	.filter((u) => u.twitch.channel != "")
		// 	.forEach(async (u: any) => {
		// 		let channel = await twitchChannels.findOne({
		// 			username: u.twitch.channel,
		// 		});

		// 		console.log(
		// 			`${"Task Running".bgYellow.bgCyan} Migrando levels de ${
		// 				u._id
		// 			} para ${channel.username}`
		// 		);

		// 		channel.osu_id = u._id;

		// 		await twitchChannels.findByIdAndUpdate(channel._id, channel);

		// 		console.log(
		// 			`${"Sucesso".bgGreen.black} levels de ${u.username} para ${
		// 				channel.username
		// 			} migrados!`
		// 		);
		// 	});

		setTimeout(() => {
			connect();
		}, r.data.expires_in);

		console.log("Twitch token updated!");
	} catch (e) {
		console.error(e);
	}
}

connect();
