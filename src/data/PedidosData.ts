import connection from "../connection";

export const pesquisarPedidosCliente = async (idCliente: string) => {
    try {
        const pedidos = await connection("tbpedido")
            .select(
                "tbpedido.dfid_pedido as idPedido",
                "tbpedido.dfid_cliente as idCliente",
                "tbpedido.dfforma_pagamento as formaPagamento",
                connection.raw(`
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'productId', tbpedido_bebida.dfid_bebida,
                            'quantity', tbpedido_bebida.dfquantidade,
                            'nomeBebida', tbbebidas.dfnome_bebida,
                            'caminhoImagem',tbbebidas.dfcaminho_imagem,
                            'valorTotal', tbbebidas.dfpreco * tbpedido_bebida.dfquantidade
                        )
                    ) as bebidas
                `),
                connection.raw(`
                    SUM(tbbebidas.dfpreco * tbpedido_bebida.dfquantidade) as somaTotal
                `)
            )
            .leftJoin("tbpedido_bebida", "tbpedido.dfid_pedido", "=", "tbpedido_bebida.dfid_pedido")
            .leftJoin("tbbebidas", "tbbebidas.dfid_bebida", "=", "tbpedido_bebida.dfid_bebida")
            .where({ "tbpedido.dfid_cliente": idCliente })
            .groupBy("tbpedido.dfid_pedido");

        return pedidos.map((pedido: any) => ({
            idPedido: pedido.idPedido,
            idCliente: pedido.idCliente,
            formaPagamento: pedido.formaPagamento,
            somaTotal: pedido.somaTotal,
            bebidas: JSON.parse(pedido.bebidas || "[]"),
        }));

    }catch(error:any){
        throw new Error(error.message || error.sqlMessage);
    }
}

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

export const inserirBebidasPedido = async (idPedido: string, bebidas: { productId: string, quantity: number }[]) => {
    try {
        const bebidasInseridas = bebidas.map(bebida => ({
            dfid_pedido: idPedido,
            dfid_bebida: bebida.productId,
            dfquantidade: bebida.quantity
        }));

        await connection("tbpedido_bebida").insert(bebidasInseridas);
    } catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
};

export const buscarPedidos = async () =>{
    try {
        const pedidos = await connection("tbpedido")
        .select(
            "tbpedido.dfid_pedido as idPedido",
            "tbpedido.dfid_cliente as idCliente",
            "tbpedido.dfforma_pagamento as formaPagamento",
            "tbpedido.dfvalor_pedido as valorPedido",
            "tbpedido.dfdata_pedido as dataPedido",
            connection.raw(`
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'productId', tbpedido_bebida.dfid_bebida,
                        'quantity', tbpedido_bebida.dfquantidade
                    )
                ) as bebidas
            `)
        )
        .leftJoin("tbpedido_bebida", "tbpedido.dfid_pedido", "=", "tbpedido_bebida.dfid_pedido")
        .groupBy("tbpedido.dfid_pedido");

    return pedidos.map((pedido: any) => ({
        idPedido: pedido.idPedido,
        idCliente: pedido.idCliente,
        dataPedido: pedido.dataPedido,
        formaPagamento: pedido.formaPagamento,
        valorPedido: pedido.valorPedido,
        bebidas: JSON.parse(pedido.bebidas || "[]"),
    }));
    } catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}

export const deletarPedido = async (idPedido:string) =>{
    try{
        await connection("tbpedido")
        .where({'tbpedido.dfid_pedido':idPedido})
        .delete();
        
    }catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}

export const verificarIdPedido = async (idPedido:string) =>{
    try{
        const [pedido] = await connection("tbpedido")
        .where({'tbpedido.dfid_pedido':idPedido})
        return pedido;
    }catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}

export const verificarClientePedido = async (idCliente:string) =>{
    try{
        const [cliente] = await connection('tbpedido')
        .where({'dfid_cliente':idCliente});
        return cliente;

    }catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}

export const buscarBebidasNoPedido = async (idPedido: string, idsBebidas: string[]) => {
    try {
        const bebidasExistentes = await connection("tbpedido_bebida")
            .select("dfid_bebida")
            .where("dfid_pedido", idPedido)
            .andWhere(builder => builder.whereIn("dfid_bebida", idsBebidas));
        
        return bebidasExistentes.map(bebida => bebida.dfid_bebida); // Retorna apenas os IDs das bebidas
    } catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
};

export const verificarIDbebidasPedido = async (idPedido: string, idBebida:string) =>{
    try{
        const verificarId = await connection("tbpedido_bebida")
        .where({"dfid_pedido":idPedido})
        .andWhere({"dfid_bebida":idBebida})
        return verificarId;
    }catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}



export const deletarBebidaPedido = async (idPedido: string, idBebida:string) =>{
    try{
        await connection("tbpedido_bebida")
        .where({"dfid_pedido":idPedido})
        .andWhere({"dfid_bebida":idBebida})
        .delete();
        
    }catch (error: any) {
        throw new Error(error.message || error.sqlMessage);
    }
}


