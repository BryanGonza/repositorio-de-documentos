import { Request, Response, NextFunction } from "express"; // Importar NextFunction
import multer from "multer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Ruta al archivo credentials.json
const KEYFILEPATH = path.join(__dirname, "subtle-torus-453105-u7-1dc1c208ad50.json");

// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Autenticación con Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

// Configurar Multer para manejar la subida de archivos temporalmente
const upload = multer({ dest: "uploads/" });

// Middleware para la carga de archivos
export const cargas = (req: Request, res: Response, next: NextFunction) => {
  return upload.single("archivo")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: "Error al subir el archivo" });
    }
    if (err) {
      return res.status(400).json({ msg: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No se proporcionó ningún archivo" });
    }

    next();
  });
};



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
