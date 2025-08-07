import { Request, Response, NextFunction } from "express"; // Importar NextFunction
import multer from "multer";
import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { documentos } from "../../models/Documentos/Documentos.model";
import { ms_usuarios } from "../../models/ms_usuarios";
import { log } from "console";
import { version } from "../../models/Documentos/version";
import { documentoVersiones } from "../../models/Documentos/docVersion";
import sequelize from "../../database/conexion";
import { documentoDet } from "../../models/Documentos/docuemtosDet";
import { tipoDocumentoCaracteristica } from "../../models/Documentos/TipoDocCaracteristica";
import { departamentos } from "../../models/UNAH/departamentos";
import { categoria } from "../../models/Documentos/categoria";
import { s_categoria } from "../../models/Documentos/s_categoria";

import { clases } from "../../models/UNAH/clase";
import { tipo_archivo } from "../../models/Documentos/tipo_archivo";
import { caracteristica } from "../../models/Documentos/caracteristica";
import DocumentoCaracteristica from "../../models/Documentos/DocumetoCaracteristica"; // valores

dotenv.config();

const KEYFILEPATH = path.join(__dirname, "../credencialesGD.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

// Tipos
interface CaracteristicaForm {
  ID_CARACTERISTICA: number;
  VALOR: string;
}
interface CaracteristicaRequeridaDB {
  ID_TIPO_DOCUMENTO_CARACTERISTICA: number;
  ID_CARACTERISTICA: number;
  def?: { ID_CARACTERISTICA: number; CARACTERISTICA: string };
}

export const SubirDoc = async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).json({ msg: "Error al subir el archivo" });

  // 1) Campos planos
  const {
    ID_USUARIO,
    ES_PUBLICO: ES_PUBLICO_RAW,
    DESCRIPCION,
    NOMBRE,
    ID_DEPARTAMENTO,
    ID_CLASE,
    ID_ESTRUCTURA_ARCHIVOS,
    ID_TIPO_ARCHIVO,
    ID_CATEGORIA,
    ID_SUB_CATEGORIA,

    ID_TIPO_DOCUMENTO,
    caracteristicas: RAW,
  } = req.body as Record<string, string>;

  const ES_PUBLICO = ES_PUBLICO_RAW === "true" || ES_PUBLICO_RAW === "1";

  // 2) Parsear JSON de características
  let caracteristicas: CaracteristicaForm[] = [];
  if (RAW) {
    try {
      caracteristicas = JSON.parse(RAW);
      if (!Array.isArray(caracteristicas)) throw "";
    } catch {
      return res
        .status(400)
        .json({ msg: "Formato JSON inválido en ‘caracteristicas’" });
    }
  }

  // 3) Validaciones básicas
  if (!ID_TIPO_DOCUMENTO) {
    return res.status(400).json({ msg: "El tipo de documento es requerido" });
  }
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    return res
      .status(500)
      .json({ msg: "GOOGLE_DRIVE_FOLDER_ID no está definido" });
  }

  // 4) Subida a Drive
  const fileMeta = { name: req.file.originalname, parents: [folderId] };
  const media = {
    mimeType: req.file.mimetype,
    body: fs.createReadStream(req.file.path),

  };

  const t = await sequelize.transaction();
  try {

    // 5) Plantilla de características
    const defs = (await tipoDocumentoCaracteristica.findAll({
      where: { ID_TIPO_DOCUMENTO },
      include: [
        {
          model: caracteristica,
          as: "def",
          attributes: ["ID_CARACTERISTICA", "CARACTERISTICA"],
        },
      ],
      attributes: ["ID_TIPO_DOCUMENTO_CARACTERISTICA", "ID_CARACTERISTICA"],
    })) as unknown as CaracteristicaRequeridaDB[];

    // 6) Chequear obligatorias
    const faltantes = defs
      .filter(
        (d) =>
          !caracteristicas.some(
            (c) => c.ID_CARACTERISTICA === d.ID_CARACTERISTICA
          )
      )
      .map((d) => ({
        ID_CARACTERISTICA: d.ID_CARACTERISTICA,
        NOMBRE: d.def?.CARACTERISTICA,
      }));
    if (defs.length && faltantes.length) {
      await t.rollback();
      return res
        .status(400)
        .json({
          msg: "Faltan características obligatorias",
          caracteristicasFaltantes: faltantes,
        });
    }

    // 7) Drive
    const driveRes = await drive.files.create({
      requestBody: fileMeta,
      media,
      fields: "id,webViewLink",
    });
    const driveId = driveRes.data.id!;
    await drive.permissions.create({
      fileId: driveId,
      requestBody: { role: "reader", type: "anyone" },
    });

    // 8) Documento principal
    const doc = await documentos.create(
      {
        ID_USUARIO: Number(ID_USUARIO),
        ID_ESTADO: 1,
        ID_TIPO_DOCUMENTO: Number(ID_TIPO_DOCUMENTO),
        NOMBRE: NOMBRE.toUpperCase(),
        FORMATO: req.file.originalname.split(".").pop() || "",
        URL: driveRes.data.webViewLink,
        URl_DOW: `https://drive.google.com/uc?export=download&id=${driveId}`,
        FECHA_SUBIDA: new Date(),
        DRIVE_ID: driveId,
        ES_PUBLICO,
        DESCRIPCION: DESCRIPCION.toUpperCase(),
      },
      { transaction: t }
    );

    // 9) Crear valores en tbl_documento_caracteristica
    const creadas = [];
    for (const c of caracteristicas) {
      const plantilla = defs.find(
        (d) => d.ID_CARACTERISTICA === c.ID_CARACTERISTICA
      );
      if (!plantilla) continue;
      const val = await DocumentoCaracteristica.create(
        {
          ID_DOCUMENTO: doc.ID_DOCUMENTO,
          ID_TIPO_DOCUMENTO_CARACTERISTICA:
            plantilla.ID_TIPO_DOCUMENTO_CARACTERISTICA,
          VALOR: c.VALOR,
        },
        { transaction: t }
      );
      creadas.push(val);
    }

    // 10) Crear detalle (sin FK obsoleta)
    const det = await documentoDet.create(
      {
        ID_DOCUMENTO: doc.ID_DOCUMENTO,
        ID_DEPARTAMENTO: Number(ID_DEPARTAMENTO),
        ID_CLASE: Number(ID_CLASE),
        ID_ESTRUCTURA_ARCHIVOS: Number(ID_ESTRUCTURA_ARCHIVOS),
        ID_TIPO_ARCHIVO: Number(ID_TIPO_ARCHIVO),
        ID_CATEGORIA: Number(ID_CATEGORIA),
        ID_SUB_CATEGORIA: Number(ID_SUB_CATEGORIA),
        FORMATO: doc.FORMATO,
        NOMBRE: doc.NOMBRE,
      },
      { transaction: t }
    );

    // 11) Versión
    const ver = await version.create(
      {
        ID_USUARIO: Number(ID_USUARIO),
        Nombre: `v1 - subida inicial`,
        Cambios:
          "Subida inicial" + (creadas.length ? " con características" : ""),
        Fecha_Actu: new Date(),
      },
      { transaction: t }
    );
    await documentoVersiones.create(
      {
        ID_VERSION: ver.ID_VERSION,
        ID_DOCUMENTO_DET: det.ID_DOCUMENTO_DET,
        FECHA_DESDE: new Date(),
        ESTADO: true,
        DESCRIPCION: "Versión inicial",
      },
      { transaction: t }
    );

    await documentos.update(
      { ID_VERSION: ver.ID_VERSION },
      { where: { ID_DOCUMENTO: doc.ID_DOCUMENTO }, transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      msg: "Documento registrado con éxito",
      documento: doc,
      detalle: det,
      version: ver,
      caracteristicas: creadas.map((dc) => ({
        ID_DOCUMENTO_CARACTERISTICA: dc.ID_DOCUMENTO_CARACTERISTICA,
        VALOR: dc.VALOR,
      })),
    });
  } catch (err: any) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Error al procesar la subida", error: err.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
};

