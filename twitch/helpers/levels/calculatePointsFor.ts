import { ChatUserstate, Client } from "tmi.js";
import "colors";
import calculateDate from "./calculateDate";
import { twitchUsers } from "../../../database";

export default async (
	client: Client,
	tags: ChatUserstate,
	channel: string,
	user: any,
	level_index: number,
	message: string
) => {
	console.log(
		`${
			"calculatePointsFor".bgYellow.black
		} ${`Calculating points for user ${tags.username} in ${channel}`}`
	);

	let level = user.levels[level_index];

	if (!level) {
		console.log(
			`${
				"calculatePointsFor".bgYellow.black
			} ${`Skipping user ${tags.username} in ${channel} cuz the user doesnt have a level object here.`}`
		);

		return;
	}

	// ? ==== Time to calculate levels and points!

	const now = new Date(); // ? Save this to calculate relative date

	if (calculateDate(level.last_update, now) < 20) {
		console.log(
			`${
				"calculatePointsFor".bgYellow.black
			} ${`Skipping user ${tags.username} in ${channel} cuz the last update is too recent.`}`
		);
	}

	// ? Nerf lines
	if (calculateDate(level.last_message_date, now) < 15) {
		console.log(
			`${
				"calculatePointsFor".bgYellow.black
			} ${`Skipping user ${tags.username} in ${channel} cuz the last message is too recent.`}`
		);
	}

	// // ? Check diff rate between the last message and the new message
	// if (
	// 	leven(level.last_message, message) <
	// 	level.last_message.length - message.length
	// ) {
	// 	console.log(
	// 		`${
	// 			"calculatePointsFor".bgYellow.black
	// 		} ${`Skipping user ${tags.username} in ${channel} cuz the last message diff is too low.`}`
	// 	);
	// }

	// ? Ok let's calculate the fucking levels

	level.last_message_date = new Date();
	level.last_message = message;

	let points_to_add =
		60 - Math.round(calculateDate(new Date(level.last_message_date), now));

	if (points_to_add < 0) points_to_add = 0;
	if (points_to_add > 40) points_to_add = 40;

	level.xp += points_to_add; // ? Update xp

	// ? Update level
	if (level.xp > level.next_level_xp) {
		level.level += 1;
		level.next_level_xp += level.xp * 1.5;
		level.last_update = new Date();

		user.levels[level_index] = level;

		await twitchUsers.findByIdAndUpdate(user._id, user);

		client.action(
			channel,
			`${tags["display-name"]} has advanced to level ${level.level}`
		);

		return console.log(
			`User ${tags.username} in ${channel} has advanced to level ${level.level}/${level.xp}!`
		);
	} else {
		user.levels[level_index] = level;
		await twitchUsers.findByIdAndUpdate(user._id, user);
	}

	console.log(`Points for user ${tags.username} in ${channel} calculated!`);

	return void {};
};
