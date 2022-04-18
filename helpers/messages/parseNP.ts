import { PrivateMessage } from "bancho.js";
import fetchBeatmap from "../fetcher/fetchBeatmap";
import calculateCatchBeatmap from "../performance/calculateCatchBeatmap";
import calculateStandardBeatmap from "../performance/calculateStandardBeatmap";
import calculateTaikoBeatmap from "../performance/calculateTaikoBeatmap";
import calculateExtras, { calculateCTBExtras } from "./calculateExtras";
import parseNPMods from "./parseNPMods";
import * as database from "./../../database";
import createNewUser from "../../database/utils/createNewUser";
import calculateManiaBeatmap from "../performance/calculateManiaBeatmap";
import getBeatmapMessage from "./getBeatmapMessage";

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

	if (beatmap.status != 200) return pm.user.sendMessage("Beatmap not found");

	await database.users.findByIdAndUpdate(user.id, {
		last_beatmap: beatmap_id,
	});

	const mods = parseNPMods(pm.content);

	if (!beatmap.data) return pm.user.sendMessage("Beatmap not found");

	const message = await getBeatmapMessage(beatmap.data, mods);

	pm.user.sendMessage(message);

	console.log(
		`${new Date().toLocaleDateString("pt-BR")} | Np for ${
			bancho_user.username
		} (${bancho_user.id}) calculated!`
	);
};
