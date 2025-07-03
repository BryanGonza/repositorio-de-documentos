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
exports.cargas = void 0;
const multer_1 = __importDefault(require("multer"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Ruta al archivo credentials.json
const KEYFILEPATH = path_1.default.join(__dirname, "subtle-torus-453105-u7-1dc1c208ad50.json");
// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// Autenticación con Google Drive
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
// Configurar Multer para manejar la subida de archivos temporalmente
const upload = (0, multer_1.default)({ dest: "uploads/" });
// Middleware para la carga de archivos
const cargas = (req, res, next) => {
    return upload.single("archivo")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            return res.status(400).json({ msg: "Error al subir el archivo" });
        }
        if (err) {
            return res.status(400).json({ msg: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No se proporcionó ningún archivo" });
        }
        next();
    }));
};
exports.cargas = cargas;
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
