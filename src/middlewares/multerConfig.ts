import multer from 'multer';

// Armazena o arquivo em memória para que possamos enviar o buffer ao Cloudinary
export const storage = multer.memoryStorage();