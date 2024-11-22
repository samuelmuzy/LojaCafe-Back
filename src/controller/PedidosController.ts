import { Request,Response } from "express"
import { buscarPedidos, inserirPedidosCliente } from "../services/PedidosServise";

export const buscarPedidosCliente = async (req:Request , res:Response) =>{
    const {idCliente} = req.params;
    try{
        const pedido =  await buscarPedidos(idCliente);
        res.status(200).send(pedido);
    }catch (error: any) {
        const statusCode = error.status || 500; 
        const message = error.message || "Erro interno do servidor";

        res.status(statusCode).send(error.sqlMessage || message);
    }
}

export const cadastrarPedido = async (req:Request, res:Response) =>{
    const { idCliente, formaPagamento, valorPedido, bebidas } = req.body;
    const dataAtual = new Date();

    try{
        const pedido = await inserirPedidosCliente(dataAtual,formaPagamento,valorPedido,idCliente,bebidas);
        res.status(200).send(pedido);
    }catch (error: any) {
        const statusCode = error.status || 500; 
        const message = error.message || "Erro interno do servidor";

        res.status(statusCode).send(error.sqlMessage || message);
    }
}