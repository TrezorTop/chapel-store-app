import * as mongoose from "mongoose";


export default async function mongoConnect() {
	let mongoUri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/main";

	await mongoose.connect(mongoUri, {
		authSource: "admin",
		user: process.env.MONGO_USERNAME,
		pass: process.env.MONGO_PASSWORD,
	});
}