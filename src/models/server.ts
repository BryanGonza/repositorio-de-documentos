import express, { Application } from "express";
import cors from "cors";

//1.Importar correctamente
import rUser from "../routes/ms_usuarios";
import rParam from "../routes/parametros";
import rPermisos from '../routes/permisos';
import rRoles from '../routes/roles';

import { ms_usuarios } from "./ms_usuarios";
import { parametros } from "./parametros";
import { permisos } from './permisos';
import { ms_roles } from './roles';

import sequelize from "../database/conexion";
class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.Port || "3016";
    this.middlewares();
    this.router();
    this.DBconex();
    this.listen();
  }
  router() {
    //2. Use correctamente

    this.app.use(rUser);
    this.app.use(rParam);
    this.app.use(rPermisos);
    this.app.use(rRoles);
  }

  middlewares() {
    // Configurar CORS para aceptar solicitudes desde http://localhost:4200
    this.app.use(
      cors({
        origin: "http://localhost:4200",
      })
    );

    // Permitir que el servidor entienda el JSON
    this.app.use(express.json());
  }
  
  listen() {
    this.app.listen(this.port, () => {
      console.log("Se esta jecutando; " + this.port);
    });
  }

  async DBconex() {
    try {
      //3.Agregar await
      //await sequelize.authenticate();
      await ms_usuarios.sync();
      await parametros.sync();
      await permisos.sync();
      await ms_roles.sync();


      console.log("Conectado ;)");
    } catch (error) {
      console.log("Error de conexion: ", error);
    }
  }
}

export default Server;
