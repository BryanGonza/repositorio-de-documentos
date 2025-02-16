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
//1.Importar correctamente
const ms_usuarios_1 = __importDefault(require("../routes/ms_usuarios"));
const parametros_1 = __importDefault(require("../routes/parametros"));
const permisos_1 = __importDefault(require("../routes/permisos"));
const roles_1 = __importDefault(require("../routes/roles"));
const ms_usuarios_2 = require("./ms_usuarios");
const parametros_2 = require("./parametros");
const permisos_2 = require("./permisos");
const roles_2 = require("./roles");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.Port || "3016";
        this.middlewares();
        this.router();
        this.DBconex();
        this.listen();
    }
    router() {
        //2. Use correctamente
        this.app.use(ms_usuarios_1.default);
        this.app.use(parametros_1.default);
        this.app.use(permisos_1.default);
        this.app.use(roles_1.default);
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
                yield ms_usuarios_2.ms_usuarios.sync();
                yield parametros_2.parametros.sync();
                yield permisos_2.permisos.sync();
                yield roles_2.ms_roles.sync();
                console.log("Conectado ;)");
            }
            catch (error) {
                console.log("Error de conexion: ", error);
            }
        });
    }
}
exports.default = Server;
