import mongoose, { Types } from "mongoose";
import userModel, { IUser } from "../models/userModel";

export const createuser = async (data: Partial<IUser>): Promise<IUser> => {
    const newUser = new userModel(data);
     await newUser.save();
     return newUser
};

export const updateUserVote = async (userId: string, candidateId: string): Promise<IUser | null> => {
    const user = await userModel.findById(userId);
    if (!user) {
        return null;
    }
    user.hasVoted = true;
    user.votedFor = new mongoose.Types.ObjectId(candidateId);    
    await user.save();
    return user;
};

export const removeVoteFromUser = async (userId: string): Promise<IUser | null> => {
    const user = await userModel.findById(userId);
    if (!user) {
        return null;
    }
    user.hasVoted = false;
    user.votedFor = null;    
    await user.save();
    return user;
};