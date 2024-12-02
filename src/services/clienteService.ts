import {buscarClientes, buscarEmailCliente,cadastrarCliente,buscarIdCliente, deletarCliente, alterarCliente} from "../data/ClientData";
import { v7 } from "uuid";
import { generateToken, getTokenData} from "../middlewares/Authenticator";
import { userType } from "../types/roleUsuario";
import { comparePassword, hashPassword } from "../middlewares/hash";
//post
export const cadastro = async (nome: string, email: string, telefone: string, senha: string) => {
    try {
        // Validações
        if (!nome || !telefone || !email || !senha) {
            throw { status: 400, message: "Campo faltando" };  
        }
        if (typeof senha !== "string") {
            throw { status: 400, message: "A senha deve ser uma string." };  
        }

        // Verifica se o usuário já existe
        const user = await buscarEmailCliente(email);

        if (user) {
            throw { status: 409, message: "Usuário já cadastrado" }; 
        }

        const senhaHash = await hashPassword(senha);

        
        const id = v7();
        const role = userType.USER;

        await cadastrarCliente(id, nome, email, telefone, senhaHash, role);

        return "Usuário cadastrado com sucesso" ;  // Retornando status 201 para sucesso

    } catch (error: any) {

        throw { status: error.status || 500, message: error.message || "Erro ao realizar o cadastro" };
    }
};

export const login = async (email: string, senha: string) => {
    try {
        if (!email || !senha) {
            throw { status: 400, message: "Campos faltando!" };
        }

        const user = await buscarEmailCliente(email);

        if (!user) {
            throw { status: 404, message: "Email não encontrado!" };
        }

        const senhaCorreta = await comparePassword(senha, user.dfsenha_cliente);

        if (!senhaCorreta) {
            throw { status: 401, message: "Senha incorreta!" };  
        }

        const token = generateToken({ id: user.dfid_cliente, role: user.dfuser_role });
        return token;  

    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o login" };
    }
};
//get
export const procurarUsuarios = async (nome: string) => {
    try {
        const users = await buscarClientes(nome || '');
        
        if(nome){
            if(users.length === 0){
                throw { status: 404, message: "Usuario não encontrado!"} 
            }
        }
        return users;
    } catch (error: any) {
        throw new Error(error.message || "Erro ao buscar usuários");
    }
};

export const procurarIdCliente = async (id:string) =>{
    try{
        if(!id){
            throw {status: 400 , message: "Campo não prenchido!"}
        }
        const verificarId = await buscarIdCliente(id);

        if(verificarId.length === 0){
            throw { status: 404, message: "Id não encontrado!"}
        }
        return verificarId;
    
    
    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o login" };
    }
}
//update
export const alterarUsuarios = async (id: string,token: string,nome: string,email: string,telefone: string,senha: string) =>{
    try{
        const tokenData = getTokenData(token);

        if(!id){
            throw {status: 400 , message: "Campo não prenchido!"}
        }

        const verificarId = await buscarIdCliente(id);

        if(!verificarId){
            throw { status: 404, message: "Id não encontrado!"}
        }
        
        if (!nome && !telefone && !email && !senha) {
            throw {status: 400 , message: "Adicione ao menos um campo para alterar."}
        }

        const dadosAtualizacao: any = {};
        
        if (nome) dadosAtualizacao.dfnome_cliente = nome;
        if (telefone) dadosAtualizacao.dftelefone_cliente = telefone;
        if (email) dadosAtualizacao.dfemail_cliente = email;

        if (senha) {
            if (typeof senha !== 'string') {
                throw {status: 400 , message:"A senha deve ser uma string."};
            }
            dadosAtualizacao.dfsenha_cliente = await hashPassword(senha);
        }

        if(!tokenData){
            throw {status: 404 , message: "Token invalido"}
        }
        const verificarEmail = await buscarEmailCliente(email);

        if (verificarEmail) {
            throw { status: 409, message: "Email já existe" }; 
        }
        
        await alterarCliente(id,dadosAtualizacao);

        return "Usuário alterado com sucesso"

    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o login" };
    }
}
//delete
export const excluirCliente = async (id:string,token:string) =>{
    try{
        const tokenData = getTokenData(token);

        if(!id){
            throw {status: 400 , message: "Campo não prenchido!"}
        }
        if(!tokenData){
            throw {status: 404 , message: "Token invalido"}
        }

        const verificarId = await buscarIdCliente(id);

        if(!verificarId){
            throw { status: 404, message: "Id não encontrado!"}
        }

        await deletarCliente(id);

        return "Usuário deletado com sucesso";

    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao realizar o login" };
    }
}

