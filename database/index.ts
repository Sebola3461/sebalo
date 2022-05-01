import mongoose from "mongoose";
import user from "./schemas/user";
import dotenv from "dotenv";
import twitchUser from "./schemas/twitchUser";
import axios from "axios";
import channels from "./schemas/channels";
dotenv.config();

console.log("database", "Starting databse connection...");

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
	(err) => {
		if (err)
			return console.error(
				"database",
				"An error has occurred:\n".concat(err.message)
			);

		console.log("database", "Database connected!");
	}
);

export const users = mongoose.model("Users", user);
export const twitchUsers = mongoose.model("TwitchUsers", twitchUser);
export const twitchChannels = mongoose.model("Channels", channels);
