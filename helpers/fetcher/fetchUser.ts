import axios from "axios";
import { GameModeName } from "../../types/game_mode";
import { ScoreResponse } from "../../types/score";
import { UserResponse } from "../../types/user";

export async function fetchUserScores(
	user_id: string | number,
	type: "best" | "first" | "recent",
	fails: 0 | 1,
	mode?: string | undefined
): Promise<ScoreResponse> {
	try {
		const stringified_id = String(user_id);

		const request = await axios(
			`https://osu.ppy.sh/api/v2/users/${stringified_id}/scores/${type}?limit=100&include_fails=${fails}${
				mode ? `&mode=${mode}` : ""
			}`,
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
			data: [],
		};
	}
}

export default async (
	user_id: string | number,
	mode?: GameModeName
): Promise<UserResponse> => {
	try {
		const stringified_id = String(user_id);

		const request = await axios(
			`https://osu.ppy.sh/api/v2/users/${stringified_id}/${
				mode ? `${mode}` : ""
			}`,
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
