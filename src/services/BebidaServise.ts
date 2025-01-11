import { v7 } from "uuid";
import { alterarBebida, buscarBebidas, cadastrarNovaBebida, deletarBebidaPorId, VerificarIdBebida } from '../data/BebidaData'
import { getTokenData } from "../middlewares/Authenticator";

export const cadastroBebidas = async (nome: string, descricao: string, preco: number, disponivel: boolean, file: string, token: string) => {
    try { 
        const idBebida = v7()

        const tokenData = getTokenData(token);

        if (!tokenData) {
            throw { status: 404, message: "Token invalido" }
        }

        if (!nome || !descricao || !preco || disponivel === undefined || !file) {
            throw { status: 400, message: "Campo faltando" };
        }

        await cadastrarNovaBebida(idBebida, nome, descricao, preco, disponivel, file);
        return "Bebida cadastrada com sucesso";
    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao cadastrar bebida" };
    }
};

export const exibirBebidas = async (nomeBebida: string, limit: string, page: string) => {
    try {
        const limitValid = limit || "";
        const offsetValid = page || "";

        const bebidas = await buscarBebidas(nomeBebida || '', limitValid, offsetValid);

        if (nomeBebida && bebidas.length === 0) {
            throw { status: 404, message: "Bebida não encontrada!" };
        }

        if (bebidas.length === 0) {
            throw { status: 404, message: "Sem bebidas!" };
        }

        return bebidas;
    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao buscar bebidas" };
    }
};

export const deletarBebidaNova = async (idBebida: string, token: string) => {
    try {

        const tokenData = getTokenData(token);

        if (!tokenData) {
            throw { status: 404, message: "Token invalido" }
        }
        if (!idBebida) {
            throw { status: 400, message: "Campo faltando" };
        }
        const idsBebidasValidas = await VerificarIdBebida(idBebida);

        if (idsBebidasValidas.length === 0) {
            throw { status: 404, message: "Bebida não encontrada!" };
        }

        await deletarBebidaPorId(idBebida);

        return "Bebida deletada com sucesso";
    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao deletar bebida" };
    }
};

export const alterarBebidaServise = async (
    idBebida: string,
    nome: string,
    descricao: string,
    preco: number,
    disponivel: boolean,
    file: string,
    token: string
) => {
    try {
        const tokenData = getTokenData(token);

        if (!tokenData) {
            throw { status: 404, message: "Token invalido" }
        }

        if (!nome && !descricao && !preco && !disponivel && !file) {
            throw { status: 400, message: "Campo faltando" };
        }

        const idsBebidasValidas = await VerificarIdBebida(idBebida);

        if (idsBebidasValidas.length === 0) {
            throw { status: 404, message: "Bebida não encontrada!" };
        }

        const dadosAtualizacao: any = {};
        if (nome) dadosAtualizacao.dfnome_bebida = nome;
        if (descricao) dadosAtualizacao.dfdescricao_bebida = descricao;
        if (preco) dadosAtualizacao.dfpreco = preco;
        if (disponivel !== undefined) dadosAtualizacao.dfbebida_disponivel = disponivel;
        if (file) dadosAtualizacao.dfcaminho_imagem = `/file/${file}`;

        await alterarBebida(idBebida, dadosAtualizacao);

        return "Bebida alterada com sucesso";
    } catch (error: any) {
        throw { status: error.status || 500, message: error.message || "Erro ao alterar bebida" };
    }
};