import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const validarToken = (req: Request, res: Response, next: NextFunction) => {
  const HeadersToken = req.headers["authorization"];
  console.log(HeadersToken);

  if (HeadersToken != undefined && HeadersToken.startsWith("Bearer ")) {
    try {
      const token = HeadersToken.slice(7);
      jwt.verify(token, process.env.Secret_key || "Repositorio_Docuemntos");

      next();
    } catch (error) {
      res.status(401).json({ msg: `Token invalido` });
    }
  } else {
    res.status(401).json({ msg: `Acceso denegado` });
  }
};

export default validarToken;
