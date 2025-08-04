import express, { Application } from "express";
import cors from "cors";
import { getParametros } from "../controllers/parametros";
import '../models';
//1.Importar correctamente
//rutas
import rUser from "../routes/ms_usuarios";
import rParam from "../routes/parametros";
import rPermisos from '../routes/permisos';
import rRoles from '../routes/roles';
import rObjeto from '../routes/objetos';
import rEstado from '../routes/estado';
import rDoc from "../routes/dcomentos"
import  rFacultad  from "../routes/facultad";
import  rDepartamentos  from "../routes/departamentos";
import  rClases  from "../routes/clase";
import  rTipoDocumento  from "../routes/tipo_documento";
import  rTipoArchivo  from "../routes/tipo_archivo";
import  rTipoCaracteristica  from "../routes/tipo_caracteristica";
import  rCategotia  from "../routes/categoria";
import rSubCategoria from "../routes/s_categoria";
import rCaracteristica from "../routes/caracteristica"
import  rVersion from "../routes/version";
import  rEstructuraArchivos  from "../routes/estructura_archivos";
import rTipoDocCaracteristica from "../routes/TipoDocumetoCaracteristica";


//Modelos
import {ms_objetos} from './objetos';
import {estado} from './estado';
import { ms_usuarios } from "./ms_usuarios";
import { parametros } from "./parametros";
import { permisos } from './permisos';
import { ms_roles } from './roles';
import { documentos } from "./Documentos/Documentos.model";
import { Facultad } from "./UNAH/facultad"; 
import { departamentos } from "./UNAH/departamentos";
import { clases } from "./UNAH/clase";
import { tipo_documento } from "./Documentos/tipo_documento";
import { tipo_archivo } from "./Documentos/tipo_archivo";
import { tipo_caracteristica } from "./Documentos/tipo_caracteristica";
import { categoria } from "../models/Documentos/categoria";
import { s_categoria } from "../models/Documentos/s_categoria";
import { caracteristica } from "../models/Documentos/caracteristica";
import { version } from "../models/Documentos/version";
import { estructura_archivos } from "../models/Documentos/estructura_archivos";
import { documentoDet } from "./Documentos/docuemtosDet";
import { documentoVersiones } from "./Documentos/docVersion";
import { tipoDocumentoCaracteristica } from "./Documentos/TipoDocCaracteristica";
import {DocumentoCaracteristica} from "./Documentos/DocumetoCaracteristica"



import sequelize from "../database/conexion";
import dotenv from "dotenv"

class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.middlewares();
    this.router();
    this.DBconex();
    this.listen();
    
  }
  
  router() {
    //2. Use correctamente
    this.app.use(rEstado);
    this.app.use(rObjeto);
    this.app.use(rUser);
    this.app.use(rParam);
    this.app.use(rPermisos);
    this.app.use(rRoles);
    this.app.use(rDoc);
    this.app.use(rFacultad);
    this.app.use(rDepartamentos);
    this.app.use(rClases);
    this.app.use(rTipoDocumento);
    this.app.use(rTipoArchivo);
    this.app.use(rTipoCaracteristica);
    this.app.use(rCategotia);
    this.app.use(rSubCategoria);
    this.app.use(rCaracteristica);
    this.app.use(rVersion);
    this.app.use(rEstructuraArchivos);
    this.app.use(rTipoDocCaracteristica);
    


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
      await ms_objetos.sync();
      await ms_usuarios.sync();
      await parametros.sync();
      await permisos.sync();
      await ms_roles.sync();
      await estado.sync();
      await documentos.sync();
      await Facultad.sync();
      await departamentos.sync();
      await clases.sync();
      await tipo_documento.sync();
      await tipo_archivo.sync();
      await tipo_caracteristica.sync();
      await categoria.sync();
      await s_categoria.sync();
      await caracteristica.sync();
      await version.sync();
      await estructura_archivos.sync();
      await documentoDet.sync();
      await documentoVersiones.sync();
      await tipoDocumentoCaracteristica.sync();
      await DocumentoCaracteristica.sync();

   
      console.log("Conectado ;)");
    } catch (error) {
      console.log("Error de conexion: ", error);
    }
    
  }
}

export default Server;
