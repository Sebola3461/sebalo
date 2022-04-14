export default (message: string) => {
	const game_mods: any = {
		"+Hidden": "HD",
		"+DoubleTime": "DT",
		"+Nightcore": "NC",
		"+HardRock": "HR",
		"+Flashlight": "FL",
		"-Easy": "EZ",
		"-NoFail": "NF",
		"-HalfTime": "HT",
	};

	let mods = "";

	Object.keys(game_mods).forEach((mod) => {
		if (message.includes(mod)) mods = mods.concat(game_mods[mod]);
	});

	if (mods == "") return "NM";

	return mods;
};
