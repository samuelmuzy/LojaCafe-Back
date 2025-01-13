import express from 'express';
import { alterarBebidaController, buscarTodasBebidas, cadastroBebida, excluirBebida } from '../controller/BebidasController';
import multer from 'multer';
import { storage } from '../middlewares/multerConfig';

export const BebidaRouter = express.Router();

const upload = multer({ storage:storage });

BebidaRouter.post('/',upload.single('file'),cadastroBebida);

BebidaRouter.get('/',buscarTodasBebidas);

BebidaRouter.put('/:idBebida',upload.single('file'),alterarBebidaController);

BebidaRouter.delete('/deletar/:idBebida',excluirBebida);