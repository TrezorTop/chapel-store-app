import { model, Schema } from "mongoose";


export type UserType = {
	username: string;
	passwordHash: string,
}

const userSchema = new Schema<UserType>({
	username: { type: String, required: true },
	passwordHash: { type: String, required: true },
});

export default model<UserType>("User", userSchema);