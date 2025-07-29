import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullName!: string;

    @Column()
    birthDate!: Date;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: "varchar",
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({ default: true })
    isActive!: boolean;
}