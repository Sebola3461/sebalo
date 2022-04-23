import { CatchBeatmap } from "osu-catch-stable";
import { ManiaBeatmap, ManiaDifficultyAttributes } from "osu-mania-stable";
import { StandardDifficultyAttributes } from "osu-standard-stable";
import { TaikoBeatmap, TaikoDifficultyAttributes } from "osu-taiko-stable";

export default (att: StandardDifficultyAttributes) => {
	return `OD: ${att.overallDifficulty.toFixed(
		1
	)} AR: ${att.approachRate.toFixed(1)} Aim: ${att.aimStrain.toFixed(
		2
	)} Stamina: ${att.speedStrain.toFixed(2)}`;
};

export function calculateCTBExtras(beatmap: CatchBeatmap) {
	return `OD: ${beatmap.difficulty.overallDifficulty.toFixed(
		1
	)} AR: ${beatmap.difficulty.approachRate.toFixed(1)}`;
}

export function calculateTaikoExtras(
	beatmap: TaikoBeatmap,
	att: TaikoDifficultyAttributes
) {
	return `OD: ${beatmap.difficulty.overallDifficulty.toFixed(
		1
	)} Stamina: ${att.staminaStrain.toFixed(
		1
	)} Colour Strain: ${att.colourStrain.toFixed(1)}`;
}

export function calculateManiaExtras(beatmap: ManiaBeatmap) {
	return `OD: ${beatmap.difficulty.overallDifficulty.toFixed(1)}`;
}
