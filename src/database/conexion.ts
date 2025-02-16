const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "repositorio_documentos",
  "root",
  "contrasena123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;
