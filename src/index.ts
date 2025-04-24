import dotenv from "dotenv";
dotenv.config(); 

import { obtenerPuertoDesdeBD } from './models/puerto'
import Server from './models/server';
import sequelize from './database/conexion';

(async () => {
  const puerto = await obtenerPuertoDesdeBD();
  const server = new Server(puerto); 
})();
