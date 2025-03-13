import { Request, Response, NextFunction } from "express"; // Importar NextFunction
import multer from "multer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { documentos } from "../../models/Documentos/Documentos.model";
import { ms_usuarios } from "../../models/ms_usuarios";
import { log } from "console";

dotenv.config();

// Ruta al archivo credentials.json
const KEYFILEPATH = path.join(__dirname, "../credential.json");

// Scopes necesarios para acceder a Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Autenticación con Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });
export const SubirDoc = async (req: Request, res: Response) => {
  console.log(req.file?.originalname);
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

    // Verificar que response.data.id sea una cadena
    if (!response.data.id) {
      throw new Error("No se pudo obtener el ID del archivo subido.");
    }

    // Configurar permisos para que el archivo sea accesible públicamente
    await drive.permissions.create({
      fileId: response.data.id, // Aquí response.data.id es una cadena
      requestBody: {
        role: "reader", // Permiso de solo lectura
        type: "anyone", // Accesible para cualquier persona con el enlace
      },
    });

    const { ID_USUARIO } = req.body;

    // Guardar la información del archivo en la base de datos
    await documentos.create({
      ID_USUARIO,
      ID_ESTADO: 1,
      NOMBRE: req.file?.originalname,
      URL: response.data.webViewLink, // Enlace de visualización
      URl_DOW:`https://drive.google.com/uc?export=download&id=${response.data.id}`,
      FECHA_SUBIDA: new Date(),
      DRIVE_ID: response.data.id,
    });

    // Respuesta exitosa
    res.json({
      msg: `Documento ${req.file?.originalname} subido correctamente.`,
      fileUrl: response.data.webViewLink, // Enlace de visualización
      downloadUrl: `https://drive.google.com/uc?export=download&id=${response.data.id}`, // Enlace de descarga directa
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

  export const EliminarDoc = async (req: Request, res: Response) => {
    const { idDocumento } = req.params;
    
    try {
      // Buscar el documento en la base de datos
      const documento = await documentos.findOne({ where: { ID_DOCUMENTO: idDocumento } });
      
      if (!documento) {
        return res.status(404).json({ msg: "Documento no encontrado" });
      }
      
      const fileId = documento.DRIVE_ID // ID en drive
      
      // Eliminar de Google Drive
      await drive.files.delete({ fileId });
      
      // Eliminar de la base de datos
      await documentos.destroy({ where: { ID_DOCUMENTO: idDocumento } });
      
      res.json({ msg: "Documento eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      res.status(500).json({ msg: "Error al eliminar el documento" });
    }
  };
//Get para traer todos los DOC
export const getDocumetos = async (req: Request, res: Response) => {
  const ListDocume = await documentos.findAll();
  res.json({ ListDocume });
};

export const getCorreoUsuario = async (req: Request, res: Response) => {
  console.log("Parámetros recibidos:", req.params);
  const { idUsuario } = req.params;
  try {
    const usuario = await ms_usuarios.findOne({
      where: { ID_USUARIO: idUsuario },
      attributes: ["CORREO_ELECTRONICO"]
    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ correo: usuario.CORREO_ELECTRONICO });
  } catch (error) {
    console.error("Error al obtener el correo del usuario:", error);
    res.status(500).json({ msg: "Error al obtener el correo del usuario" });
  }
}
//docuemtos user id
export const getDocumentosPorUsuario = async (req: Request, res: Response) => {
  const { idUsuario } = req.params;
console.log(idUsuario);

  try {
    const documentosUsuario = await documentos.findAll({
      
      where: { ID_USUARIO: idUsuario },
      attributes: ["ID_DOCUMENTO","ID_USUARIO", "ID_ESTADO", "NOMBRE", "URL", "FECHA_SUBIDA", "DRIVE_ID"]
    });

    if (!documentosUsuario.length) {
      return res.status(404).json({ msg: "No has subido ningun docuemto..." });
    }

    res.json({ ListDocume: documentosUsuario });
  } catch (error) {
    console.error("Error al obtener documentos del usuario:", error);
    res.status(500).json({ msg: "Error al obtener documentos del usuario" });
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
    