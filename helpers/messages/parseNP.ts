import { PrivateMessage } from "bancho.js";
import fetchBeatmap from "../fetcher/fetchBeatmap";
import calculateCatchBeatmap from "../performance/calculateCatchBeatmap";
import calculateStandardBeatmap from "../performance/calculateStandardBeatmap";
import calculateTaikoBeatmap from "../performance/calculateTaikoBeatmap";
import calculateExtras, { calculateCTBExtras } from "./calculateExtras";
import parseNPMods from "./parseNPMods";
import * as database from "./../../database";
import createNewUser from "../../database/utils/createNewUser";

export default async (pm: PrivateMessage, user: any) => {
	const bancho_user = await pm.user.fetchFromAPI();

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Calculating np for ${
			bancho_user.username
		} (${bancho_user.id})`
	);
	let url = "";

	pm.content.split(" ").forEach((arg) => {
		if (
			arg
				.replace("[", "")
				.replace("]", "")
				.startsWith("https://osu.ppy.sh/beatmapsets/")
		)
			url = arg.replace("[", "").replace("]", "");
	});

	const beatmap_id = url.split("/").pop();

	if (beatmap_id == undefined || url.split("/").length != 6)
		return pm.user.sendMessage("Invalid beatmap provided.");

	const beatmap = await fetchBeatmap(beatmap_id);

	if (beatmap.status != 200 || !beatmap.data)
		return pm.user.sendMessage("Beatmap not found");

	await database.users.findByIdAndUpdate(user.id, {
		last_beatmap: beatmap_id,
	});

	const mods = parseNPMods(pm.content);

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

	pm.user.sendMessage(
		`${beatmap.data.beatmapset?.artist} - ${
			beatmap.data.beatmapset?.title
		} [${beatmap.data.version}] (${
			mods == "NM"
				? beatmap.data.difficulty_rating.toFixed(2)
				: performance[0].att.starRating.toFixed(2)
		}★${mods == "NM" ? "" : ` +${mods}`})  |  ${extras}${pps}`
	);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Np for ${
			bancho_user.username
		} (${bancho_user.id}) calculated!`
	);
};
