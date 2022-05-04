export default (level: any) => {
	const cache = level;
	const res: any[] = [];

	cache.sort((a: { xp: number }, b: { xp: number }) => b.xp - a.xp);

	cache.forEach((l: any) => {
		if (res.find((level: any) => level.user_id == l.user_id) != undefined)
			return;

		res.push(l);
	});

	return res;
};
