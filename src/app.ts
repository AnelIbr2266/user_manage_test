import express from "express";
import "reflect-metadata";
import {AppDataSource} from "./config/db";
import authRoutes from "./routes/user_routes";
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

AppDataSource.initialize()
    .then(() => console.log("Бд подключена"))
    .catch((error) => console.log(error));

app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Порт: ${PORT}`);
});