const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "repositorio_documentos2_0",
  "root",
  "Daesnige959510.",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;


