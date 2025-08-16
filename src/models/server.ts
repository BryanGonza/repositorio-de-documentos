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



import reporteDocumentosRoutes from '../routes/Reporte';

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
private readonly allowedOrigins: string[] = [
    "http://localhost:4200",
    `http://${process.env.PUBLIC_IP || "3.18.215.239"}:4200`,
    process.env.FRONTEND_URL || "https://tu-dominio.com",
  ];
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.middlewares();
    this.router();
    this.DBconex();
    this.listen();
    
  }
   private middlewares() {
    // Confía en proxy si usas Nginx/ALB
    this.app.set("trust proxy", 1);

    // CORS con lista blanca + permitir curl/Postman (sin origin)
    this.app.use(
      cors({
        origin: (origin, cb) => {
          if (!origin) return cb(null, true); // Postman/curl
          if (this.allowedOrigins.includes(origin)) return cb(null, true);
          return cb(new Error("CORS no permitido"), false);
        },
        credentials: true,
      })
    );

    // JSON (subir límite si mandas payloads grandes)
    this.app.use(express.json({ limit: "10mb" }));
    // Si recibís formularios:
    // this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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
    


    this.app.use(reporteDocumentosRoutes);


  }


    private listen() {
    const HOST = process.env.HOST || "0.0.0.0";
    this.app.listen(this.port, HOST, () => {
      console.log(`Se está ejecutando en http://${HOST}:${this.port}`);
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
