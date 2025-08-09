"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("../models");
//1.Importar correctamente
//rutas
const ms_usuarios_1 = __importDefault(require("../routes/ms_usuarios"));
const parametros_1 = __importDefault(require("../routes/parametros"));
const permisos_1 = __importDefault(require("../routes/permisos"));
const roles_1 = __importDefault(require("../routes/roles"));
const objetos_1 = __importDefault(require("../routes/objetos"));
const estado_1 = __importDefault(require("../routes/estado"));
const dcomentos_1 = __importDefault(require("../routes/dcomentos"));
const facultad_1 = __importDefault(require("../routes/facultad"));
const departamentos_1 = __importDefault(require("../routes/departamentos"));
const clase_1 = __importDefault(require("../routes/clase"));
const tipo_documento_1 = __importDefault(require("../routes/tipo_documento"));
const tipo_archivo_1 = __importDefault(require("../routes/tipo_archivo"));
const tipo_caracteristica_1 = __importDefault(require("../routes/tipo_caracteristica"));
const categoria_1 = __importDefault(require("../routes/categoria"));
const s_categoria_1 = __importDefault(require("../routes/s_categoria"));
const caracteristica_1 = __importDefault(require("../routes/caracteristica"));
const version_1 = __importDefault(require("../routes/version"));
const estructura_archivos_1 = __importDefault(require("../routes/estructura_archivos"));
const TipoDocumetoCaracteristica_1 = __importDefault(require("../routes/TipoDocumetoCaracteristica"));
const Reporte_1 = __importDefault(require("../routes/Reporte"));
//Modelos
const objetos_2 = require("./objetos");
const estado_2 = require("./estado");
const ms_usuarios_2 = require("./ms_usuarios");
const parametros_2 = require("./parametros");
const permisos_2 = require("./permisos");
const roles_2 = require("./roles");
const Documentos_model_1 = require("./Documentos/Documentos.model");
const facultad_2 = require("./UNAH/facultad");
const departamentos_2 = require("./UNAH/departamentos");
const clase_2 = require("./UNAH/clase");
const tipo_documento_2 = require("./Documentos/tipo_documento");
const tipo_archivo_2 = require("./Documentos/tipo_archivo");
const tipo_caracteristica_2 = require("./Documentos/tipo_caracteristica");
const categoria_2 = require("../models/Documentos/categoria");
const s_categoria_2 = require("../models/Documentos/s_categoria");
const caracteristica_2 = require("../models/Documentos/caracteristica");
const version_2 = require("../models/Documentos/version");
const estructura_archivos_2 = require("../models/Documentos/estructura_archivos");
const docuemtosDet_1 = require("./Documentos/docuemtosDet");
const docVersion_1 = require("./Documentos/docVersion");
const TipoDocCaracteristica_1 = require("./Documentos/TipoDocCaracteristica");
const DocumetoCaracteristica_1 = require("./Documentos/DocumetoCaracteristica");
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.middlewares();
        this.router();
        this.DBconex();
        this.listen();
    }
    router() {
        //2. Use correctamente
        this.app.use(estado_1.default);
        this.app.use(objetos_1.default);
        this.app.use(ms_usuarios_1.default);
        this.app.use(parametros_1.default);
        this.app.use(permisos_1.default);
        this.app.use(roles_1.default);
        this.app.use(dcomentos_1.default);
        this.app.use(facultad_1.default);
        this.app.use(departamentos_1.default);
        this.app.use(clase_1.default);
        this.app.use(tipo_documento_1.default);
        this.app.use(tipo_archivo_1.default);
        this.app.use(tipo_caracteristica_1.default);
        this.app.use(categoria_1.default);
        this.app.use(s_categoria_1.default);
        this.app.use(caracteristica_1.default);
        this.app.use(version_1.default);
        this.app.use(estructura_archivos_1.default);
        this.app.use(TipoDocumetoCaracteristica_1.default);
        this.app.use(Reporte_1.default);
    }
    middlewares() {
        // Configurar CORS para aceptar solicitudes desde http://localhost:4200
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:4200",
        }));
        // Permitir que el servidor entienda el JSON
        this.app.use(express_1.default.json());
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Se esta jecutando; " + this.port);
        });
    }
    DBconex() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //3.Agregar await
                //await sequelize.authenticate();
                yield objetos_2.ms_objetos.sync();
                yield ms_usuarios_2.ms_usuarios.sync();
                yield parametros_2.parametros.sync();
                yield permisos_2.permisos.sync();
                yield roles_2.ms_roles.sync();
                yield estado_2.estado.sync();
                yield Documentos_model_1.documentos.sync();
                yield facultad_2.Facultad.sync();
                yield departamentos_2.departamentos.sync();
                yield clase_2.clases.sync();
                yield tipo_documento_2.tipo_documento.sync();
                yield tipo_archivo_2.tipo_archivo.sync();
                yield tipo_caracteristica_2.tipo_caracteristica.sync();
                yield categoria_2.categoria.sync();
                yield s_categoria_2.s_categoria.sync();
                yield caracteristica_2.caracteristica.sync();
                yield version_2.version.sync();
                yield estructura_archivos_2.estructura_archivos.sync();
                yield docuemtosDet_1.documentoDet.sync();
                yield docVersion_1.documentoVersiones.sync();
                yield TipoDocCaracteristica_1.tipoDocumentoCaracteristica.sync();
                yield DocumetoCaracteristica_1.DocumentoCaracteristica.sync();
                console.log("Conectado ;)");
            }
            catch (error) {
                console.log("Error de conexion: ", error);
            }
        });
    }
}
exports.default = Server;
