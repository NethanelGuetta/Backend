import mongoose, { Schema } from "mongoose";

export interface ICandidate extends Document {
    name: string;
    image: string;
    votes: number;
}    

const CandidateSchema = new Schema<ICandidate>({
    name: String,
    image: String,
    votes: { type: Number, default: 0, min: 0 } 
});

export default mongoose.model<ICandidate>("candidates", CandidateSchema);