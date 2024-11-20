import express from 'express'
import {alterarCliente, buscarCliente, buscarClientePorId, cadastrar,deletarUsuario,logar} from '../controller/ClienteController'

export const ClienteRouter = express.Router();

ClienteRouter.post('/cadastro',cadastrar);
ClienteRouter.post('/login',logar);

ClienteRouter.get('/buscar',buscarCliente);
ClienteRouter.get('/buscarId/:id',buscarClientePorId);

ClienteRouter.delete('/deletar/:id',deletarUsuario);

ClienteRouter.put('/alterar/:id',alterarCliente);
