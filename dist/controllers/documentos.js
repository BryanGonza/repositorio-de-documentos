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
exports.SubirDoc = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
// Ruta al archivo credentials.json
const KEYFILEPATH = path_1.default.join(__dirname, "credential.json");
// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// Autenticación con Google Drive
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
const SubirDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ msg: "Error al subir el archivo" });
    }
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
        return res.status(500).json({ msg: "GOOGLE_DRIVE_FOLDER_ID no está definido" });
    }
    const fileMetadata = {
        name: req.file.originalname,
        parents: [folderId], // Carpeta en Google Drive
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
        // Respuesta exitosa
        res.json({
            msg: "Archivo subido exitosamente",
            fileId: response.data.id, // ID del archivo en Google Drive
            fileUrl: response.data.webViewLink, // URL de visualización
            downloadUrl: response.data.webContentLink, // URL de descarga
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
