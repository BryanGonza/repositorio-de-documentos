import express, { Application } from 'express';
import rUser from '../routes/ms_usuarios';
import { ms_usuarios } from './ms_usuarios';

class Server {
    private  app: Application;
    private port: string;

    constructor(){

        this.app = express();
        this.port = process.env.Port || '3016';
        this.listen();
        this.middlewares();
        this.router();
        this.DBconex();
       

    }
    router(){
        this.app.use(rUser)
    }
    
    middlewares(){
        this.app.use(express.json())
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
         console.log('tabala creada');
          console.log("Conectado ;)");
         

        } catch (error) {
             console.log("Error de conexion: ", error);
        }
    }
  
}


export default Server