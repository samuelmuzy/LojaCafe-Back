import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { storage } from './middlewares/multerConfig';

export const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({ storage:storage });

app.use('/file',express.static('uploads'));

app.listen(3003, () => {
  console.log('Rodando em http://localhost:3003/');
});