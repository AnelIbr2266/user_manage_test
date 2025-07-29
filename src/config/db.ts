import { DataSource } from "typeorm";
import {User} from "../models/user_model";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "user",
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});