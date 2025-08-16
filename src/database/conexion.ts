const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "repositorio_documentos2_0", // nombre de la base
  "usuario_app",               // usuario que me diste
  "contrasena123",             // contraseña del usuario
  {
    host: "127.0.0.1",         // usar 127.0.0.1 en lugar de localhost
    dialect: "mysql",
  }
);

export default sequelize;
