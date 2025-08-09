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
exports.getDocumentosPorUsuario = exports.getCorreoUsuario = exports.getDocumentoDetalle = exports.getDocumetos = exports.EliminarDoc = exports.actualizarDocumentoDD = exports.SubirDoc = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Documentos_model_1 = require("../../models/Documentos/Documentos.model");
const ms_usuarios_1 = require("../../models/ms_usuarios");
const version_1 = require("../../models/Documentos/version");
const docVersion_1 = require("../../models/Documentos/docVersion");
const conexion_1 = __importDefault(require("../../database/conexion"));
const docuemtosDet_1 = require("../../models/Documentos/docuemtosDet");
const TipoDocCaracteristica_1 = require("../../models/Documentos/TipoDocCaracteristica");
const departamentos_1 = require("../../models/UNAH/departamentos");
const categoria_1 = require("../../models/Documentos/categoria");
const s_categoria_1 = require("../../models/Documentos/s_categoria");
const clase_1 = require("../../models/UNAH/clase");
const tipo_archivo_1 = require("../../models/Documentos/tipo_archivo");
const caracteristica_1 = require("../../models/Documentos/caracteristica");
const DocumetoCaracteristica_1 = __importDefault(require("../../models/Documentos/DocumetoCaracteristica")); // valores
dotenv_1.default.config();
const KEYFILEPATH = path_1.default.join(__dirname, "../credencialesGD.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
const SubirDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ msg: "Error al subir el archivo" });
    // 1) Campos planos
    const { ID_USUARIO, ES_PUBLICO: ES_PUBLICO_RAW, DESCRIPCION, NOMBRE, ID_DEPARTAMENTO, ID_CLASE, ID_ESTRUCTURA_ARCHIVOS, ID_TIPO_ARCHIVO, ID_CATEGORIA, ID_SUB_CATEGORIA, ID_TIPO_DOCUMENTO, caracteristicas: RAW, } = req.body;
    const ES_PUBLICO = ES_PUBLICO_RAW === "true" || ES_PUBLICO_RAW === "1";
    // 2) Parsear JSON de características
    let caracteristicas = [];
    if (RAW) {
        try {
            caracteristicas = JSON.parse(RAW);
            if (!Array.isArray(caracteristicas))
                throw "";
        }
        catch (_a) {
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
        body: fs_1.default.createReadStream(req.file.path),
    };
    const t = yield conexion_1.default.transaction();
    try {
        // 5) Plantilla de características
        const defs = (yield TipoDocCaracteristica_1.tipoDocumentoCaracteristica.findAll({
            where: { ID_TIPO_DOCUMENTO },
            include: [
                {
                    model: caracteristica_1.caracteristica,
                    as: "def",
                    attributes: ["ID_CARACTERISTICA", "CARACTERISTICA"],
                },
            ],
            attributes: ["ID_TIPO_DOCUMENTO_CARACTERISTICA", "ID_CARACTERISTICA"],
        }));
        // 6) Chequear obligatorias
        const faltantes = defs
            .filter((d) => !caracteristicas.some((c) => c.ID_CARACTERISTICA === d.ID_CARACTERISTICA))
            .map((d) => {
            var _a;
            return ({
                ID_CARACTERISTICA: d.ID_CARACTERISTICA,
                NOMBRE: (_a = d.def) === null || _a === void 0 ? void 0 : _a.CARACTERISTICA,
            });
        });
        if (defs.length && faltantes.length) {
            yield t.rollback();
            return res
                .status(400)
                .json({
                msg: "Faltan características obligatorias",
                caracteristicasFaltantes: faltantes,
            });
        }
        // 7) Drive
        const driveRes = yield drive.files.create({
            requestBody: fileMeta,
            media,
            fields: "id,webViewLink",
        });
        const driveId = driveRes.data.id;
        yield drive.permissions.create({
            fileId: driveId,
            requestBody: { role: "reader", type: "anyone" },
        });
        // 8) Documento principal
        const doc = yield Documentos_model_1.documentos.create({
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
        }, { transaction: t });
        // 9) Crear valores en tbl_documento_caracteristica
        const creadas = [];
        for (const c of caracteristicas) {
            const plantilla = defs.find((d) => d.ID_CARACTERISTICA === c.ID_CARACTERISTICA);
            if (!plantilla)
                continue;
            const val = yield DocumetoCaracteristica_1.default.create({
                ID_DOCUMENTO: doc.ID_DOCUMENTO,
                ID_TIPO_DOCUMENTO_CARACTERISTICA: plantilla.ID_TIPO_DOCUMENTO_CARACTERISTICA,
                VALOR: c.VALOR,
            }, { transaction: t });
            creadas.push(val);
        }
        // 10) Crear detalle (sin FK obsoleta)
        const det = yield docuemtosDet_1.documentoDet.create({
            ID_DOCUMENTO: doc.ID_DOCUMENTO,
            ID_DEPARTAMENTO: Number(ID_DEPARTAMENTO),
            ID_CLASE: Number(ID_CLASE),
            ID_ESTRUCTURA_ARCHIVOS: Number(ID_ESTRUCTURA_ARCHIVOS),
            ID_TIPO_ARCHIVO: Number(ID_TIPO_ARCHIVO),
            ID_CATEGORIA: Number(ID_CATEGORIA),
            ID_SUB_CATEGORIA: Number(ID_SUB_CATEGORIA),
            FORMATO: doc.FORMATO,
            NOMBRE: doc.NOMBRE,
        }, { transaction: t });
        // 11) Versión
        const ver = yield version_1.version.create({
            ID_USUARIO: Number(ID_USUARIO),
            Nombre: `v1 - subida inicial`,
            Cambios: "Subida inicial" + (creadas.length ? " con características" : ""),
            Fecha_Actu: new Date(),
        }, { transaction: t });
        yield docVersion_1.documentoVersiones.create({
            ID_VERSION: ver.ID_VERSION,
            ID_DOCUMENTO_DET: det.ID_DOCUMENTO_DET,
            FECHA_DESDE: new Date(),
            ESTADO: true,
            DESCRIPCION: "Versión inicial",
        }, { transaction: t });
        yield Documentos_model_1.documentos.update({ ID_VERSION: ver.ID_VERSION }, { where: { ID_DOCUMENTO: doc.ID_DOCUMENTO }, transaction: t });
        yield t.commit();
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
    }
    catch (err) {
        yield t.rollback();
        console.error(err);
        return res
            .status(500)
            .json({ msg: "Error al procesar la subida", error: err.message });
    }
    finally {
        if (req.file && fs_1.default.existsSync(req.file.path))
            fs_1.default.unlinkSync(req.file.path);
    }
});
exports.SubirDoc = SubirDoc;
const actualizarDocumentoDD = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID_DOCUMENTO, NOMBRE, DESCRIPCION, ES_PUBLICO } = req.body;
    // Validar que existan todos los datos
    if (!ID_DOCUMENTO || !NOMBRE || DESCRIPCION === undefined || ES_PUBLICO === undefined) {
        return res.status(400).json({ msg: "Faltan datos requeridos en el body" });
    }
    try {
        yield conexion_1.default.query(`CALL ActualizarDocumentoDD(:ID_DOCUMENTO, :NOMBRE, :DESCRIPCION, :ES_PUBLICO)`, {
            replacements: {
                ID_DOCUMENTO,
                NOMBRE,
                DESCRIPCION,
                ES_PUBLICO,
            },
        });
        res.json({ msg: "Documento actualizado correctamente" });
    }
    catch (error) {
        console.error("Error al actualizar documento:", error);
        res.status(500).json({
            msg: "Error al actualizar documento",
            error: error.message,
        });
    }
});
exports.actualizarDocumentoDD = actualizarDocumentoDD;
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
const EliminarDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idDocumento } = req.params;
    const t = yield conexion_1.default.transaction(); // Iniciar transacción
    try {
        // Buscar el documento
        const documento = yield Documentos_model_1.documentos.findOne({
            where: { ID_DOCUMENTO: idDocumento },
            transaction: t,
        });
        if (!documento) {
            yield t.rollback();
            return res.status(404).json({ msg: "Documento no encontrado" });
        }
        const fileId = documento.DRIVE_ID;
        // Intentar borrar en Drive
        try {
            if (fileId) {
                yield drive.files.delete({ fileId });
            }
        }
        catch (error) {
            if (error.code === 404) {
                console.warn(`Drive: archivo ${fileId} no existe, continuo borrando DB`);
            }
            else {
                console.error("Error eliminando de Drive:", error);
                throw new Error("Error eliminando en Drive");
            }
        }
        // Buscar todos los detalles vinculados a este documento
        const detalles = (yield docuemtosDet_1.documentoDet.findAll({
            where: { ID_DOCUMENTO: idDocumento },
            attributes: ["ID_DOCUMENTO_DET"],
            transaction: t,
            raw: true,
        }));
        const detalleIds = detalles.map((d) => d.ID_DOCUMENTO_DET);
        if (detalleIds.length > 0) {
            // Primero eliminar versiones vinculadas a los detalles
            yield docVersion_1.documentoVersiones.destroy({
                where: { ID_DOCUMENTO_DET: detalleIds },
                transaction: t,
            });
            // Luego eliminar los detalles mismos
            yield docuemtosDet_1.documentoDet.destroy({
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
        yield Documentos_model_1.documentos.destroy({
            where: { ID_DOCUMENTO: idDocumento },
            transaction: t,
        });
        yield t.commit(); // Confirmar cambios
        res.json({ msg: "Documento eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar el documento:", error);
        yield t.rollback();
        res.status(500).json({ msg: "Error al eliminar el documento" });
    }
});
exports.EliminarDoc = EliminarDoc;
const getDocumetos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const departamentoJwt = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.departamento; // viene del middleware/jwt
        const idDepartamento = Number((_b = req.query.idDepartamento) !== null && _b !== void 0 ? _b : departamentoJwt);
        if (Number.isFinite(idDepartamento)) {
            const [rows] = yield conexion_1.default.query(`
        SELECT d.*
        FROM tbl_documentos d
        INNER JOIN tbl_usuarios u ON u.ID_USUARIO = d.ID_USUARIO
        WHERE CAST(d.ES_PUBLICO AS UNSIGNED) = 1
          AND u.ID_DEPARTAMENTO = :depto
        ORDER BY d.FECHA_SUBIDA DESC
        `, { replacements: { depto: idDepartamento } });
            return res.json({ ListDocume: rows });
        }
        else {
            // Fallback si no tenemos depto: solo públicos de cualquier depto (o podés devolver 400)
            const [rows] = yield conexion_1.default.query(`
        SELECT d.*
        FROM tbl_documentos d
        WHERE CAST(d.ES_PUBLICO AS UNSIGNED) = 1
        ORDER BY d.FECHA_SUBIDA DESC
        `);
            return res.json({ ListDocume: rows });
            // o: return res.status(400).json({ msg: 'No se pudo determinar el departamento' });
        }
    }
    catch (error) {
        console.error("Error al obtener los documentos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.getDocumetos = getDocumetos;
// GET /api/documentos/:id
const getDocumentoDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const doc = yield Documentos_model_1.documentos.findByPk(id, {
        include: [
            {
                model: docuemtosDet_1.documentoDet,
                as: "detalles",
                include: [
                    { model: departamentos_1.departamentos, as: "departamento", attributes: ["Nombre"] },
                    { model: categoria_1.categoria, as: "categoria", attributes: ["Categoria"] },
                    {
                        model: s_categoria_1.s_categoria,
                        as: "subCategoria",
                        attributes: ["Sub_Categoria"],
                    },
                    { model: clase_1.clases, as: "clase", attributes: ["Nombre"] },
                    {
                        model: tipo_archivo_1.tipo_archivo,
                        as: "tipoArchivo",
                        attributes: ["Tipo_Archivo"],
                    },
                    {
                        model: TipoDocCaracteristica_1.tipoDocumentoCaracteristica,
                        as: "caracteristica",
                        attributes: ["VALOR"],
                        include: [
                            {
                                model: caracteristica_1.caracteristica,
                                as: "def",
                                attributes: ["Caracteristica"],
                            },
                        ],
                    },
                ],
            },
        ],
    });
    if (!doc)
        return res.status(404).json({ msg: "No existe ese documento" });
    res.json({ doc });
});
exports.getDocumentoDetalle = getDocumentoDetalle;
const getCorreoUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Parámetros recibidos:", req.params);
    const { idUsuario } = req.params;
    try {
        const usuario = yield ms_usuarios_1.ms_usuarios.findOne({
            where: { ID_USUARIO: idUsuario },
            attributes: ["CORREO_ELECTRONICO"],
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
