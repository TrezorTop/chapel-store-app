import { model, Schema } from "mongoose";


export type UserType = {
	username: string;
	passwordHash: string,
}

const userSchema = new Schema<UserType>({
	username: { type: String },
	passwordHash: { type: String },
});

export default model<UserType>("User", userSchema);