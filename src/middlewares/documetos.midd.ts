
import { Request, Response, NextFunction } from "express";

import multer from "multer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();


const KEYFILEPATH = path.join(__dirname, "../credencialesGD.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({ keyFile: KEYFILEPATH, scopes: SCOPES });
const drive = google.drive({ version: "v3", auth });

// Configuración mejorada de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// Middleware mejorado
export const cargas = (req: Request, res: Response, next: NextFunction) => {
  return upload.single("archivo")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
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
    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({ msg: "Error al guardar el archivo temporal" });

    }

    next();
  });
};


// Ejemplo de endpoint que usa el middleware
export const subirDocumento = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Archivo no recibido" });
    }

    const { originalname, path: tempPath } = req.file;
    const { ID_USUARIO, ID_TIPO_DOCUMENTO } = req.body;

    // 1. Subir a Google Drive
    const fileMetadata = {
      name: originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!]
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(tempPath)
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id,webViewLink'
    });

    // 2. Procesar características dinámicas si existen
    let caracteristicas = [];
    if (req.body.caracteristicas) {
      try {
        caracteristicas = JSON.parse(req.body.caracteristicas);
      } catch (e) {
        fs.unlinkSync(tempPath);
        return res.status(400).json({ msg: "Formato de características inválido" });
      }
    }

    // 3. Aquí continuarías con tu lógica de base de datos...
    // ... (usar driveResponse.data.id y driveResponse.data.webViewLink)

    // Limpiar archivo temporal
    fs.unlinkSync(tempPath);

    return res.status(201).json({
      msg: "Archivo subido correctamente",
      driveId: driveResponse.data.id,
      viewLink: driveResponse.data.webViewLink,
      caracteristicas
    });

  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error("Error en subirDocumento:", error);
    return res.status(500).json({ 
      msg: "Error en el servidor",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

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
