import { alterarUsuarios, cadastro, excluirCliente, login, procurarIdCliente, procurarUsuarios } from "../services/clienteService"
import express, { Request,Response } from 'express'

    export const cadastrar = async (req:Request,res:Response) =>{
        try{
            const {nome,telefone,email,senha} = req.body;
            const token = await cadastro(nome,email,telefone,senha)
            res.status(201).send(token);
            
        }catch (error: any) {
            res.status(error.status).send(error.sqlMessage || error.message);
        }
    }

    export const logar = async (req:Request,res:Response) =>{
        try{
            const {email,senha} = req.body;
            const token = await login(email,senha);
            res.json({ token });
        }catch (error: any) {
            res.status(error.status).send(error.sqlMessage || error.message);
        }
    }

    export const buscarCliente = async (req: Request, res: Response) => {
        const { nome } = req.query;
    
        try {
    
            const user = await procurarUsuarios(typeof nome === 'string' ? nome : '');
            res.status(200).send(user);
        } catch (error: any) {
            res.status(error.status).send(error.sqlMessage || error.message);
        }
    };

    export const buscarClientePorId = async (req:Request , res:Response) =>{
        const { id } = req.params;
        try{

            const user = await procurarIdCliente(id);
            res.status(200).send(user);
            
        }catch (error: any) {
            res.status(error.status).send(error.sqlMessage || error.message);
        }
    }

    export const alterarCliente = async (req:Request,res:Response) =>{
            const { id } = req.params;
            const { nome, telefone, email, senha } = req.body;
            const token  = req.headers.authorization!;

            try{
                const user = await alterarUsuarios(id,token,nome,email,telefone,senha)
                res.status(200).send(user);
            }catch (error: any) {
                res.status(error.status).send(error.sqlMessage || error.message);
            }
    }

    export const deletarUsuario = async (req:Request,res:Response) =>{
        const { id } = req.params;
        const token  = req.headers.authorization!

        try{
            const user = await excluirCliente(id,token);
            res.status(200).send(user);
        }catch (error: any) {
            res.status(error.status).send(error.sqlMessage || error.message);
        }
    }
    
 
    
