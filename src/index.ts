import Server from "./models/server";
import dotenv from "dotenv";
const server = new Server();
dotenv.config();
import sequelize from "./database/conexion";
