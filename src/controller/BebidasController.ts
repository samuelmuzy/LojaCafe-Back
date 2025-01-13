import { alterarBebidaServise, cadastroBebidas,  deletarBebidaNova, exibirBebidas } from '../services/BebidaServise';
import { Request,Response } from 'express';

export const cadastroBebida = async (req:Request,res:Response) =>{
  const { nome, descricao, disponivel, preco } = req.body;
  const file = req.file;
  const token  = req.headers.authorization!;

  try{
    const novaBebida = await cadastroBebidas(nome,descricao,preco,disponivel,file?.filename as string,token);
    res.status(201).send(novaBebida);
  }catch (error: any) {
    const statusCode = error.status || 500; // Padrão para 500 se não for definido
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const buscarTodasBebidas = async (req:Request,res:Response) =>{
  const { nomeBebida,limit,page } = req.query;
  try{
    const bebidas = await exibirBebidas(typeof nomeBebida === 'string' ? nomeBebida : '',limit as string,page as string);
    res.status(200).send(bebidas);
  }catch (error: any) {
    const statusCode = error.status || 500; // Padrão para 500 se não for definido
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const excluirBebida = async (req:Request,res:Response) =>{
  const { idBebida } = req.params;
  const token  = req.headers.authorization!;
  try{
    const bebidaDeletada = await deletarBebidaNova(idBebida,token);
    res.status(200).send(bebidaDeletada);
  }catch (error: any) {
    const statusCode = error.status || 500; // Padrão para 500 se não for definido
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const alterarBebidaController = async (req:Request,res:Response) =>{
  const { nome,descricao,preco,disponivel } = req.body;
  const file = req.file;
  const token  = req.headers.authorization!;
  const { idBebida } = req.params;
  try{
    const bebidaAlterada = await alterarBebidaServise(idBebida,nome,descricao,preco,disponivel,file?.filename as string,token);
    res.status(200).send(bebidaAlterada);
  }catch (error: any) {
    const statusCode = error.status || 500; // Padrão para 500 se não for definido
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};