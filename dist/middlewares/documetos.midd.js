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
exports.requireAuth = exports.subirDocumento = exports.cargas = void 0;
const multer_1 = __importDefault(require("multer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const KEYFILEPATH = path_1.default.join(__dirname, "../credencialesGD.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new googleapis_1.google.auth.GoogleAuth({ keyFile: KEYFILEPATH, scopes: SCOPES });
const drive = googleapis_1.google.drive({ version: "v3", auth });
// Configuración  de Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Tipos permitidos (MIME) y por extensión (fallback si el navegador manda 'octet-stream')
const allowedMimes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'image/jpeg',
    'image/png',
];
const allowedExts = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'
];
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB límite
    },
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const okByMime = allowedMimes.includes(file.mimetype);
        const okByExt = allowedExts.includes(ext);
        if (okByMime || okByExt) {
            cb(null, true);
        }
        else {
            cb(new Error(`Tipo de archivo no permitido (${file.mimetype || ext})`));
        }
    }
});
// Middleware mejorado
const cargas = (req, res, next) => {
    return upload.single("archivo")(req, res, (err) => {
        if (err) {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ msg: "El archivo excede el tamaño máximo permitido (10MB)" });
                }
                return res.status(400).json({ msg: `Error de Multer: ${err.message}` });
            }
            return res.status(400).json({ msg: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No se ha seleccionado ningún archivo" });
        }
        // Verificar que el archivo se subió correctamente
        if (!fs_1.default.existsSync(req.file.path)) {
            return res.status(500).json({ msg: "Error al guardar el archivo temporal" });
        }
        next();
    });
};
exports.cargas = cargas;
// Ejemplo de endpoint que usa el middleware
const subirDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Archivo no recibido" });
        }
        const { originalname, path: tempPath } = req.file;
        const { ID_USUARIO, ID_TIPO_DOCUMENTO } = req.body;
        // 1. Subir a Google Drive
        const fileMetadata = {
            name: originalname,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs_1.default.createReadStream(tempPath)
        };
        const driveResponse = yield drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id,webViewLink'
        });
        // 2. Procesar características dinámicas si existen
        let caracteristicas = [];
        if (req.body.caracteristicas) {
            try {
                caracteristicas = JSON.parse(req.body.caracteristicas);
            }
            catch (e) {
                fs_1.default.unlinkSync(tempPath);
                return res.status(400).json({ msg: "Formato de características inválido" });
            }
        }
        // 3. Aquí continuarías con tu lógica de base de datos...
        // ... (usar driveResponse.data.id y driveResponse.data.webViewLink)
        // Limpiar archivo temporal
        fs_1.default.unlinkSync(tempPath);
        return res.status(201).json({
            msg: "Archivo subido correctamente",
            driveId: driveResponse.data.id,
            viewLink: driveResponse.data.webViewLink,
            caracteristicas
        });
    }
    catch (error) {
        if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path)
            fs_1.default.unlinkSync(req.file.path);
        console.error("Error en subirDocumento:", error);
        return res.status(500).json({
            msg: "Error en el servidor",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
});
exports.subirDocumento = subirDocumento;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const h = req.headers.authorization;
    if (!(h === null || h === void 0 ? void 0 : h.startsWith('Bearer ')))
        return res.status(401).json({ msg: 'Falta token' });
    const token = h.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.Secret_key || 'Repositorio_Documentos_2025');
        req.user = {
            id: payload.id,
            departamento: payload.departamento,
            rol: payload.rol,
        };
        next();
    }
    catch (_a) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
};
exports.requireAuth = requireAuth;
// import { Request, Response, NextFunction } from "express"; // Importar NextFunction
// import multer from "multer";
// import { google } from "googleapis";
// import dotenv from "dotenv";
// import path from "path";
// import fs from "fs";
// dotenv.config();
// // Ruta al archivo credentials.json
// const KEYFILEPATH = path.join(__dirname, "../credencialesGD.json");
// // Scopes necesarios para acceder a Google Drive
// const SCOPES = ["https://www.googleapis.com/auth/drive"];
// // Autenticación con Google Drive
// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });
// const drive = google.drive({ version: "v3", auth });
// // Configurar Multer para manejar la subida de archivos temporalmente
// const upload = multer({ dest: "uploads/" });
// // Middleware para la carga de archivos
// export const cargas = (req: Request, res: Response, next: NextFunction) => {
//   return upload.single("archivo")(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ msg: "Error al subir el archivo" });
//     }
//     if (err) {
//       return res.status(400).json({ msg: err.message });
//     }
//     if (!req.file) {
//       return res.status(400).json({ msg: "No se proporcionó ningún archivo" });
//     }
//     next();
//   });
// };
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../../public/cargas"),
//   filename: function (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) {
//     const uuid = crypto.randomUUID();
//     cb(
//       null, uuid + file.originalname.substring(file.originalname.lastIndexOf("."))
//     );
//   },
// });
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   const filetypes = /jpeg|jpg|png|pdf|docx/;
//   const mimetype = filetypes.test(file.mimetype);
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Tipo de archivo no admitido"));
//   }
// };
// const maxsize = 5 * 1024 * 1024;
// export const cargas = (req: Request, res: Response, next: NextFunction) => {
//   return multer({
//     storage,
//     limits: { fileSize: maxsize },
//     fileFilter,
//   }).single("archivo")(req, res, (err)=>{
//     if (err instanceof multer.MulterError){
//       return res.status(400).json({
//         msg:"tamaño maximo de docuemntos es de 5MB..."
//       });
//     }
//     if(err) return res.status(400).json(err.msg);
//     if(!req.file){
//       res.status(400).json({
//         msg: "Tipo de archivo o formato no aceptado..."
//       });
//     }
//     next()
//   })
// };
