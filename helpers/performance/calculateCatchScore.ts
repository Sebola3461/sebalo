import { Beatmap } from "../../types/beatmap";
import axios from "axios";
import { BeatmapDecoder } from "osu-parsers";
import { TaikoRuleset } from "osu-taiko-stable";
import { ScoreInfo, BeatmapInfo } from "osu-classes";
import Accuracy from "./Accuracy";
import { Score } from "../../types/score";
import { CatchRuleset } from "osu-catch-stable";

export default async (beatmap: string, score: Score) => {
	const osu_file = await axios(`https://osu.ppy.sh/osu/${beatmap}`);

	const decoder = new BeatmapDecoder();
	const ruleset = new CatchRuleset();
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

	const _score = new ScoreInfo();
	_score.beatmap = parsed;
	_score.mods = mods_combination;
	_score.maxCombo = DifficultyAttributes.maxCombo;

	_score.count300 = score.statistics.count_300;
	_score.count100 = score.statistics.count_100;
	_score.count50 = 0;
	_score.countMiss = score.statistics.count_miss;

	_score.accuracy =
		(_score.count300 + _score.count100 / 2) /
		(_score.count300 + _score.count100 + _score.countMiss);

	const performanceCalculator = ruleset.createPerformanceCalculator(
		DifficultyAttributes,
		_score
	);

	const totalPerformance = performanceCalculator.calculate();

	results.push({
		acc: score.accuracy,
		pp: Math.round(totalPerformance),
		beatmap: beatmap_ruleset,
		att: DifficultyAttributes,
	});

	return results;
};
