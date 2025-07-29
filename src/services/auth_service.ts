import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {AppDataSource} from "../config/db";
import {User, UserRole} from "../models/user_model";
import {authConfig} from "../config/auth";

export class AuthService {
    async registerUser(
        fullName: string,
        birthDate: Date,
        email: string,
        password: string,
        isAdmin: boolean = false
    ): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Такой пользователь уже есть");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.fullName = fullName;
        user.birthDate = birthDate;
        user.email = email;
        user.password = hashedPassword;
        user.role = isAdmin ? UserRole.ADMIN : UserRole.USER;
        user.isActive = true;

        return await userRepository.save(user);
    }
    async loginUser(email: string, password: string): Promise<{ token: string; user: Omit<User, "password"> }> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error("Пользователь не найден");
        }

        if (!user.isActive) {
            throw new Error("Вы в блоке");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Пароль не тот");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            } as object,
            authConfig.jwt.secret as jwt.Secret,
            {
                expiresIn: authConfig.jwt.expiresIn as string | number
            } as jwt.SignOptions
        );

        const { password: _, ...userWithoutPassword } = user;

        return { token, user: userWithoutPassword };
    }

    async validateToken(token: string): Promise<User | null> {
        try {
            const decoded = jwt.verify(token, authConfig.jwt.secret) as jwt.JwtPayload;
            const userRepository = AppDataSource.getRepository(User);
            return await userRepository.findOneBy({ id: decoded.id });
        } catch (error) {
            return null;
        }
    }
    async getUserById(id: number, requestingUser: User): Promise<User> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            throw new Error("Пользователь не найден");
        }
        if (requestingUser.role !== UserRole.ADMIN && requestingUser.id !== user.id) {
            throw new Error("Доступ запрещен");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }
    async getAllUsers(requestingUser: User): Promise<Omit<User, "password">[]> {
        if (requestingUser.role !== UserRole.ADMIN) {
            throw new Error("Недостаточно прав");
        }

        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();

        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    async block(
        userId: number,
        requestingUser: User
    ): Promise<Omit<User, "password">> {
        const userRepository = AppDataSource.getRepository(User);
        const userToBlock = await userRepository.findOne({ where: { id: userId } });

        if (!userToBlock) {
            throw new Error("Пользователь не найден");
        }

        const isSelfBlock = requestingUser.id === userToBlock.id;
        const isAdmin = requestingUser.role === UserRole.ADMIN;

        if (!isAdmin && !isSelfBlock) {
            throw new Error("Вы можете заблокировать только себя");
        }

        if (isAdmin && isSelfBlock) {
            throw new Error("Админ не может блокировать себя");
        }

        userToBlock.isActive = !userToBlock.isActive;
        await userRepository.save(userToBlock);
        const { password, ...userWithoutPassword } = userToBlock;
        return userWithoutPassword as User;
    }
}