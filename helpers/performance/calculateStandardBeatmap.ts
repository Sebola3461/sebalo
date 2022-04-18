import { Beatmap } from "../../types/beatmap";
import axios from "axios";
import { BeatmapDecoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { ScoreInfo, BeatmapInfo } from "osu-classes";
import Accuracy from "./Accuracy";

export default async (
	beatmap: Beatmap,
	mods?: string,
	params?: {
		n300: number;
		n100: number;
		n50: number;
		n0: number;
	}
) => {
	const osu_file = await axios(`https://osu.ppy.sh/osu/${beatmap.id}`);

	mods = mods ? mods : "NM";

	const decoder = new BeatmapDecoder();
	const ruleset = new StandardRuleset();
	const parsed: any = decoder.decodeFromString(osu_file.data);

	const mods_combination = ruleset.createModCombination(mods);
	const beatmap_ruleset = ruleset.applyToBeatmapWithMods(
		parsed,
		mods_combination
	);

	const Calculator = ruleset.createDifficultyCalculator(beatmap_ruleset);

	const DifficultyAttributes = Calculator.calculateWithMods(mods_combination);

	const accuracies = [100, 99.5, 99, 98, 95];
	const results: any[] = [];

	console.log(beatmap_ruleset.difficulty.overallDifficulty);

	accuracies.forEach((acc) => {
		const score = new ScoreInfo();
		score.beatmap = parsed;
		score.mods = mods_combination;
		score.maxCombo = DifficultyAttributes.maxCombo;

		if (params) {
			score.statistics.great = params.n300;
			score.statistics.ok = params.n100;
			score.statistics.meh = params.n50;
			score.statistics.miss = params.n0;
		} else {
			const hits = new Accuracy({
				nobjects: parsed.hitObjects.length,
				percent: acc,
			});

			score.statistics.great = hits.n300;
			score.statistics.ok = hits.n100;
			score.statistics.meh = hits.n50;
			score.statistics.miss = 0;
		}

		score.accuracy =
			(score.statistics.great +
				score.statistics.ok / 3 +
				score.statistics.meh / 6) /
			(score.statistics.great +
				score.statistics.ok +
				score.statistics.meh +
				score.statistics.miss);

		const performanceCalculator = ruleset.createPerformanceCalculator(
			DifficultyAttributes,
			score
		);

		const totalPerformance = performanceCalculator.calculate();

		results.push({
			acc: acc,
			pp: Math.round(totalPerformance),
			att: DifficultyAttributes,
		});
	});

	return results;
};
