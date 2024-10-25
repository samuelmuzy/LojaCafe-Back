import express, { Request,Response } from 'express'
import cors from 'cors'
import connection from './connection'
import { v7 } from 'uuid';

const app = express();

app.use(express.json());
app.use(cors());

//endpoint clientes
app.get('/clientes',async (req:Request,res:Response)=>{
    try{
        const clientes = await connection('tbcliente');

        res.status(200).send(clientes);

    }catch(erro){
        console.log(erro);
    }
})
//cliente por nome
app.get('/clientes',async (req:Request,res:Response)=>{
    const {nome} = req.query
    try{
        const clientes = await connection('tbcliente')
        .where({'nome_cliente':nome})

        res.status(200).send(clientes);

    }catch(error:any){
        console.log(error.message)
        res.status(400).send(error)
    }
})
//cadastro de cliente
app.post('/clientes',async (req:Request,res:Response)=>{
    const {nome,telefone,email} = req.body;
    
    const id = v7(); // usar v7
    
    try{
        if(!nome || !telefone || !email){
            res.status(401);
            throw Error("Campo faltando")
        }

        //todo: verificar se email/cadastro já existe, se existe retornar tratamento
        const verificarEmail = await connection('tbcliente')
        .where({'dfemail_cliente':email})

        if (verificarEmail.length > 0) {
            res.status(401)
            throw Error("Email ja cadastrado");
        }
        
        await connection('tbcliente')
        .insert({
            'dfid_cliente':id,
            'dfnome_cliente':nome,
            'dftelefone_cliente':telefone,
            'dfemail_cliente':email
        })
        
        res.status(201).send('Cliente cadastrado com sucesso!');

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})
//deletar cliente
app.delete('/clientes/:idCliente',async (req:Request,res:Response)=>{
    const {idCliente} = req.params;
    
    try{
        const usuarioExiste = await connection('tbcliente')
        .where({'dfid_cliente':idCliente})
        .delete()
        if(!usuarioExiste){
            throw Error("user não encontrado");   
        }
        
        res.status(200).send('Cliente deletado com sucesso!')

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})

app.listen(3003, () => {
    console.log('Vamos Rodar');
    
})