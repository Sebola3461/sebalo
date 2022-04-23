import axios from "axios";

export default async (channel: string) => {
	try {
		const u = await axios(
			`https://tmi.twitch.tv/group/user/${channel}/chatters`
		);

		return u.data;
	} catch (e) {
		return {
			_links: {},
			chatter_count: 1,
			chatters: {
				broadcaster: [channel],
				vips: [],
				moderators: [],
				staff: [],
				admins: [],
				global_mods: [],
				viewers: [],
			},
		};
	}
};
