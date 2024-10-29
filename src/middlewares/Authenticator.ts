import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

type AuthenticationData = { id: string };

dotenv.config()

export const generateToken = (input: AuthenticationData): string => {
    return jwt.sign(
        input,
        String(process.env.JWT_KEY),
        { expiresIn: '1d' }
    );
};

export const getTokenData = (token: string): AuthenticationData | null => {
    try {
        const { id } = jwt.verify(token, String(process.env.JWT_KEY)) as AuthenticationData;
        return { id };
    } catch (error) {
        return null;
    }
};
