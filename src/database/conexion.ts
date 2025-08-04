const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "repositorio_documentos2_0",
  "root",

  "contrasena123",

  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;

