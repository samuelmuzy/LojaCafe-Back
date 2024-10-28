import express, { Request,Response } from 'express'
import cors from 'cors'
import connection from './connection'
import {generateToken,getTokenData} from './Authenticator'
import { v7 } from 'uuid';

const app = express();

app.use(express.json());
app.use(cors());

//endpoint clientes
app.get('/clientes',async (req:Request,res:Response)=>{
    try{
        const clientes = await connection('tbcliente');

        res.status(200).send(clientes);

    }catch(error:any){ 
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})

app.post('/clientes/login',async (req:Request,res:Response)=>{
    const { email, nome } = req.body;

    try{

        if (!email || !nome) {
            res.status(400)
            throw new Error("Campo faltando");
        }

        const [usuario] = await connection('tbcliente')
        .where({
            'dfemail_cliente':email,
            'dfnome_cliente':nome
        })

        if(!usuario){
            res.status(401)
            throw new Error("credenciais invalidas")
        }
        
        res.status(200).send({token: generateToken({ id: usuario.dfid_cliente }) })

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
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
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})
//pesquisar por id
app.get('/clientes/:id',async (req:Request,res:Response)=>{
    const {id} = req.params

    try{
        const clientes = await connection('tbcliente')
        .where({'dfid_cliente':id})

        res.status(200).send(clientes);

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})
//alterar usuarios
app.put('/clientes/:idusuario',async (req:Request,res:Response)=>{
    
    const {nome,telefone,email} = req.body;
    const {idusuario} = req.params;

    const tokenData = getTokenData(req.headers.authorization!)

    try{
        
        if(!tokenData){
            res.status(401)
            throw new Error("Token invalido")
        }

        if(!nome && !telefone && !email){
            res.status(402) 
            throw Error("Adicione um campo!");
        }

        const verificarUsuario = await connection('tbcliente')
        .where({'dfid_cliente':idusuario})

        if(verificarUsuario.length === 0){
            res.status(404);
            throw Error("Id não encontrado");
        }

        await connection('tbcliente')
        .update({
            'dfnome_cliente':nome,
            'dftelefone_cliente':telefone,
            'dfemail_cliente':email
        })
        .where({'dfid_cliente':idusuario})

        res.status(200).send("Cadastro alterado com sucesso!");

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
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

    const tokenData = getTokenData(req.headers.authorization!)
    
    try{
        if(!tokenData){
            res.status(401)
            throw new Error("Token invalido")
        }
        
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