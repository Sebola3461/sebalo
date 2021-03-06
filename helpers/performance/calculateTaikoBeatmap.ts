import { Beatmap } from "../../types/beatmap";
import axios from "axios";
import { BeatmapDecoder } from "osu-parsers";
import { TaikoRuleset } from "osu-taiko-stable";
import { ScoreInfo, BeatmapInfo } from "osu-classes";
import Accuracy from "./Accuracy";

export default async (beatmap: Beatmap, mods?: string, accs?: number[]) => {
	const osu_file = await axios(`https://osu.ppy.sh/osu/${beatmap.id}`);

	mods = mods ? mods : "NM";

	const decoder = new BeatmapDecoder();
	const ruleset = new TaikoRuleset();
	const parsed: any = decoder.decodeFromString(osu_file.data);

	const mods_combination = ruleset.createModCombination(mods);
	const beatmap_ruleset = ruleset.applyToBeatmapWithMods(
		parsed,
		mods_combination
	);

	const Calculator = ruleset.createDifficultyCalculator(beatmap_ruleset);

	const DifficultyAttributes = Calculator.calculateWithMods(mods_combination);

	const accuracies = accs ? accs : [100, 99.5, 99, 98, 95];
	const results: any[] = [];

	accuracies.forEach((acc) => {
		const score = new ScoreInfo();
		score.beatmap = parsed;
		score.mods = mods_combination;
		score.maxCombo = DifficultyAttributes.maxCombo;

		const hits = new Accuracy({
			nobjects: parsed.hitObjects.length,
			percent: acc,
		});

		score.count300 = hits.n300;
		score.count100 = hits.n100;
		score.countMiss = 0;

		score.accuracy =
			(score.count300 + score.count100 / 2) /
			(score.count300 + score.count100 + score.countMiss);

		const performanceCalculator = ruleset.createPerformanceCalculator(
			DifficultyAttributes,
			score
		);

		const totalPerformance = performanceCalculator.calculate();

		results.push({
			acc: acc,
			pp: Math.round(totalPerformance),
			beatmap: beatmap_ruleset,
			att: DifficultyAttributes,
		});
	});

	return results;
};
