import jwt from 'jsonwebtoken';

// Generate a JWT token
export const generateToken = (userId: string, isAdmin: boolean): string => {
    return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
}
