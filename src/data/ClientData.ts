import connection from '../connection';

export const buscarClientes = async (nome: string) => {
  try {
    const query = connection('tbcliente');
    if (nome) {
      query.where('dfnome_cliente', 'like', `%${nome}%`);
    }
    const users = await query;
    return users;
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};

export const buscarEmailCliente = async (email: string) => {
  try {
    const [user] = await connection('tbcliente').where({ dfemail_cliente: email });
    return user;
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};

export const buscarIdCliente = async (idCliente: string) => {
  try {
    const verificarUsuario = await connection('tbcliente').where({ dfid_cliente: idCliente });
    
    return verificarUsuario;
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};

export const cadastrarCliente = async (idCliente: string,nome: string,email: string,telefone: string,senha: string,role: string) => {
  try {
    await connection('tbcliente').insert({
      dfid_cliente: idCliente,
      dfnome_cliente: nome,
      dftelefone_cliente: telefone,
      dfemail_cliente: email,
      dfuser_role: role,
      dfsenha_cliente: senha,
    });
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};

export const alterarCliente = async (idCliente: string, dadosAtualizacao: any) => {
  try {
    await connection('tbcliente')
      .update(dadosAtualizacao)
      .where({ 'dfid_cliente': idCliente });
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};

export const deletarCliente = async (idCliente:string) =>{
  try{
    await connection('tbcliente')
      .where({ 'dfid_cliente':idCliente })
      .delete();
  } catch (error: any) {
    throw new Error(error.sqlMessage || error.message);
  }
};
