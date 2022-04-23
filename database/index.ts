import mongoose from "mongoose";
import user from "./schemas/user";
import dotenv from "dotenv";
import twitchUser from "./schemas/twitchUser";
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

users.find().then((doc) => {
	doc.filter(
		(u: any) =>
			u.twitch_options.messages.request ==
			"{username} || {mode} {beatmap_url} | {attributes} | {pp100} • {pp99} • {pp98} • {pp99.5} • {pp95}"
	).forEach(async (c) => {
		c.twitch_options.messages.request =
			"{username} || {mode} {beatmap_url} | {attributes} | {pp100} • {pp99} • {pp98} • {pp95}";

		await users.findByIdAndUpdate(c._id, c);
	});
});
