import { Request,Response } from 'express';
import { BebidasPedido, buscarTodosPedidos, buscarPedidosPorId, inserirPedidosCliente, deletarPedidoId, deletarBebidaPedidoServise } from '../services/PedidosServise';
import { modificarPedido } from '../services/PedidosServise';

export const buscarPedidosCliente = async (req:Request , res:Response) =>{
  const { idCliente } = req.params;
  const token  = req.headers.authorization!;
  try{
    console.log(token)
    const pedido = await buscarPedidosPorId(idCliente,token);
    res.status(200).json(pedido);
  }catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || 'Erro interno do servidor';
  
    res.status(statusCode).json({
      error: {
        status: statusCode,
        message: message,
        sqlMessage: error.sqlMessage || null
      }
    });
  }
};

export const cadastrarPedido = async (req:Request, res:Response) =>{
  const { idCliente, formaPagamento, valorPedido, bebidas } = req.body;
  const token  = req.headers.authorization!;
  const dataAtual = new Date();

  try{
    const pedido = await inserirPedidosCliente(dataAtual,formaPagamento,valorPedido,idCliente,bebidas,token);
    res.status(200).send(pedido);
  }catch (error: any) {
    const statusCode = error.status || 500; 
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const cadastrarNovaBebidaPedido = async (req:Request, res:Response) => {
  const { idPedido , bebidas } = req.body;
  const token  = req.headers.authorization!;
    
  try{
    const produto = await BebidasPedido(idPedido,bebidas,token);
    res.status(200).send(produto);
  }catch (error: any) {
    const statusCode = error.status || 500; 
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const buscarPedidos = async (req:Request ,res:Response) =>{
  const token  = req.headers.authorization!;
  try{
    const produto = await buscarTodosPedidos(token);
    res.status(200).json(produto);
  }catch (error: any) {
    const statusCode = error.status || 500; 
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const deletarPedidos = async (req:Request,res:Response) =>{
  const { idPedido } = req.params;
  const token  = req.headers.authorization!;
  try{
    const pedidoDeletado = await deletarPedidoId(idPedido,token);
        
    res.status(200).send(pedidoDeletado);
  }catch (error: any) {
    const statusCode = error.status || 500; 
    const message = error.message || 'Erro interno do servidor';

    res.status(statusCode).send(error.sqlMessage || message);
  }
};

export const deletarBebidaNoPedido = async (req:Request,res:Response) =>{
  const { idPedido,idBebida } = req.params;
  const token  = req.headers.authorization!;
  try{
    const bebidaDeletada = await deletarBebidaPedidoServise(idPedido,idBebida,token);
    res.status(200).send(bebidaDeletada);
  }catch (error: any) {
    const statusCode = error.status || 500; 
    const message = error.message || 'Erro interno do servidor';
    res.status(statusCode).send(error.sqlMessage || message);
  }
};
export const atualizarPedido = async (req: Request, res: Response) => {
  const { formaPagamento, valorPedido, dataPedido } = req.body;
  const { idPedido } = req.params;
  const token = req.headers.authorization!;
    
  try {
    // Chama a função de serviço que modifica o pedido
    const mensagem = await modificarPedido(idPedido, formaPagamento, valorPedido, dataPedido, token);
    res.status(200).send({ message: mensagem });
  } catch (error: any) {
    const statusCode = error.status || 500;
    const message = error.message || 'Erro ao atualizar o pedido';
        
    res.status(statusCode).send({ message: error.sqlMessage || message });
  }
};