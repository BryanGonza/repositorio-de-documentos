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
exports.getDocumentosPorUsuario = exports.getCorreoUsuario = exports.getDocumetos = exports.EliminarDoc = exports.SubirDoc = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Documentos_model_1 = require("../../models/Documentos/Documentos.model");
const ms_usuarios_1 = require("../../models/ms_usuarios");
dotenv_1.default.config();
// Ruta al archivo credentials.json
const KEYFILEPATH = path_1.default.join(__dirname, "../credential.json");
// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// Autenticación con Google Drive
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
const SubirDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log((_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname);
    if (!req.file) {
        return res.status(400).json({ msg: "Error al subir el archivo" });
    }
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
        return res.status(500).json({ msg: "GOOGLE_DRIVE_FOLDER_ID no está definido" });
    }
    const fileMetadata = {
        name: req.file.originalname,
        parents: [folderId],
    };
    const media = {
        mimeType: req.file.mimetype,
        body: fs_1.default.createReadStream(req.file.path), // Leer el archivo temporal
    };
    try {
        // Subir el archivo a Google Drive
        const response = yield drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id, webViewLink, webContentLink",
        });
        // Verificar que response.data.id sea una cadena
        if (!response.data.id) {
            throw new Error("No se pudo obtener el ID del archivo subido.");
        }
        // Configurar permisos para que el archivo sea accesible públicamente
        yield drive.permissions.create({
            fileId: response.data.id, // Aquí response.data.id es una cadena
            requestBody: {
                role: "reader", // Permiso de solo lectura
                type: "anyone", // Accesible para cualquier persona con el enlace
            },
        });
        const { ID_USUARIO, ES_PUBLICO, DESCRIPCION, NOMBRE } = req.body;
        // Guardar la información del archivo en la base de datos
        yield Documentos_model_1.documentos.create({
            ID_USUARIO,
            ID_ESTADO: 1,
            NOMBRE: NOMBRE.toUpperCase(),
            URL: response.data.webViewLink, // Enlace de visualización
            URl_DOW: `https://drive.google.com/uc?export=download&id=${response.data.id}`,
            FECHA_SUBIDA: new Date(),
            DRIVE_ID: response.data.id,
            ES_PUBLICO,
            DESCRIPCION: DESCRIPCION.toUpperCase()
        });
        // Respuesta exitosa
        res.json({
            msg: `Documento ${(_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname} subido correctamente.`,
            fileUrl: response.data.webViewLink, // Enlace de visualización
            downloadUrl: `https://drive.google.com/uc?export=download&id=${response.data.id}`, // Enlace de descarga directa
        });
    }
    catch (error) {
        console.error("Error al subir el archivo a Google Drive:", error);
        res.status(500).json({ msg: "Error al subir el archivo a Google Drive" });
    }
    finally {
        // Eliminar el archivo temporal en cualquier caso
        if (req.file) {
            fs_1.default.unlinkSync(req.file.path);
        }
    }
});
exports.SubirDoc = SubirDoc;
const EliminarDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idDocumento } = req.params;
    try {
        // Buscar el documento en la base de datos
        const documento = yield Documentos_model_1.documentos.findOne({ where: { ID_DOCUMENTO: idDocumento } });
        if (!documento) {
            return res.status(404).json({ msg: "Documento no encontrado" });
        }
        const fileId = documento.DRIVE_ID; // ID en drive
        // Eliminar de Google Drive
        yield drive.files.delete({ fileId });
        // Eliminar de la base de datos
        yield Documentos_model_1.documentos.destroy({ where: { ID_DOCUMENTO: idDocumento } });
        res.json({ msg: "Documento eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar el documento:", error);
        res.status(500).json({ msg: "Error al eliminar el documento" });
    }
});
exports.EliminarDoc = EliminarDoc;
const getDocumetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Filtrar y ordenar documentos por fecha descendente (más recientes primero)
        const ListDocume = yield Documentos_model_1.documentos.findAll({
            where: {
                ES_PUBLICO: 1,
            },
            order: [
                ['FECHA_SUBIDA', 'DESC'] // Ordenar por FECHA_SUBIDA en orden descendente
            ]
        });
        res.json({ ListDocume });
    }
    catch (error) {
        console.error('Error al obtener los documentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.getDocumetos = getDocumetos;
const getCorreoUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Parámetros recibidos:", req.params);
    const { idUsuario } = req.params;
    try {
        const usuario = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { ID_USUARIO: idUsuario },
            attributes: ["CORREO_ELECTRONICO"]
        });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json({ correo: usuario.CORREO_ELECTRONICO });
    }
    catch (error) {
        console.error("Error al obtener el correo del usuario:", error);
        res.status(500).json({ msg: "Error al obtener el correo del usuario" });
    }
});
exports.getCorreoUsuario = getCorreoUsuario;
const getDocumentosPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario } = req.params;
    console.log(idUsuario);
    try {
        const documentosUsuario = yield Documentos_model_1.documentos.findAll({
            where: { ID_USUARIO: idUsuario },
            attributes: [
                "ID_DOCUMENTO",
                "ID_USUARIO",
                "ID_ESTADO",
                "NOMBRE",
                "URL",
                "URl_DOW",
                "FECHA_SUBIDA",
                "DRIVE_ID",
                "DESCRIPCION",
                "ES_PUBLICO"
            ],
            order: [
                ['FECHA_SUBIDA', 'DESC'] // Ordenar por fecha descendente (más recientes primero)
            ]
        });
        if (!documentosUsuario.length) {
            return res.status(404).json({ msg: "No has subido ningún documento..." });
        }
        res.json({ ListDocume: documentosUsuario });
    }
    catch (error) {
        console.error("Error al obtener documentos del usuario:", error);
        res.status(500).json({ msg: "Error al obtener documentos del usuario" });
    }
});
exports.getDocumentosPorUsuario = getDocumentosPorUsuario;
// import { Request, Response } from "express";
// export const devolverRespuesta = (req: Request, res: Response) => {
//   // Verificar si el archivo se subió correctamente
//   if (!req.file) {
//     return res.status(400).json({ msg: "Error al subir el archivo" });
//   }
//   // Verificar si el middleware adjuntó la información del archivo
//   if (!req.file.fileId || !req.file.fileUrl) {
//     return res.status(500).json({ msg: "Información del archivo no disponible" });
//   }
//   // Devolver el mensaje y el enlace del archivo
//   res.json({
//     msg: "Archivo subido exitosamente",
//     fileUrl: req.file.fileUrl, // URL del archivo en Google Drive
//   });
// };
// if (!req.file) {
//     return res.status(400).json({ msg: "No se ha subido ningún archivo" });
// }
// const nombre_original = req.file.originalname;
// console.log("nombre riginal:", nombre_original);
// res.status(201).json({
//     msg: "Docuemto Subido Correctamente",
//     file: req.file as Express.Multer.File
// });
