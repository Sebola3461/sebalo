// import { GameModeName } from "../../types/game_mode";
// import calculateRecommendedDifficulty from "../performance/calculateRecommendedDifficulty";
// import fetchUser, { fetchUserScores } from "./fetchUser";

// export default async (stats: {
// 	user_id: number;
// 	mode: number;
// 	stars: number;
// 	mods: string;
// }) => {
// 	const gameModes: GameModeName[] = ["osu", "taiko", "fruits", "mania"];

// 	const user_data = await fetchUser(stats.user_id);

// 	if (!user_data.data) return;

// 	const default_mode = user_data.data.playmode;
// 	let requested_mode: GameModeName = default_mode;

// 	if (stats.mode > -1) {
// 		requested_mode =
// 			gameModes[gameModes.findIndex((m) => m == default_mode)];
// 	}

// 	const user_scores = await fetchUserScores(
// 		stats.user_id,
// 		"best",
// 		requested_mode
// 	);

// 	if (user_scores.data.length < 10) return;

// 	const stars =
// 		stats.stars < 0
// 			? calculateRecommendedDifficulty(user_data.data)
// 			: stats.stars;

// 	// ? Scores with this sr
// 	const sr_scores = user_scores.data.filter((s) => {
// 		return (s.beatmap?.difficulty_rating || 0) <= stars + 0.1;
// 	});

// 	sr_scores.sort(
// 		(a, b) =>
// 			(a.beatmap?.difficulty_rating || 0) -
// 			(b.beatmap?.difficulty_rating || 0)
// 	);

// 	function getLength() {
// 		let all_length = 0;

// 		sr_scores.forEach((score) => {
// 			all_length += score.beatmap?.total_length || 0;
// 		});

// 		return all_length / sr_scores.length;
// 	}

// 	// ? A calc to get the percentage of the scores with this sr
// 	const sr_length = getLength();
// };

export default () => {};
