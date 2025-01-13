import { v7 } from 'uuid';

import {
  buscarBebidasNoPedido,
  buscarPedidos,
  deletarBebidaPedido,
  deletarPedido,
  inserirBebidasPedido,
  inserirPedidos,
  pesquisarPedidosCliente,
  verificarClientePedido,
  verificarIDbebidasPedido,
  verificarIdPedido,
  alterarPedido
} from '../data/PedidosData';
import { VerificarIdBebida, VerificarIdsBebida } from '../data/BebidaData';
import { buscarIdCliente } from '../data/ClientData';
import { getTokenData } from '../middlewares/Authenticator';

export const buscarPedidosPorId = async (idCliente: string,token:string) => {
  try {
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Token invalido' };
    }
    if (!idCliente) {
      throw { status: 404, message: 'ID do cliente não fornecido!' };
    }

    const pedido = await pesquisarPedidosCliente(idCliente);

    if (pedido.length === 0) {
      throw { status: 400, message: 'Cliente sem pedidos!' };
    }

    return pedido;
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao buscar pedidos' };
  }
};

export const inserirPedidosCliente = async (
  dataPedido: Date,
  formaPagamento: string,
  valorPedido: number,
  clienteId: string,
  bebidas: { productId: string, quantity: number }[],
  token:string
) => {
  try {
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Crie uma conta para adicionar uma bebida' };
    }
    if (!clienteId || !formaPagamento || !valorPedido || !dataPedido || !bebidas || bebidas.length === 0) {
      throw { status: 400, message: 'Campos obrigatórios não preenchidos!' };
    }

    const verificarIdCliente = await buscarIdCliente(clienteId);

    if (verificarIdCliente.length === 0) {
      throw { status: 404, message: 'ID do cliente não encontrado!' };
    }

    const clienteTemPedido = await verificarClientePedido(clienteId);

    if (clienteTemPedido) {
      throw { status: 400, message: 'Cliente já possui um pedido!' };
    }

    const idsBebidas = bebidas.map((b) => b.productId);
    const idsBebidasValidas = await VerificarIdsBebida(idsBebidas);

    const idsInvalidos = bebidas.filter((b) => !idsBebidasValidas.includes(b.productId));

    if (idsInvalidos.length > 0) {
      throw { status: 400, message: `IDs de bebidas inválidos: ${idsInvalidos.map((b) => b.productId).join(', ')}` };
    }

    const idPedido = v7();

    await inserirPedidos(idPedido, dataPedido, formaPagamento, valorPedido, clienteId);

    await inserirBebidasPedido(idPedido, bebidas);

    return { message: 'Pedido inserido com sucesso!', idPedido };
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao inserir pedido' };
  }
};

export const buscarTodosPedidos = async (token:string) => {
  try {
    const pedidos = await buscarPedidos();

    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Token invalido' };
    }

    if (pedidos.length === 0) {
      throw { status: 400, message: 'Nenhum pedido encontrado!' };
    }

    return pedidos;
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao buscar pedidos' };
  }
};

export const BebidasPedido = async (idPedido: string, bebidas: { productId: string, quantity: number }[],token:string) => {
  try {
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Crie uma conta para adicionar ao carrinho' };
    }
    if (!idPedido) {
      throw { status: 404, message: 'ID do pedido não fornecido!' };
    }

    if (!bebidas || !Array.isArray(bebidas) || bebidas.length === 0) {
      throw { status: 400, message: 'O parâmetro bebidas deve ser um array não vazio!' };
    }

    const idsBebidas = bebidas.map((b) => b.productId);
    const idsBebidasValidas = await VerificarIdsBebida(idsBebidas);
    const idsInvalidos = bebidas.filter((b) => !idsBebidasValidas.includes(b.productId));

    if (idsInvalidos.length > 0) {
      throw {
        status: 400,
        message: `IDs de bebidas inválidos: ${idsInvalidos.map((b) => b.productId).join(', ')}`
      };
    }

    const pedidoExiste = await verificarIdPedido(idPedido);
    if (!pedidoExiste) {
      throw { status: 404, message: 'Pedido não encontrado!' };
    }

    const idsJaExistentes = await buscarBebidasNoPedido(idPedido, idsBebidas);

    if (idsJaExistentes.length > 0) {
      throw { status: 400, message: 'Bebida já está no carrinho!' };
    }

    await inserirBebidasPedido(idPedido, bebidas);

    return { message: 'Bebida adicionada ao carrinho com sucesso!' };
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao adicionar bebida ao pedido' };
  }
};

export const deletarPedidoId = async (idPedido: string,token:string) => {
  try {
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Token invalido' };
    }
    if (!idPedido) {
      throw { status: 404, message: 'ID do pedido não fornecido!' };
    }

    const verificarId = await verificarIdPedido(idPedido);

    if (!verificarId) {
      throw { status: 404, message: 'ID do pedido não encontrado!' };
    }

    await deletarPedido(idPedido);

    return 'Pedido deletado com sucesso!';
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao deletar pedido' };
  }
};

export const deletarBebidaPedidoServise = async (idPedido: string, idBebida: string,token:string) => {
  try {
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Token invalido' };
    }
    if (!idPedido || !idBebida) {
      throw { status: 404, message: 'ID do pedido ou da bebida não fornecido!' };
    }

    const verificarPedido = await verificarIdPedido(idPedido);

    if (!verificarPedido) {
      throw { status: 404, message: 'Pedido não encontrado!' };
    }

    const bebidasId = await verificarIDbebidasPedido(idPedido, idBebida);

    if (bebidasId.length === 0) {
      throw { status: 404, message: 'Bebida não encontrada no pedido!' };
    }

    await deletarBebidaPedido(idPedido, idBebida);

    return 'Bebida removida do pedido com sucesso!';
  } catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao remover bebida do pedido' };
  }
};
export const modificarPedido = async (idPedido:string,formaPagamento:string,valorPedido:number,dataPedido:Date,token:string) =>{
  try{
    const tokenData = getTokenData(token);

    if(!tokenData){
      throw { status: 404 , message: 'Token invalido' };
    }

    if (!formaPagamento && !valorPedido && !dataPedido) {
      throw { status: 400, message: 'Campos obrigatórios não preenchidos!' };
    }
        

    const pedidoExiste = await verificarIdPedido(idPedido);
    if (!pedidoExiste) {
      throw { status: 404, message: 'Pedido não encontrado!' };
    }

    const dadosAtualizacao: any = {};
        
    if (formaPagamento) {dadosAtualizacao.dfforma_pagamento = formaPagamento;}
    if (valorPedido) {dadosAtualizacao.dfvalor_pedido = valorPedido;}
    if (dataPedido) {dadosAtualizacao.dfdata_pedido = dataPedido;}

    await alterarPedido(idPedido,dadosAtualizacao);

    return 'pedido atualizado com sucesso.';
  }
  catch (error: any) {
    throw { status: error.status || 500, message: error.message || 'Erro ao buscar pedidos' };
  }
};