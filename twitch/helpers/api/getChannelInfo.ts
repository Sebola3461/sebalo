import axios from "axios";

export default async (channel: string) => {
	try {
		if (!process.env.twitch_token) return {};

		const channel_data = await axios(
			`https://api.twitch.tv/helix/users?login=${channel}`,
			{
				headers: {
					"client-id": process.env.TWITCH_CLIENT_ID || "",
					authorization: `Bearer ${process.env.twitch_token}`,
				},
			}
		);

		return {
			status: 200,
			data: {
				id: channel_data.data.data[0].id,
				login: channel_data.data.data[0].login,
				display_name: channel_data.data.data[0].display_name,
				avatar: channel_data.data.data[0].profile_image_url,
				offline_cover: channel_data.data.data[0].offline_image_url,
			},
		};
	} catch (e) {
		return {
			status: 500,
			data: {},
		};
	}
};
