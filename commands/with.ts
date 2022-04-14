import { PrivateMessage } from "bancho.js";
import fetchBeatmap from "../helpers/fetcher/fetchBeatmap";
import calculateExtras, {
	calculateCTBExtras,
} from "../helpers/messages/calculateExtras";
import calculateCatchBeatmap from "../helpers/performance/calculateCatchBeatmap";
import calculateStandardBeatmap from "../helpers/performance/calculateStandardBeatmap";
import calculateTaikoBeatmap from "../helpers/performance/calculateTaikoBeatmap";
import * as database from "./../database";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Calculating np !with for ${
			user.username
		} (${user.id})`
	);

	const mods = args[0];

	if (!mods)
		return pm.user.sendMessage(
			"Something is wrong. The correct syntax is [https://osu.ppy.sh/ !with <mods>]"
		);

	const user_data = await database.users.findById(user.id);

	const beatmap = await fetchBeatmap(user_data.last_beatmap);

	if (beatmap.status != 200 || !beatmap.data)
		return pm.user.sendMessage(
			"Beatmap not found. Try /np before use this command."
		);

	let performance: any[] = [];

	let pps = "";

	switch (beatmap.data.mode) {
		case "osu": {
			performance = await calculateStandardBeatmap(beatmap.data, mods);

			calculatePerformance();
			break;
		}
		case "taiko": {
			performance = await calculateTaikoBeatmap(beatmap.data, mods);

			calculatePerformance();

			break;
		}

		case "fruits": {
			performance = await calculateCatchBeatmap(beatmap.data, mods);

			calculatePerformance();

			break;
		}
	}

	function calculatePerformance() {
		performance.forEach((p: { acc: number; pp: number }, i) => {
			pps = pps.concat(`${p.acc}%: ${p.pp}pp ${i < 4 ? "•" : ""} `);
		});
	}

	let extras = "";

	if (beatmap.data.mode == "osu") {
		extras = calculateExtras(performance[0].att);
	}

	if (beatmap.data.mode == "fruits") {
		extras = calculateCTBExtras(beatmap.data.accuracy, beatmap.data.ar);
	}

	if (performance[0].att.mods.acronyms.join("") == "NM")
		return pm.user.sendMessage(
			"Invalid mods provided! Press esc -> f1 to see a list of avaliable mods for this gamemode."
		);

	pm.user.sendMessage(
		`${beatmap.data.beatmapset?.artist} - ${
			beatmap.data.beatmapset?.title
		} [${beatmap.data.version}] (${
			mods == "NM"
				? beatmap.data.difficulty_rating.toFixed(2)
				: performance[0].att.starRating.toFixed(2)
		}★${
			mods == "NM" ? "" : ` +${performance[0].att.mods.acronyms.join("")}`
		})  |  ${extras}${pps}`
	);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Np !with calculated for ${
			user.username
		} (${user.id})`
	);
};
