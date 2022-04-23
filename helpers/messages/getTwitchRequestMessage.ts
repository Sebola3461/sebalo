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

	let pps: any = {
		pp100: "",
		"pp99.5": "",
		pp99: "",
		pp98: "",
		pp95: "",
	};

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
				console.log(p.acc);

				if (map_mode != "mania") {
					pps[`pp${p.acc}`] = `${p.acc}%: ${p.pp}`;
				} else {
					const accs = ["1mi", "950k", "900k", "800k", "700k"];

					pps[`pp${accs[i]}`] = `${accs[i]}: ${p.pp}pp`;
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

	return {
		pps: pps,
		metadata: metadata,
		att: performance[0].att,
		extras: extras,
	};
};
