import { StandardDifficultyAttributes } from "osu-standard-stable";

export default (att: StandardDifficultyAttributes) => {
	return `OD: ${att.overallDifficulty.toFixed(
		1
	)} AR: ${att.approachRate.toFixed(1)}  |  `;
};

export function calculateCTBExtras(od: number, ar: number) {
	return `OD: ${(od + 40 / (od * 100)).toFixed(1)} AR: ${(
		ar +
		40 / (ar * 100)
	).toFixed(1)}  |  `;
}
