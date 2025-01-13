import connection from '../connection';

export const VerificarIdsBebida = async (ids: string[]) => {
  const idsBebidasValidas = await connection('tbbebidas')
    .whereIn('dfid_bebida', ids)
    .select('dfid_bebida'); 
  return idsBebidasValidas.map((bebida) => bebida.dfid_bebida);
};

export const somarBebidas = async (idPedido:string) =>{
  try{
    const resultado = await connection('tbpedido_bebida')
      .sum('(tbbebidas.dfpreco * tbpedido_bebida.dfquantidade) as totalPedido')
      .join('tbbebidas','tbbebidas.dfid_bebida','=','tbpedido_bebida.dfid_bebida')
      .where({ 'tbpedido_bebida.dfid_pedido':idPedido });
        
    const valorTotalBebidas = resultado[0]?.totalPedido || 0;

    return valorTotalBebidas;
  }catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }
};

export const cadastrarNovaBebida = async (idBebida:string,nome:string,descricao:string,preco:number,disponivel:boolean,file:string) =>{
  try{
    await connection('tbbebidas')
      .insert({ 'dfid_bebida': idBebida,
        'dfnome_bebida': nome,
        'dfdescricao_bebida': descricao,
        'dfbebida_disponivel': disponivel,
        'dfpreco': preco,
        'dfcaminho_imagem':`/file/${file}`
      });
  }catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }
};

export const buscarBebidas = async (nomeBebida: string,limit: string,page: string) => {
  try {
    const query = connection('tbbebidas');
    
    if (nomeBebida) {
      query.where('dfnome_bebida', 'like', `%${nomeBebida}%`);
    }
    
    if (limit) {
      query.limit(Number(limit));
    }
    
    // Calcular o offset com base no número da página
    if (page && limit) {
      const offset = Number(limit) * (Number(page) - 1);
      query.offset(offset);
    }

    const bebida = await query;
    return bebida;

  } catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }   
};

export const alterarBebida = async (idBebida: string, dadosAtualizacao: any) => {
  try {
    await connection('tbbebidas')
      .where({ dfid_bebida: idBebida })
      .update(dadosAtualizacao);
  } catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }
};


export const VerificarIdBebida = async (idBebida:string) =>{
  try{
    const verificarId = await connection('tbbebidas')
      .where({ 'dfid_bebida':idBebida });
    return verificarId;

  }catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }
};

export const deletarBebidaPorId = async (id:string) =>{
  try{
    await connection('tbbebidas')
      .where({ 'dfid_bebida': id })
      .delete();

  }catch (error: any) {
    throw new Error(error.message || error.sqlMessage);
  }
};
