import { Request, Response } from "express";
import candidateModel, { ICandidate } from "../models/candidate";
import { AuthRequest } from "../middleware/authMiddleware";
import { removeVoteFromUser, updateUserVote } from "../services/userService";
import userModel from "../models/userModel";
import { log } from "console";

export const getCandidates = async (req: Request, res: Response) => {
    try {
        const candidatesList = await candidateModel.find();
        res.status(200).json(candidatesList);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error getting candidates");
    }
};

export const voteCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
    const candidateId = req.params.id;
    const userId = req.user?.userId;
    
    let existUser = await userModel.findById(userId);
    if (!existUser) {
        res.status(400).json({ message: "User dont exist" });
    }
    else if (existUser.hasVoted) {
        res.status(400).json({ message: "User already voted" });
    } else {
        try {
            const candidate = await candidateModel.findById(candidateId);
            if (!candidate) {
                res.status(404).json({ message: " Candidate not found" });
            }
            else {
                candidate.votes += 1;
                await candidate.save();
                await updateUserVote(existUser._id, candidateId);
                res.status(200).json({ message: " Voted successfully" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json("Error voting candidate");
        }
    }

};

export const unVoteCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const idToUnVote = req.params.id;
    let existUser = await userModel.findById(userId);
    if (!existUser) {
        res.status(400).json({ message: "User dont exist" });
    }
    else if (!existUser.hasVoted) {
        res.status(400).json({ message: "User not voted" });
    }
    else {
        const candidateId = existUser.votedFor?.toString();
        if (candidateId !== idToUnVote) {
            res.status(400).json({ message: "User not voted for this candidate" });
            
        }
        try {
            const candidate = await candidateModel.findById(candidateId);
            if (!candidate) {
                res.status(404).json({ message: " Candidate not found" });
            }
            else {
                candidate.votes -= 1;
                await candidate.save();
                await removeVoteFromUser(existUser._id);
                res.status(200).json({ message: " UnVoted successfully" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json("Error voting candidate");
        }
    }

};