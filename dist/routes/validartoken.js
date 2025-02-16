"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarToken = (req, res, next) => {
    const HeadersToken = req.headers["authorization"];
    console.log(HeadersToken);
    if (HeadersToken != undefined && HeadersToken.startsWith("Bearer ")) {
        try {
            const token = HeadersToken.slice(7);
            jsonwebtoken_1.default.verify(token, process.env.Secret_key || "Repositorio_Docuemntos");
            next();
        }
        catch (error) {
            res.status(401).json({ msg: `Token invalido` });
        }
    }
    else {
        res.status(401).json({ msg: `Acceso denegado` });
    }
};
exports.default = validarToken;
