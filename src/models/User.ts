import mongoose, { Schema, Document } from "mongoose";
export interface Message extends Document {
    content: string;
    createAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createAt: { type: Date, required: true, default: Date.now },
});


export interface User extends Document {
  username: string;
  email: string;
  password: string;
  VCode: string;
  VCodeExpiration: Date;
  isVerified: boolean;
  isExcepting: boolean;
  messages: Message[];
}


const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Name is required"], trim: true, unique: true },
    email: { type: String, required: [true, "Email is required"], unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"] },
    password: { type: String, required: [true, "Password is required"] },
    VCode: { type: String, required: [true, "VCode is required"] },
    VCodeExpiration: { type: Date, required: [true, "VCodeExpiration is required"] },
    isVerified: { type: Boolean, default: false, required: [true, "isVerified is required"] },
    isExcepting: { type: Boolean, default: true, required: [true, "isExcepting is required"] },
    messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;