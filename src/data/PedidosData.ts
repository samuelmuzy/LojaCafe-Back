import connection from "../connection";

export const pesquisarPedidosCliente = async (id: string) => {
    try {
       
        const pedidos = await connection("tbpedido")
            .select(
                "tbpedido.dfid_cliente as idCliente",
                "tbpedido.dfforma_pagamento as formaPagamento",
                "tbpedido.dfvalor_pedido as valorPedido",
                connection.raw("GROUP_CONCAT(tbpedido_bebida.dfid_bebida) as bebidas")
            )
            .join("tbpedido_bebida", "tbpedido.dfid_pedido", "=", "tbpedido_bebida.dfid_pedido")
            .where({ "tbpedido.dfid_cliente": id })
            .groupBy("tbpedido.dfid_pedido");

        return pedidos.map((pedido: any) => ({
            idCliente: pedido.idCliente,
            formaPagamento: pedido.formaPagamento,
            valorPedido: pedido.valorPedido,
            bebidas: pedido.bebidas ? pedido.bebidas.split(",") : [],
        }));
    } catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
};

export const inserirPedidos = async (id:string,dataPedido:Date,formaPagamento:string,valorPedido:number,clienteId:string) =>{
    try{
        await connection("tbpedido")
        .insert({
            "dfid_pedido":id,
            "dfdata_pedido":dataPedido,
            "dfforma_pagamento":formaPagamento,
            "dfvalor_pedido":valorPedido,
            "dfid_cliente":clienteId
        })

    }catch(error:any){
        throw new Error(error.message || error.sqlMessage);
    }
}

export const inserirBebidasPedido = async (idPedido: string, idBebida: string[]) => {
    try {
        const bebidasInseridas = idBebida.map(bebidaId => ({
            dfid_pedido: idPedido,
            dfid_bebida: bebidaId
        }));
        await connection("tbpedido_bebida").insert(bebidasInseridas);
    } catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
};

