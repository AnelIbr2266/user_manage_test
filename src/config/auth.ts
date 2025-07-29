import * as dotenv from 'dotenv';
dotenv.config();

interface AuthConfig {
    jwt: {
        secret: string;
        expiresIn: string;
    };
}

export const authConfig: AuthConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
};