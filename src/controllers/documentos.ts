import { Request, Response, NextFunction } from "express"; // Importar NextFunction
import multer from "multer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Ruta al archivo credentials.json
const KEYFILEPATH = path.join(__dirname, "credential.json");

// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Autenticación con Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });
export const SubirDoc = async (req: Request, res: Response) => {
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
      body: fs.createReadStream(req.file.path), // Leer el archivo temporal
    };
  
    try {
      // Subir el archivo a Google Drive
      const response = await drive.files.create({
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
    } catch (error) {
      console.error("Error al subir el archivo a Google Drive:", error);
      res.status(500).json({ msg: "Error al subir el archivo a Google Drive" });
    } finally {
      // Eliminar el archivo temporal en cualquier caso
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
    }
  };


  
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
    