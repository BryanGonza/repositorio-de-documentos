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
exports.getDetalleCaracteristicasDocumento = exports.getCaracteristicasPorTipoDocumentoSP = exports.getCaracteristicasPorTipoDocumento = exports.getDocumentoCaracteristicaCompleta = exports.updateValorPredeterminado = exports.eliminarDocumentoCaracteristica = exports.insertDocumentoCaracteristica = void 0;
const conexion_1 = __importDefault(require("../../database/conexion"));
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
const tipo_documento_1 = require("../../models/Documentos/tipo_documento");
const insertDocumentoCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id_tipo_documento, id_caracteristica } = req.body;
    try {
        if (!id_tipo_documento || !id_caracteristica) {
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento e id_caracteristica son requeridos'
            });
        }
        // procedimiento almacenado
        const [resultado] = yield conexion_1.default.query('CALL InsertaDocumentoCaracteristica(:id_tipo, :id_caract)', {
            replacements: {
                id_tipo: id_tipo_documento,
                id_caract: id_caracteristica,
            },
            type: sequelize_1.QueryTypes.RAW
        });
        //respuesta del procedimiento
        const mensaje = ((_b = (_a = resultado === null || resultado === void 0 ? void 0 : resultado[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Resultado) || 'Relación creada correctamente';
        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica,
            }
        });
    }
    catch (error) {
        if (error instanceof Error && 'parent' in error && ((_c = error.parent) === null || _c === void 0 ? void 0 : _c.code) === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }
        //error generico
        res.status(500).json({
            success: false,
            msg: 'Error al insertar la relación documento-característica',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.insertDocumentoCaracteristica = insertDocumentoCaracteristica;
const eliminarDocumentoCaracteristica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id_tipo_documento, id_caracteristica } = req.body;
    const transaction = yield conexion_1.default.transaction();
    try {
        // Validación básica de parámetros
        if (!id_tipo_documento || !id_caracteristica) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento e id_caracteristica son requeridos'
            });
        }
        // Llamada al procedimiento almacenado dentro de una transacción
        const [resultado] = yield conexion_1.default.query('CALL EliminarDocumentoCaracteristica(?, ?)', {
            replacements: [id_tipo_documento, id_caracteristica],
            type: sequelize_1.QueryTypes.RAW,
            transaction
        });
        yield transaction.commit();
        // Procesar la respuesta del procedimiento
        const mensaje = ((_b = (_a = resultado === null || resultado === void 0 ? void 0 : resultado[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Resultado) || 'Relación eliminada correctamente';
        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica
            }
        });
    }
    catch (error) {
        yield transaction.rollback();
        // Manejo de errores (igual que en la versión anterior)
        if (error instanceof Error && 'parent' in error && ((_c = error.parent) === null || _c === void 0 ? void 0 : _c.code) === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar la relación documento-característica',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.eliminarDocumentoCaracteristica = eliminarDocumentoCaracteristica;
const updateValorPredeterminado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id_tipo_documento, id_caracteristica, nuevo_valor } = req.body;
    try {
        // Validación básica de parámetros
        if (!id_tipo_documento || !id_caracteristica || nuevo_valor === undefined) {
            return res.status(400).json({
                success: false,
                msg: 'Los parámetros id_tipo_documento, id_caracteristica y nuevo_valor son requeridos'
            });
        }
        // Llamada al procedimiento almacenado
        const [resultado] = yield conexion_1.default.query('CALL ActualiarValorPredeterminado(:id_tipo, :id_caract)', {
            replacements: {
                id_tipo: id_tipo_documento,
                id_caract: id_caracteristica,
            },
            type: sequelize_1.QueryTypes.RAW
        });
        // Procesar la respuesta del procedimiento
        const mensaje = ((_b = (_a = resultado === null || resultado === void 0 ? void 0 : resultado[0]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Resultado) || 'Valor predeterminado actualizado correctamente';
        res.json({
            success: true,
            msg: mensaje,
            data: {
                ID_TIPO_DOCUMENTO: id_tipo_documento,
                ID_CARACTERISTICA: id_caracteristica,
            }
        });
    }
    catch (error) {
        // Manejo específico para errores de SQL
        if (error instanceof Error && 'parent' in error && ((_c = error.parent) === null || _c === void 0 ? void 0 : _c.code) === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }
        // Manejo genérico de errores
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el valor predeterminado',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.updateValorPredeterminado = updateValorPredeterminado;
const getDocumentoCaracteristicaCompleta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Listado_DocumentoCaracteristica = yield models_1.tipoDocumentoCaracteristica.findAll({
            include: [
                {
                    model: models_1.caracteristica,
                    as: 'def',
                    attributes: ['CARACTERISTICA'] // o el campo que quieras mostrar
                },
                {
                    model: tipo_documento_1.tipo_documento,
                    as: 'tipo_documento',
                    attributes: ['TIPO_DOCUMENTO'] // o el campo que quieras mostrar
                }
            ]
        });
        res.json({ Listado_DocumentoCaracteristica });
    }
    catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});
exports.getDocumentoCaracteristicaCompleta = getDocumentoCaracteristicaCompleta;
const getCaracteristicasPorTipoDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_tipo_documento } = req.params;
    try {
        const caracteristicas = yield models_1.tipoDocumentoCaracteristica.findAll({
            where: { ID_TIPO_DOCUMENTO: id_tipo_documento },
            include: [
                {
                    model: models_1.caracteristica,
                    as: 'def',
                    attributes: ['ID_CARACTERISTICA', 'CARACTERISTICA', 'VALORES_PREDETERMINADOS']
                }
            ]
        });
        res.json({ caracteristicas });
    }
    catch (error) {
        console.error('Error al obtener características:', error);
        res.status(500).json({ msg: 'Error al obtener características' });
    }
});
exports.getCaracteristicasPorTipoDocumento = getCaracteristicasPorTipoDocumento;
// GET ALL: llama a SP sp_obtener_caracteristicas_por_tipo_documento
const getCaracteristicasPorTipoDocumentoSP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id_tipo_documento } = req.params;
    if (!id_tipo_documento) {
        return res
            .status(400)
            .json({ success: false, msg: 'El parámetro id_tipo_documento es requerido' });
    }
    try {
        // Ejecuta el SP, puede devolver un array mixto de filas y metadata
        const rawResult = yield conexion_1.default.query('CALL ObtenerCaracteristicaTipoDoc(:id_tipo)', {
            replacements: { id_tipo: Number(id_tipo_documento) },
            type: sequelize_1.QueryTypes.SELECT
        });
        // Aplanar rawResult para extraer solo los objetos fila reales
        const rows = [];
        rawResult.forEach(item => {
            if (item && typeof item === 'object') {
                const keys = Object.keys(item);
                const numericKeys = keys.filter(k => /^\d+$/.test(k));
                if (numericKeys.length > 0) {
                    // item es un objeto con índices numéricos a sub-objetos fila
                    numericKeys.forEach(k => rows.push(item[k]));
                }
                else if ('ID_CARACTERISTICA' in item || 'id_caracteristica' in item) {
                    // item ya es una fila
                    rows.push(item);
                }
            }
        });
        // Mapear cada fila al formato esperado por el front
        const list = rows.map(r => {
            var _a, _b, _c, _d, _e, _f, _g;
            const idTpdc = (_a = r.ID_TIPO_DOCUMENTO_CARACTERISTICA) !== null && _a !== void 0 ? _a : r.id_tipo_documento_caracteristica;
            const idCar = (_b = r.ID_CARACTERISTICA) !== null && _b !== void 0 ? _b : r.id_caracteristica;
            const idTipo = (_c = r.ID_TIPO_DOCUMENTO) !== null && _c !== void 0 ? _c : r.id_tipo_documento;
            const nombre = (_e = (_d = r.CARACTERISTICA) !== null && _d !== void 0 ? _d : r.caracteristica) !== null && _e !== void 0 ? _e : '';
            const nombreTipo = (_g = (_f = r.NOMBRE_TIPO_CARACTERISTICA) !== null && _f !== void 0 ? _f : r.nombre_tipo_caracteristica) !== null && _g !== void 0 ? _g : '';
            return {
                ID_TIPO_DOCUMENTO_CARACTERISTICA: idTpdc,
                ID_CARACTERISTICA: idCar,
                ID_TIPO_DOCUMENTO: idTipo,
                def: { CARACTERISTICA: nombre,
                    NOMBRE_TIPO_CARACTERISTICA: nombreTipo
                }
            };
        });
        // Envolver en data.Listado_DocumentoCaracteristica
        return res.json({
            success: true,
            data: { Listado_DocumentoCaracteristica: list }
        });
    }
    catch (error) {
        if (((_a = error.parent) === null || _a === void 0 ? void 0 : _a.code) === 'ER_SIGNAL_EXCEPTION') {
            return res.status(404).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener características',
            error: error.message
        });
    }
});
exports.getCaracteristicasPorTipoDocumentoSP = getCaracteristicasPorTipoDocumentoSP;
const getDetalleCaracteristicasDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id_documento } = req.params;
    if (!id_documento) {
        return res
            .status(400)
            .json({ success: false, msg: 'El parámetro id_documento es requerido' });
    }
    try {
        // Ejecuta el SP
        const rawResult = yield conexion_1.default.query('CALL ObtenerDetalleDocumentoCaracteristicas(:id_documento)', {
            replacements: { id_documento: Number(id_documento) },
            type: sequelize_1.QueryTypes.SELECT
        });
        // Aplanar resultado
        const rows = [];
        rawResult.forEach(item => {
            if (item && typeof item === 'object') {
                const keys = Object.keys(item);
                const numericKeys = keys.filter(k => /^\d+$/.test(k));
                if (numericKeys.length > 0) {
                    numericKeys.forEach(k => rows.push(item[k]));
                }
                else if ('ID_DOCUMENTO_CARACTERISTICA' in item || 'id_documento_caracteristica' in item) {
                    rows.push(item);
                }
            }
        });
        // Mapear al formato esperado
        const list = rows.map(r => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                ID_DOCUMENTO_CARACTERISTICA: (_a = r.ID_DOCUMENTO_CARACTERISTICA) !== null && _a !== void 0 ? _a : r.id_documento_caracteristica,
                ID_DOCUMENTO: (_b = r.ID_DOCUMENTO) !== null && _b !== void 0 ? _b : r.id_documento,
                ID_TIPO_DOCUMENTO_CARACTERISTICA: (_c = r.ID_TIPO_DOCUMENTO_CARACTERISTICA) !== null && _c !== void 0 ? _c : r.id_tipo_documento_caracteristica,
                VALOR: (_d = r.VALOR) !== null && _d !== void 0 ? _d : r.valor,
                ID_TIPO_DOCUMENTO: (_e = r.ID_TIPO_DOCUMENTO) !== null && _e !== void 0 ? _e : r.id_tipo_documento,
                TIPO_DOCUMENTO: (_f = r.TIPO_DOCUMENTO) !== null && _f !== void 0 ? _f : r.tipo_documento,
                ID_CARACTERISTICA: (_g = r.ID_CARACTERISTICA) !== null && _g !== void 0 ? _g : r.id_caracteristica,
                CARACTERISTICA: (_h = r.CARACTERISTICA) !== null && _h !== void 0 ? _h : r.caracteristica,
                // --- Agregados ---
                ID_DEPARTAMENTO: (_j = r.ID_DEPARTAMENTO) !== null && _j !== void 0 ? _j : r.id_departamento,
                NOMBRE_DEPARTAMENTO: (_k = r.NOMBRE_DEPARTAMENTO) !== null && _k !== void 0 ? _k : r.nombre_departamento,
            });
        });
        // Envolver en data.Listado_CaracteristicasDocumento
        return res.json({
            success: true,
            data: { Listado_CaracteristicasDocumento: list }
        });
    }
    catch (error) {
        if (((_a = error.parent) === null || _a === void 0 ? void 0 : _a.code) === 'ER_SIGNAL_EXCEPTION') {
            return res.status(404).json({
                success: false,
                msg: error.message.replace('ER_SIGNAL_EXCEPTION: ', '')
            });
        }
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener características del documento',
            error: error.message
        });
    }
});
exports.getDetalleCaracteristicasDocumento = getDetalleCaracteristicasDocumento;
