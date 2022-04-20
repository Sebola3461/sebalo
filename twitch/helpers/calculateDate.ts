export default (date1: Date, date2: Date) => {
	const startDate = new Date(date1);

	const endDate = new Date(date2);
	return (endDate.getTime() - startDate.getTime()) / 1000;
};
