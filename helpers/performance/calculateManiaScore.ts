import { Beatmap } from "../../types/beatmap";
import axios from "axios";
import { BeatmapDecoder } from "osu-parsers";
import { ManiaRuleset } from "osu-mania-stable";
import { Score } from "../../types/score";

export default async (beatmap: string, score: Score) => {
	const osu_file = await axios(`https://osu.ppy.sh/osu/${beatmap}`);

	const decoder = new BeatmapDecoder();
	const ruleset = new ManiaRuleset();
	const parsed: any = decoder.decodeFromString(osu_file.data);

	const mods_combination = ruleset.createModCombination(
		score.mods.length > 0 ? score.mods.join("") : "NM"
	);
	const beatmap_ruleset = ruleset.applyToBeatmapWithMods(
		parsed,
		mods_combination
	);

	const Calculator = ruleset.createDifficultyCalculator(beatmap_ruleset);

	const DifficultyAttributes = Calculator.calculateWithMods(mods_combination);

	const results: any[] = [];

	let score_rate = 1;
	if (DifficultyAttributes.mods.acronyms.includes("EZ")) score_rate *= 0.5;
	if (DifficultyAttributes.mods.acronyms.includes("NF")) score_rate *= 0.5;
	if (DifficultyAttributes.mods.acronyms.includes("HT")) score_rate *= 0.5;

	const real_score = score.score / score_rate;

	let hit300_window =
		34 +
		3 *
			Math.min(
				10,
				Math.max(0, 10 - beatmap_ruleset.difficulty.overallDifficulty)
			);
	let strain_value =
		((5 * Math.max(1, DifficultyAttributes.starRating / 0.2) - 4) ** 2.2 /
			135) *
		(1 + 0.1 * Math.min(1, beatmap_ruleset.hitObjects.length / 1500));
	if (real_score <= 500000) {
		strain_value = 0;
	} else if (real_score <= 600000) {
		strain_value *= ((real_score - 500000) / 100000) * 0.3;
	} else if (real_score <= 700000) {
		strain_value *= 0.3 + ((real_score - 600000) / 100000) * 0.25;
	} else if (real_score <= 800000) {
		strain_value *= 0.55 + ((real_score - 700000) / 100000) * 0.2;
	} else if (real_score <= 900000) {
		strain_value *= 0.75 + ((real_score - 800000) / 100000) * 0.15;
	} else {
		strain_value *= 0.9 + ((real_score - 900000) / 100000) * 0.1;
	}

	let acc_value =
		Math.max(0, 0.2 - (hit300_window - 34) * 0.006667) *
		strain_value *
		(Math.max(0, real_score - 960000) / 40000) ** 1.1;

	let pp_multiplier = 0.8;
	if (DifficultyAttributes.mods.acronyms.includes("NF")) pp_multiplier *= 0.9;
	if (DifficultyAttributes.mods.acronyms.includes("EZ")) pp_multiplier *= 0.5;

	const pp =
		(strain_value ** 1.1 + acc_value ** 1.1) ** (1 / 1.1) * pp_multiplier;

	results.push({
		score: score.score,
		pp: Math.round(pp),
		beatmap: beatmap_ruleset,
		att: DifficultyAttributes,
	});

	return results;
};
