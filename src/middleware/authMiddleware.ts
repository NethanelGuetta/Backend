import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string, isAdmin: boolean };
};

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        const docoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
            isAdmin: boolean;
        };
        req.user = docoded;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ message: "You are not authorized to perform this action" });
    }
    else {
        next();
    }
};