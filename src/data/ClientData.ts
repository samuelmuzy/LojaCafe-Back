import connection from "../connection";

export const buscarClientes = async (nome: string) => {
    try {
        const query = connection("tbcliente");
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
        const [user] = await connection("tbcliente").where({ dfemail_cliente: email });
        return user;
    } catch (error: any) {
        throw new Error(error.sqlMessage || error.message);
    }
};

export const buscarIdCliente = async (id: string) => {
    try {
        const verificarUsuario = await connection("tbcliente").where({ dfid_cliente: id });
        
        if(verificarUsuario.length === 0){
            return null
        }

        return verificarUsuario;
    } catch (error: any) {
        throw new Error(error.sqlMessage || error.message);
    }
};

export const cadastrarCliente = async (id: string,nome: string,email: string,telefone: string,senha: string,role: string) => {
    try {
        await connection("tbcliente").insert({
            dfid_cliente: id,
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

export const alterarCliente = async (id: string, dadosAtualizacao: any) => {
    try {
        await connection("tbcliente")
            .update(dadosAtualizacao)
            .where({'dfid_cliente': id});
    } catch (error: any) {
        throw new Error(error.sqlMessage || error.message);
    }
}

export const deletarCliente = async (id:string) =>{
    try{
        await connection("tbcliente")
        .where({'dfid_cliente':id})
        .delete()
    } catch (error: any) {
        throw new Error(error.sqlMessage || error.message);
    }
}