export const actualizarDocumentoDD = async (req: Request, res: Response) => {
  const { ID_DOCUMENTO, NOMBRE, DESCRIPCION, ES_PUBLICO } = req.body;

  // Validar que existan todos los datos
  if (!ID_DOCUMENTO || !NOMBRE || DESCRIPCION === undefined || ES_PUBLICO === undefined) {
    return res.status(400).json({ msg: "Faltan datos requeridos en el body" });
  }

  try {
    await sequelize.query(
      `CALL ActualizarDocumentoDD(:ID_DOCUMENTO, :NOMBRE, :DESCRIPCION, :ES_PUBLICO)`,
      {
        replacements: {
          ID_DOCUMENTO,
          NOMBRE,
          DESCRIPCION,
          ES_PUBLICO,
        },
      }
    );

    res.json({ msg: "Documento actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar documento:", error);
    res.status(500).json({
      msg: "Error al actualizar documento",
      error: error.message,
    });
  }
};

// dotenv.config();

// const KEYFILEPATH = path.join(__dirname, "../credencialesGD.json");

// // scopes necesarios para acceder a Google Drive
// const SCOPES = ["https://www.googleapis.com/auth/drive"];

// // Autenticacion con Google Drive
// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: "v3", auth });
// export const SubirDoc = async (req: Request, res: Response) => {
//   if (!req.file) return res.status(400).json({ msg: "Error al subir el archivo" });

//   // Extraemos los campos del body
//   const {
//     ID_USUARIO,
//     ES_PUBLICO,
//     DESCRIPCION,
//     NOMBRE,
//     ID_DEPARTAMENTO,
//     ID_CLASE,
//     ID_ESTRUCTURA_ARCHIVOS,
//     ID_TIPO_ARCHIVO,
//     ID_CATEGORIA,
//     ID_SUB_CATEGORIA,
//     ID_CARACTERISTICA,
//     VALOR_CARACTERISTICA
//   } = req.body;

//   console.log(req.file?.originalname);
//   if (!req.file) {
//     return res.status(400).json({ msg: "Error al subir el archivo" });
//   }
//   const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
//    if (!folderId) {
//       return res.status(500).json({ msg: "GOOGLE_DRIVE_FOLDER_ID no está definido" });
//    }
//    const fileMetadata = {
//     name: req.file.originalname,
//     parents: [folderId],
//   };

//   const media = {
//     mimeType: req.file.mimetype,
//     body: fs.createReadStream(req.file.path), // Leer el archivo temporal
//   };

//   const t = await sequelize.transaction();
//   try {
//     // drive
//     const driveRes = await drive.files.create({ requestBody: fileMetadata, media, fields: "id, webViewLink" });
//     const driveId = driveRes.data.id!;
//     await drive.permissions.create({ fileId: driveId, requestBody: { role: "reader", type: "anyone" } });

//     // crear docuemto
//     const doc = await documentos.create({
//       ID_USUARIO,
//       ID_ESTADO: 1,
//       NOMBRE: NOMBRE.toUpperCase(),
//       FORMATO: req.file.originalname.split('.').pop(),
//       URL: driveRes.data.webViewLink,
//       URl_DOW: `https://drive.google.com/uc?export=download&id=${driveId}`,
//       FECHA_SUBIDA: new Date(),
//       DRIVE_ID: driveId,
//       ES_PUBLICO,
//       DESCRIPCION: DESCRIPCION.toUpperCase()
//     }, { transaction: t });

//     //crear registro de característica dinámica
//     const docCaract = await tipoDocumentoCaracteristica.create({
//       ID_CARACTERISTICA,
//       ID_DOCUMENTO: doc.ID_DOCUMENTO,
//       VALOR: VALOR_CARACTERISTICA
//     }, { transaction: t });

//     // 4) Crear detalle en documentos_det usando la nueva característica
//     const det = await documentoDet.create({
//       ID_DOCUMENTO: doc.ID_DOCUMENTO,
//       ID_DEPARTAMENTO,
//       ID_CLASE,
//       ID_ESTRUCTURA_ARCHIVOS,
//       ID_TIPO_ARCHIVO,
//       ID_TIPO_DOCUMENTO_CARACTERISTICA: docCaract.ID_TIPO_DOCUMENTO_CARACTERISTICA,
//       ID_CATEGORIA,
//       ID_SUB_CATEGORIA,
//       FORMATO: doc.FORMATO,
//       NOMBRE: doc.NOMBRE
//     }, { transaction: t });

//     // Generar nueva versión
//     const ver = await version.create({
//       ID_USUARIO,
//       Nombre: `v1 - subida inicial`,
//       Cambios: "Se sube archivo, característica y registro de detalle",
//       Fecha_Actu: new Date()
//     }, { transaction: t });

//     await documentoVersiones.create({
//       ID_VERSION: ver.ID_VERSION,
//       ID_DOCUMENTO_DET: det.ID_DOCUMENTO_DET,
//       FECHA_DESDE: new Date(),
//       ESTADO: true,
//       DESCRIPCION: "Versión inicial"
//     }, { transaction: t });

//     // Actualizar la versión actual en documentos
//     await documentos.update(
//       { ID_VERSION: ver.ID_VERSION },
//       { where: { ID_DOCUMENTO: doc.ID_DOCUMENTO }, transaction: t }
//     );

//     await t.commit();
//     res.status(201).json({ msg: "Documento, característica y detalle registrados con éxito.", documento: doc, detalle: det, version: ver });
//   } catch (err: any) {
//     await t.rollback();
//     console.error(err);
//     res.status(500).json({ msg: "Error al procesar la subida completa", error: err.message });
//   } finally {
//     fs.unlinkSync(req.file.path);
//   }
// };
//subir documento antes de las modificaciones

// export const SubirDoc = async (req: Request, res: Response) => {
//   console.log(req.file?.originalname);
//   if (!req.file) {
//     return res.status(400).json({ msg: "Error al subir el archivo" });
//   }

//   const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
//   if (!folderId) {
//     return res.status(500).json({ msg: "GOOGLE_DRIVE_FOLDER_ID no está definido" });
//   }

//   const fileMetadata = {
//     name: req.file.originalname,
//     parents: [folderId],
//   };

//   const media = {
//     mimeType: req.file.mimetype,
//     body: fs.createReadStream(req.file.path), // Leer el archivo temporal
//   };

//   try {
//     // Subir el archivo a Google Drive
//     const response = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id, webViewLink, webContentLink",
//     });

//     // Verificar que response.data.id sea una cadena
//     if (!response.data.id) {
//       throw new Error("No se pudo obtener el ID del archivo subido.");
//     }

//     // Configurar permisos para que el archivo sea accesible públicamente
//     await drive.permissions.create({
//       fileId: response.data.id, // Aquí response.data.id es una cadena
//       requestBody: {
//         role: "reader", // Permiso de solo lectura
//         type: "anyone", // Accesible para cualquier persona con el enlace
//       },
//     });

//     const { ID_USUARIO, ES_PUBLICO, DESCRIPCION, NOMBRE } = req.body;


//     // Guardar la información del archivo en la base de datos
//     await documentos.create({
//       ID_USUARIO,
//       ID_ESTADO: 1,
//       NOMBRE: NOMBRE.toUpperCase(),
//       URL: response.data.webViewLink, // Enlace de visualización
//       URl_DOW:`https://drive.google.com/uc?export=download&id=${response.data.id}`,
//       FECHA_SUBIDA: new Date(),
//       DRIVE_ID: response.data.id,
//       ES_PUBLICO,
//       DESCRIPCION: DESCRIPCION.toUpperCase()
//     });

//     // Respuesta exitosa
//     res.json({
//       msg: `Documento ${req.file?.originalname} subido correctamente.`,
//       fileUrl: response.data.webViewLink, // Enlace de visualización
//       downloadUrl: `https://drive.google.com/uc?export=download&id=${response.data.id}`, // Enlace de descarga directa
//     });
//   } catch (error) {
//     console.error("Error al subir el archivo a Google Drive:", error);
//     res.status(500).json({ msg: "Error al subir el archivo a Google Drive" });
//   } finally {
//     // Eliminar el archivo temporal en cualquier caso
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//   }
// };


export const EliminarDoc = async (req: Request, res: Response) => {
  const { idDocumento } = req.params;

  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    // Buscar el documento

    const documento = await documentos.findOne({
      where: { ID_DOCUMENTO: idDocumento },
      transaction: t,
    });


    if (!documento) {
      await t.rollback();
      return res.status(404).json({ msg: "Documento no encontrado" });
    }

    const fileId = documento.DRIVE_ID;

    // Intentar borrar en Drive
    try {
      if (fileId) {
        await drive.files.delete({ fileId });
      }
    } catch (error: any) {
      if (error.code === 404) {

        console.warn(
          `Drive: archivo ${fileId} no existe, continuo borrando DB`
        );

      } else {
        console.error("Error eliminando de Drive:", error);
        throw new Error("Error eliminando en Drive");
      }
    }

    // Buscar todos los detalles vinculados a este documento

    const detalles = (await documentoDet.findAll({
      where: { ID_DOCUMENTO: idDocumento },
      attributes: ["ID_DOCUMENTO_DET"],
      transaction: t,
      raw: true,
    })) as Array<{ ID_DOCUMENTO_DET: number }>;

    const detalleIds = detalles.map((d) => d.ID_DOCUMENTO_DET);


    if (detalleIds.length > 0) {
      // Primero eliminar versiones vinculadas a los detalles
      await documentoVersiones.destroy({
        where: { ID_DOCUMENTO_DET: detalleIds },

        transaction: t,

      });

      // Luego eliminar los detalles mismos
      await documentoDet.destroy({
        where: { ID_DOCUMENTO: idDocumento },

        transaction: t,

      });
    }

    // Eliminar las características dinámicas asociadas al documento

    // await tipoDocumentoCaracteristica.destroy({
    //   where: { ID_DOCUMENTO: idDocumento },
    //   transaction: t
    // });


    // Ahora eliminar el documento principal
    await documentos.destroy({
      where: { ID_DOCUMENTO: idDocumento },

      transaction: t,

    });

    await t.commit(); // Confirmar cambios
    res.json({ msg: "Documento eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    await t.rollback();
    res.status(500).json({ msg: "Error al eliminar el documento" });
  }
};


export const getDocumetos = async (req: Request, res: Response) => {
  try {
    // Filtrar y ordenar documentos por fecha descendente (más recientes primero)
    const ListDocume = await documentos.findAll({
      where: {
        ES_PUBLICO: 1,
      },
      order: [
        ["FECHA_SUBIDA", "DESC"], // Ordenar por FECHA_SUBIDA en orden descendente
      ],
    });

    res.json({ ListDocume });
  } catch (error) {
    console.error("Error al obtener los documentos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// GET /api/documentos/:id
export const getDocumentoDetalle = async (req: Request, res: Response) => {

  const id = req.params.id;
  const doc = await documentos.findByPk(id, {
    include: [
      {
        model: documentoDet,

        as: "detalles",
        include: [
          { model: departamentos, as: "departamento", attributes: ["Nombre"] },
          { model: categoria, as: "categoria", attributes: ["Categoria"] },
          {
            model: s_categoria,
            as: "subCategoria",
            attributes: ["Sub_Categoria"],
          },
          { model: clases, as: "clase", attributes: ["Nombre"] },
          {
            model: tipo_archivo,
            as: "tipoArchivo",
            attributes: ["Tipo_Archivo"],
          },
          {
            model: tipoDocumentoCaracteristica,
            as: "caracteristica",
            attributes: ["VALOR"],
            include: [
              {
                model: caracteristica,
                as: "def",
                attributes: ["Caracteristica"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!doc) return res.status(404).json({ msg: "No existe ese documento" });

  res.json({ doc });
};

export const getCorreoUsuario = async (req: Request, res: Response) => {
  console.log("Parámetros recibidos:", req.params);
  const { idUsuario } = req.params;
  try {
    const usuario = await ms_usuarios.findOne({
      where: { ID_USUARIO: idUsuario },

      attributes: ["CORREO_ELECTRONICO"],

    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json({ correo: usuario.CORREO_ELECTRONICO });
  } catch (error) {
    console.error("Error al obtener el correo del usuario:", error);
    res.status(500).json({ msg: "Error al obtener el correo del usuario" });
  }

};

export const getDocumentosPorUsuario = async (req: Request, res: Response) => {
  const { idUsuario } = req.params;
  console.log(idUsuario);

  try {
    const documentosUsuario = await documentos.findAll({
      where: { ID_USUARIO: idUsuario },
      attributes: [
        "ID_DOCUMENTO",

        "ID_USUARIO",
        "ID_ESTADO",
        "NOMBRE",
        "ID_TIPO_DOCUMENTO",
        "URL",
        "URl_DOW",
        "FECHA_SUBIDA",
        "DRIVE_ID",
        "DESCRIPCION",
        "ES_PUBLICO",
      ],
      order: [
        ["FECHA_SUBIDA", "DESC"], // Ordenar por fecha descendente (más recientes primero)
      ],

    });

    if (!documentosUsuario.length) {
      return res.status(404).json({ msg: "No has subido ningún documento..." });
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

