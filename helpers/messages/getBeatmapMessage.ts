import { Beatmap } from "../../types/beatmap";
import calculateCatchBeatmap from "../performance/calculateCatchBeatmap";
import calculateManiaBeatmap from "../performance/calculateManiaBeatmap";
import calculateStandardBeatmap from "../performance/calculateStandardBeatmap";
import calculateTaikoBeatmap from "../performance/calculateTaikoBeatmap";
import calculateExtras, {
	calculateCTBExtras,
	calculateManiaExtras,
	calculateTaikoExtras,
} from "./calculateExtras";

export default async (beatmap: Beatmap, mods: string, with_url?: boolean) => {
	let performance: any[] = [];

	let pps = "";

	const map_mode = beatmap.mode ? beatmap.mode : "osu";

	switch (map_mode) {
		case "osu": {
			performance = await calculateStandardBeatmap(beatmap, mods);

			calculatePerformance();
			break;
		}
		case "taiko": {
			performance = await calculateTaikoBeatmap(beatmap, mods);

			calculatePerformance();

			break;
		}

		case "fruits": {
			performance = await calculateCatchBeatmap(beatmap, mods);

			calculatePerformance();

			break;
		}

		case "mania": {
			performance = await calculateManiaBeatmap(beatmap, mods);

			calculatePerformance();

			break;
		}
	}

	function calculatePerformance() {
		performance.forEach(
			(p: { acc?: number; score?: number; pp: number }, i) => {
				if (map_mode != "mania") {
					pps = pps.concat(
						`${p.acc}%: ${p.pp}pp ${i < 4 ? "•" : ""} `
					);
				} else {
					const scores = ["1mi", "900k", "800k", "700k"];
					pps = pps.concat(
						`${scores[i]}: ${p.pp}pp ${i < 3 ? "•" : ""} `
					);
				}
			}
		);
	}

	let extras = "";

	switch (beatmap.mode) {
		case "osu": {
			extras = calculateExtras(performance[0].att);
			break;
		}
		case "taiko": {
			extras = calculateTaikoExtras(
				performance[0].beatmap,
				performance[0].att
			);
			break;
		}
		case "fruits": {
			extras = calculateCTBExtras(performance[0].beatmap);
			break;
		}
		case "mania": {
			extras = calculateManiaExtras(performance[0].beatmap);
			break;
		}
	}

	const metadata = with_url
		? `[https://osu.ppy.sh/b/${beatmap.id} ${beatmap.beatmapset?.artist} - ${beatmap.beatmapset?.title} [${beatmap.version}]]`
		: `${beatmap.beatmapset?.artist} - ${beatmap.beatmapset?.title} [${beatmap.version}]`;

	return `${metadata} (${
		mods == "NM"
			? beatmap.difficulty_rating.toFixed(2)
			: performance[0].att.starRating.toFixed(2)
	}★${mods == "NM" ? "" : ` +${mods}`})  |  ${extras}  |  ${pps}`;
};
