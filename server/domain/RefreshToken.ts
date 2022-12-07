import { model, Schema, Types } from "mongoose";
import User from "./User";


export type RefreshTokenType = {
	token: string,
	ownerId: Types.ObjectId
}

const refreshSchema = new Schema<RefreshTokenType>({
	token: { type: String },
	ownerId: { type: Schema.Types.ObjectId, ref: User }
});

export default model<RefreshTokenType>("RefreshToken", refreshSchema);