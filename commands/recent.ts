import { PrivateMessage } from "bancho.js";
import { fetchBeatmapset } from "../helpers/fetcher/fetchBeatmap";
import { fetchUserScores } from "../helpers/fetcher/fetchUser";
import parameterParser from "../helpers/messages/parameterParser";
import calculateCatchScore from "../helpers/performance/calculateCatchScore";
import calculateManiaScore from "../helpers/performance/calculateManiaScore";
import calculateStandardScore from "../helpers/performance/calculateStandardScore";
import calculateTaikoBeatmap from "../helpers/performance/calculateTaikoBeatmap";
import calculateTaikoScore from "../helpers/performance/calculateTaikoScore";
import { Score } from "../types/score";

export default async (pm: PrivateMessage, args: string[], user: any) => {
	const params = parameterParser(args);

	let mode: string | undefined = undefined;
	let include_fails: 0 | 1 = 0;

	if (params.params.find((p) => p.name == "mode")) {
		mode = params.params.find((p) => p.name == "mode")?.value;
	}

	if (params.params.find((p) => p.name == "fail")) {
		const value = params.params.find((p) => p.name == "fail")?.value;

		include_fails = value == "yes" ? 1 : 0;
	}

	const user_scores = await fetchUserScores(
		pm.user.id,
		"recent",
		include_fails,
		mode
	);

	if (user_scores.status != 200)
		return pm.user.sendMessage(
			"Something is wrong! I can't fetch your scores."
		);

	if (user_scores.data.length == 0)
		return pm.user.sendMessage("You don't have any recent score!");

	const mostRecent = user_scores.data[0];
	const pp = (await calculate(mostRecent))[0];

	console.log(pp);

	async function calculate(score: Score) {
		let v;
		switch (score.mode) {
			case "osu": {
				v = await calculateStandardScore(
					score.beatmap?.id.toString() || "0",
					score
				);

				break;
			}
			case "taiko": {
				v = await calculateTaikoScore(
					score.beatmap?.id.toString() || "0",
					score
				);

				break;
			}
			case "fruits": {
				v = await calculateCatchScore(
					score.beatmap?.id.toString() || "0",
					score
				);

				break;
			}
			case "mania": {
				v = await calculateManiaScore(
					score.beatmap?.id.toString() || "0",
					score
				);

				break;
			}
		}

		return v;
	}

	function getMods() {
		if (pp.att.mods.acronyms.length != 0)
			return ` +${pp.att.mods.acronyms.join("")}`;

		return "";
	}

	function getBPM() {
		if (pp.beatmap.bpmMax.toFixed(0) == pp.beatmap.bpmMin.toFixed(0))
			return `${pp.beatmap.bpmMax.toFixed(0)}BPM`;

		return `${pp.beatmap.bpmMin.toFixed(
			0
		)}BPM - ${pp.beatmap.bpmMax.toFixed(0)}BPM`;
	}

	const beatmapset = await fetchBeatmapset(
		mostRecent.beatmap?.beatmapset_id || 0
	);

	if (beatmapset.status != 200 || !beatmapset.data)
		return pm.user.sendMessage(
			"Something is wrong! I can't fetch the beatmap."
		);

	function getHits(score: Score) {
		let v = "";
		switch (score.mode) {
			case "osu": {
				v = `300x: ${
					score.statistics.count_300 + score.statistics.count_geki
				} / 100x: ${
					score.statistics.count_100 + score.statistics.count_katu
				} / 50x: ${score.statistics.count_50} / Miss: ${
					score.statistics.count_miss
				}`;

				break;
			}
			case "taiko": {
				v = `300x: ${
					score.statistics.count_300 + score.statistics.count_geki
				} / 100x: ${
					score.statistics.count_100 + score.statistics.count_katu
				} / Miss: ${score.statistics.count_miss}`;

				break;
			}
			case "fruits": {
				v = `Fruits: ${score.statistics.count_300} / Juice Drops: ${score.statistics.count_100} / Droplets: ${score.statistics.count_50} / Miss: ${score.statistics.count_miss}`;

				break;
			}
			case "mania": {
				v = `350x: ${score.statistics.count_geki} / 300x: ${score.statistics.count_300} / 150x: ${score.statistics.count_katu} / 100x: ${score.statistics.count_100} / 50x: ${score.statistics.count_50} Miss: ${score.statistics.count_miss}`;

				break;
			}
		}

		return v;
	}

	function getPerformance() {
		if (mostRecent.mode != "mania")
			return `${(mostRecent.accuracy * 100).toFixed(2)}%: ${pp.pp}pp`;

		return `${mostRecent.score.toFixed(0)}: ${pp.pp}pp`;
	}

	return pm.user.sendMessage(
		`${beatmapset.data.artist} - ${beatmapset.data.title} [${
			mostRecent.beatmap?.version
		}] (${pp.att.starRating.toFixed(2)}★${getMods()}) | ♫: ${getBPM()} | [${
			mostRecent.max_combo
		}x/${pp.beatmap.maxCombo}x] | ${getHits(
			mostRecent
		)} | ${getPerformance()}`
	);
};
