export default (args: string[]) => {
	const params: { name: string; value: string }[] = [];

	let _args = args.join(",").split(",");

	args.forEach((arg, i) => {
		console.log(arg);
		if (arg.startsWith("-")) {
			params.push({ name: arg.slice(1), value: args[i + 1] });

			_args.splice(i, 2);
		}
	});

	return {
		params: params,
		args: _args,
	};
};
