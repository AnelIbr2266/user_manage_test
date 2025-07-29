import { Request, Response, NextFunction } from "express";
import {AuthService} from "../services/auth_service";

const authService = new AuthService();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Нужен токен, а его нет(" });
        }

        const user = await authService.validateToken(token);
        if (!user) {
            return res.status(401).json({ message: "Не тот токен" });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Не авторизован" });
    }
};