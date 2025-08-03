// multer.d.ts
import "multer"; // Importar multer para extender sus tipos

declare module "multer" {
  interface File {
    fileId?: string; // ID del archivo en Google Drive
    fileUrl?: string; // URL de visualización del archivo
    downloadUrl?: string; // URL de descarga del archivo
  }
}