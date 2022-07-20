import { PrivateMessage } from "bancho.js";
import fetchBeatmap from "../helpers/fetcher/fetchBeatmap";
import calculateExtras, {
	calculateCTBExtras,
	calculateManiaExtras,
	calculateTaikoExtras,
} from "../helpers/messages/calculateExtras";
import calculateCatchBeatmap from "../helpers/performance/calculateCatchBeatmap";
import calculateManiaBeatmap from "../helpers/performance/calculateManiaBeatmap";
import calculateStandardBeatmap from "../helpers/performance/calculateStandardBeatmap";
import calculateTaikoBeatmap from "../helpers/performance/calculateTaikoBeatmap";
import * as database from "../database";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	if (user.username == process.env.IRC_USERNAME) return;

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Calculating !acc for ${
			user.username
		} (${user.id})`
	);

	if (!args[0])
		return pm.user.sendMessage(
			"Invalid syntax! correct is !acc <number> <?mods>"
		);

	const acc = Number(args[0].replace(",", "."));

	if (acc > 100 || acc < 20)
		return pm.user.sendMessage("No bro, you can't fc a map with this acc");

	const mods = args[1] != undefined ? args[1].replace(/\+/, "") : "NM";

	if (isNaN(acc))
		return pm.user.sendMessage(
			"Invalid syntax! correct is !acc <number> <?mods>"
		);

	const user_data = await database.users.findById(user.id);

	if (!user_data) return;

	if (user_data.last_beatmap == "")
		return pm.user.sendMessage("Use /np before use this command!");

	const beatmap = await fetchBeatmap(user_data.last_beatmap);

	if (beatmap.status != 200 || !beatmap.data)
		return pm.user.sendMessage(
			"Beatmap not found. Try /np before use this command."
		);

	let performance: any[] = [];

	let pps = "";
	const map_mode = beatmap.data.mode ? beatmap.data.mode : "osu";

	switch (map_mode) {
		case "osu": {
			performance = await calculateStandardBeatmap(beatmap.data, mods, [
				acc,
			]);

			calculatePerformance();
			break;
		}
		case "taiko": {
			performance = await calculateTaikoBeatmap(beatmap.data, mods, [
				acc,
			]);

			calculatePerformance();

			break;
		}

		case "fruits": {
			performance = await calculateCatchBeatmap(beatmap.data, mods, [
				acc,
			]);

			calculatePerformance();

			break;
		}

		case "mania": {
			performance = await calculateManiaBeatmap(beatmap.data, mods, [
				acc,
			]);

			calculatePerformance();

			break;
		}
	}

	function calculatePerformance() {
		performance.forEach(
			(p: { acc?: number; score?: number; pp: number }, i) => {
				if (map_mode != "mania") {
					pps = pps.concat(`${p.acc}%: ${p.pp}pp `);
				} else {
					const scores = ["1mi", "900k", "800k", "700k"];
					pps = pps.concat(`${scores[i]}: ${p.pp}pp  `);
				}
			}
		);
	}

	let extras = "";

	if (beatmap.data.mode == "osu") {
		extras = calculateExtras(performance[0].att);
	}
	if (beatmap.data.mode == "taiko") {
		extras = calculateTaikoExtras(
			performance[0].beatmap,
			performance[0].att
		);
	}
	if (beatmap.data.mode == "fruits") {
		extras = calculateCTBExtras(performance[0].beatmap);
	}
	if (beatmap.data.mode == "mania") {
		extras = calculateManiaExtras(performance[0].beatmap);
	}

	pm.user.sendMessage(
		`${beatmap.data.beatmapset?.artist} - ${
			beatmap.data.beatmapset?.title
		} [${beatmap.data.version}] (${
			mods == "NM"
				? beatmap.data.difficulty_rating.toFixed(2)
				: performance[0].att.starRating.toFixed(2)
		}★${
			mods == "NM" ? "" : ` +${performance[0].att.mods.acronyms.join("")}`
		})  |  ${extras}  |  ${pps}`
	);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | !acc calculated for ${
			user.username
		} (${user.id})`
	);
};
