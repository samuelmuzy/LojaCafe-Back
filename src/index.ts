import express, { Request,Response } from 'express'
import cors from 'cors'
import connection from './connection'
import { v4 } from 'uuid';

const app = express();

app.use(express.json());
app.use(cors());

//endpoint clientes
app.get('/clientes',async (req:Request,res:Response)=>{
    try{
        const clientes = await connection('clientes');
        
        res.status(200).send(clientes);

    }catch(erro){
        console.log(erro);
    }
})
//cliente por nome
app.get('/clientes',async (req:Request,res:Response)=>{
    const {nome} = req.query
    try{
        const clientes = await connection('clientes')
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
    
    const id = v4();
    
    try{
        if(!nome || !telefone || !email){
            throw Error("Campo faltando")
        }
        await connection('clientes')
        .insert({
            'id_cliente':id,
            'nome_cliente':nome,
            'telefone':telefone,
            'email':email
        })
        
        res.status(201).send('Cliente cadastrado com sucesso!');

    }catch(error:any){
        console.log(error.sqlMessage || error.message)
        res.status(400).send(error.message)
    }
})
//deletar cliente
app.delete('/clientes/:idCliente',async (req:Request,res:Response)=>{
    const {idCliente} = req.params;
    
    try{
        const usuarioExiste = await connection('clientes')
        .where({'id_cliente':idCliente})
        .delete();

        if(usuarioExiste === 0){
            throw Error("user não encontrado");
        }

        res.status(200).send('Cliente deletado com sucesso!')



    }catch(error:any){
        console.log(error.sqlMessage || error.message)
        res.status(400).send(error.message)
    }
})

app.listen(3003, () => {
    console.log('Vamos Rodar');
    
})