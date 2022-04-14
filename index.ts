import { BanchoClient } from "bancho.js";
import dotenv from "dotenv";
import commandHandler from "./helpers/messages/commandHandler";
dotenv.config();
import "./helpers/fetcher/connectApi";
import createNewUser from "./database/utils/createNewUser";
import * as database from "./database";

const client = new BanchoClient({
	username: "Sebola",
	password: process.env.IRC_PASSWORD || "password",
	port: Number(process.env.IRC_PORT),
	apiKey: process.env.OSU_API_KEY || "KEY",
});

client.connect().then(() => {
	console.log("Running.");

	client.on("PM", async (pm) => {
		const user_data = await pm.user.fetchFromAPI();

		let user = await database.users.findById(user_data.id);

		if (user == null) user = await createNewUser(user);

		commandHandler(pm, user);
	});
});
