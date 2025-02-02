import express, { Application } from 'express';
import cors from 'cors';
import rUser from '../routes/ms_usuarios';
import { ms_usuarios } from './ms_usuarios';

class Server {
    private  app: Application;
    private port: string;

    constructor(){
        this.app = express();
        this.port = process.env.Port || '3016';
        this.middlewares();
        this.router();
        this.DBconex();
        this.listen();
    }
    router(){
        this.app.use(rUser)
    }
    
    middlewares(){
        // Configurar CORS para aceptar solicitudes desde http://localhost:4200
        this.app.use(cors({
            origin: 'http://localhost:4200'
        }));

        // Permitir que el servidor entienda el JSON
        this.app.use(express.json());
    }

 
    listen(){
        this.app.listen(this.port, () => {
            console.log("Se esta jecutando; "+ this.port);
        })
    }

    async DBconex(){
        try {
         // await sequelize.authenticate();
         await ms_usuarios.sync();
         console.log("Conectado ;)");
        } catch (error) {
             console.log("Error de conexion: ", error);
        }
    }
  
}


export default Server