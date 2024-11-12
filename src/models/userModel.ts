import mongoose, { Schema, Document, Types } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    _id: string;
    userName: string;
    password: string;
    isAdmin: boolean;
    hasVoted: boolean;
    comparePassword(userPassword: string): Promise<boolean>;
    votedFor: Types.ObjectId | null;
}

const UserSchema = new Schema<IUser>({
    userName: {
        type: String,
        unique: true,
        required: [true, "UserName is required"],

    },
    password:
    {
        type: String,
        required: [true, "Password is required"],
        

    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
    votedFor: { type: Schema.Types.ObjectId, ref: "candidates" }
}
);

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password)
};

UserSchema.index({ userName: 1 });

export default mongoose.model<IUser>("users", UserSchema)
