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
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerPuertoDesdeBD = void 0;
// src/config/puerto.ts
const sequelize_1 = require("sequelize");
const parametros_1 = require("../models/parametros");
const obtenerPuertoDesdeBD = () => __awaiter(void 0, void 0, void 0, function* () {
    const resultado = yield parametros_1.parametros.findOne({
        where: {
            PARAMETRO: {
                [sequelize_1.Op.like]: '%PUERTO%BACKEND%',
            },
        },
    });
    return Number(resultado === null || resultado === void 0 ? void 0 : resultado.VALOR) || 3016;
});
exports.obtenerPuertoDesdeBD = obtenerPuertoDesdeBD;
