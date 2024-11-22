import { v7 } from "uuid";
import { inserirBebidasPedido, inserirPedidos, pesquisarPedidosCliente } from "../data/PedidosData"

export const buscarPedidos = async (id:string) =>{
    try{
        if(!id){
            throw {status:404 , message:"Sem id!"}
        }

        const pedido = await pesquisarPedidosCliente(id);
        
        if(pedido.length === 0){
            throw {status:400, message:"Usuário sem pedidos!"}
        }

        return pedido;
    }catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o cadastro" };
    }
}

export const inserirPedidosCliente = async (dataPedido:Date,formaPagamento:string,valorPedido:number,clienteId:string,bebidas:string[]) =>{
    try{
        if (!clienteId || !formaPagamento || !valorPedido || !dataPedido || !bebidas || bebidas.length === 0) {
            throw {status:400, message:"Usuário sem pedidos!"}
        }

        const idPedido = v7();

        await inserirPedidos(idPedido,dataPedido,formaPagamento,valorPedido,clienteId);

        await inserirBebidasPedido(idPedido,bebidas);

        return "Pedido inserido!"

    }catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o cadastro" };
    }
}