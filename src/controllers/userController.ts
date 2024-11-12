import { Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import { createuser } from "../services/userService";
import { generateToken } from "../utils/token";

export const registerUser = async (req: Request, res: Response) => {

    const { userName, password, isAdmin } = req.body;
    try {
        const userExist = await userModel.findOne({ userName });
        if (userExist) {
            res.status(401).json({ message: "User already exist" });
        }
        const newUser = await createuser({ userName, password, isAdmin });
        res.status(201).json({ message: "User registered successfully" });
        return

    } catch (error) {
        res.status(400).json("Error registering user")

    }
};
// not mandatory
export const getUsers = async (req: Request, res: Response) => {
    
    try {
        const usersList = await userModel.find();
        res.status(200).json(usersList);
    } catch (error) {
        console.log(error);
        res.status(400).json("Error getting users");
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        res.status(400).json({ message: "UserName and password are required" });
        return
    }

    const user = await userModel.findOne({ userName });
    if (user) {
        if (!(await user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid email or password" });

        }

        const token = generateToken(user._id, user.isAdmin);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        })
        res.status(200).json({ message: "logged in successfully" , user ,token });
        return
    }
};