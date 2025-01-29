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
const ms_usuarios_1 = __importDefault(require("../routes/ms_usuarios"));
const ms_usuarios_2 = require("./ms_usuarios");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.Port || '3016';
        this.listen();
        this.middlewares();
        this.router();
        this.DBconex();
    }
    router() {
        this.app.use(ms_usuarios_1.default);
    }
    middlewares() {
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
                // await sequelize.authenticate();
                yield ms_usuarios_2.ms_usuarios.sync();
                console.log('tabala creada');
                console.log("Conectado ;)");
            }
            catch (error) {
                console.log("Error de conexion: ", error);
            }
        });
    }
}
exports.default = Server;
