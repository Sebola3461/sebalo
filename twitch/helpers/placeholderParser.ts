export default (raw: string, values: any) => {
	let string = raw;

	raw.split(" ").forEach((arg) => {
		Object.keys(values).forEach((placeholder) => {
			string = string.replace(
				values[placeholder].regex,
				values[placeholder].text
			);
		});
	});

	return string;
};
