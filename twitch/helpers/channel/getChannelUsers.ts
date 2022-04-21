import axios from "axios";

export default async (channel: string) => {
	const u = await axios(
		`https://tmi.twitch.tv/group/user/${channel}/chatters`
	);

	return u.data;
};
