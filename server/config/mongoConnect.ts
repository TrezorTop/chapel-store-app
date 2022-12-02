import * as mongoose from "mongoose";


export default async function mongoConnect() {
	if (process.env.MONGODB_URI)
		await mongoose.connect(process.env.MONGODB_URI);
	else
		await mongoose.connect("mongodb://localhost:27017/main", {
			authSource: "admin",
			user: process.env.MONGO_USERNAME,
			pass: process.env.MONGO_PASSWORD,
		});
}