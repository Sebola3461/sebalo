import { BanchoClient } from "bancho.js";
import dotenv from "dotenv";
import commandHandler from "./helpers/messages/commandHandler";
dotenv.config();
import "./helpers/fetcher/connectApi";

const client = new BanchoClient({
	username: "Sebola",
	password: process.env.IRC_PASSWORD || "password",
	port: Number(process.env.IRC_PORT),
	apiKey: process.env.OSU_API_KEY || "KEY",
});

client.connect().then(() => {
	console.log("Running.");

	client.on("PM", (pm) => {
		commandHandler(pm);
	});
});
