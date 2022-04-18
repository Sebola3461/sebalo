import { User } from "../../types/user";

export default (user: User) => {
	if (user.statistics === null) return 1.0;

	if (
		user.statistics !== null &&
		(user.statistics?.ranked_score ? user.statistics?.ranked_score : 0) > 0
	) {
		return Math.pow(user.statistics?.ranked_score || 0, 0.4) * 0.195;
	}

	return 1.0;
};
