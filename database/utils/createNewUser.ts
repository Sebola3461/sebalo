import * as database from "./../";

export default async function createNewUser(user_data: any) {
	console.log("createNewUser", "Creating a new user.");

	const u = new database.users({
		_id: user_data.id,
	});

	await u.save();

	const r = await database.users.findOne({ _id: u.id });

	console.log("createNewUser", `User ${u.id} created!`);

	return r;
}
