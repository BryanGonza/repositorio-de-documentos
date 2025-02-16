"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("repositorio_documentos", "root", "contrasena123", {
    host: "localhost",
    dialect: "mysql",
});
exports.default = sequelize;
