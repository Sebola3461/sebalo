export default (modes: number[]) => {
	const _modes = ["osu", "taiko", "fruits", "mania"];

	let string: string[] = [];

	modes.forEach((mode) => {
		string.push(_modes[mode]);
	});

	return string.join(",");
};
