import { Request, Response } from "express";
import {AuthService} from "../services/auth_service";
import {User} from "../models/user_model";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { fullName, birthDate, email, password, isAdmin } = req.body;

            if (!fullName || !birthDate || !email || !password) {
                return res.status(400).json({ message: "Заполните все поля" });
            }

            const user = await authService.registerUser(
                fullName,
                new Date(birthDate),
                email,
                password,
                isAdmin
            );
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message});
            } else {
                res.status(500).json({message: "Не знаю что за ошибка"});
            }
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Нужны почта с паролем" });
            }

            const { token, user } = await authService.loginUser(email, password);
            res.json({
                token,
                user,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Не знаю что за ошибка" });
            }
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message});
            } else {
                res.status(500).json({message: "Не знаю что за ошибка"});
            }
        }
    }
    async getById(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);

            if (isNaN(userId)) {
                return res.status(400).json({ message: "Нет такого id" });
            }

            const requestingUser = (req as any).user as User;
            const user = await authService.getUserById(userId, requestingUser);
            res.json(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message});
            } else {
                res.status(500).json({message: "Не знаю что за ошибка"});
            }
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const requestingUser = (req as any).user as User;
            const users = await authService.getAllUsers(requestingUser);
            res.json(users);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(403).json({ message: error.message });
            }
            else {
                res.status(500).json({message: "Не знаю что за ошибка"});
            }
        }
    }
    async block(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);

            if (isNaN(userId)) {
                return res.status(400).json({ message: "Нет такого id" });
            }

            const requestingUser = (req as any).user as User;
            const updatedUser = await authService.block(userId, requestingUser);

            res.json({
                message: `Пользователь ${updatedUser.isActive ? 'Не в блоке' : 'В блоке'}, ура`,
                user: updatedUser
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(403).json({message: error.message});
            } else {
                res.status(500).json({message: "Не знаю что за ошибка"});
            }
        }
    }
}