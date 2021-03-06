import axios from "axios";
import {
	Beatmap,
	BeatmapResponse,
	BeatmapsetResponse,
} from "../../types/beatmap";

export default async (
	beatmap_id: string | number
): Promise<BeatmapResponse> => {
	try {
		const stringified_id = String(beatmap_id);

		const request = await axios(
			"https://osu.ppy.sh/api/v2/beatmaps/".concat(stringified_id),
			{
				headers: {
					authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`,
				},
			}
		);

		return {
			status: request.status,
			data: request.data,
		};
	} catch (e) {
		console.log(e);

		return {
			status: 500,
		};
	}
};

export async function fetchBeatmapset(
	beatmapset_id: string | number
): Promise<BeatmapsetResponse> {
	try {
		const stringified_id = String(beatmapset_id);

		const request = await axios(
			"https://osu.ppy.sh/api/v2/beatmapsets/".concat(stringified_id),
			{
				headers: {
					authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`,
				},
			}
		);

		return {
			status: request.status,
			data: request.data,
		};
	} catch (e) {
		console.log(e);

		return {
			status: 500,
		};
	}
}
