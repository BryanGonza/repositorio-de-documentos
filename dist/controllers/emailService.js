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
exports.configurarTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
// USar APi para obtener los parametros
function obtenerParametrosEspecificos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Llamada a la API para obtener los parámetros
            const response = yield axios_1.default.get('http://localhost:3016/api/parametros/getParametros');
            const ListParametros = response.data.ListParametros;
            let correoRecuperacion = '';
            let contrasenaAplicacion = '';
            ListParametros.forEach((parametro) => {
                if (parametro.PARAMETRO === 'CORREO ELECTRONICO QUE ENVIA RECUPERACCION DE CONTRASEÑA') {
                    correoRecuperacion = parametro.VALOR;
                }
                else if (parametro.PARAMETRO === 'CONTRASEÑA DE APLICACCION') {
                    contrasenaAplicacion = parametro.VALOR;
                }
            });
            // Retornar los valorse
            return { correoRecuperacion, contrasenaAplicacion };
        }
        catch (error) {
            console.error('Error al obtener los parámetros:', error);
            throw error;
        }
    });
}
const configurarTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener los valores de correo y contraseña desde la base de datos
        const { correoRecuperacion, contrasenaAplicacion } = yield obtenerParametrosEspecificos();
        console.log("Correo de recuperación:", correoRecuperacion);
        console.log("Contraseña de aplicación:", contrasenaAplicacion);
        // Crear el transporter de nodemailer con los valores obtenidos
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: correoRecuperacion, // Correo electrónico de parametros 
                pass: contrasenaAplicacion, // Contraseña de aplicación de parametros
            },
        });
        return transporter;
    }
    catch (error) {
        console.error("Error al configurar el transporter:", error);
        throw error;
    }
});
exports.configurarTransporter = configurarTransporter;
