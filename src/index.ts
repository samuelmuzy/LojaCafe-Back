import express, { Request,Response } from 'express'
import cors from 'cors'
import connection from './connection'
import {generateToken,getTokenData} from './middlewares/Authenticator'
import { hashPassword,comparePassword } from './middlewares/hash'
import v7 from './middlewares/uuid';

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
//login
app.post('/clientes/login', async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            res.status(400);
            throw new Error("Campo faltando");
        }

        const [usuario] = await connection('tbcliente')
            .where({ 'dfemail_cliente': email });

        if (!usuario) {
            res.status(401);
            throw new Error("Email inválido");
        }

        const isMatch = await comparePassword(senha, usuario.dfsenha_cliente);

        if (!isMatch) {
            res.status(401);
            throw new Error("Senha inválida");
        }

        const token = generateToken({ id: usuario.dfid_cliente });
        res.status(200).send({ token });

    } catch (error: any) {
        const message = error.sqlMessage || error.message;
        res.status(400).send(message);
    }
});

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
app.put('/clientes/:id',async (req:Request,res:Response)=>{
    
    const {nome,telefone,email,senha} = req.body;
    const {id} = req.params;

    const tokenData = getTokenData(req.headers.authorization!)

    try{
        
        if(!tokenData){
            res.status(401)
            throw new Error("Token invalido")
        }

        if(!nome && !telefone && !email && !senha){
            res.status(402) 
            throw Error("Adicione um campo!");
        }

        const verificarUsuario = await connection('tbcliente')
        .where({'dfid_cliente':id})

        if(verificarUsuario.length === 0){
            res.status(404);
            throw Error("Id não encontrado");
        }

        /*if(tokenData.id != id && tokenData.role != admin){
            ("Voce nao tem permissão para alterar do usuario")
        }*/

        await connection('tbcliente')
        .update({
            'dfnome_cliente':nome,
            'dftelefone_cliente':telefone,
            'dfemail_cliente':email,
            'dfsenha_cliente':senha
        })
        .where({'dfid_cliente':id})

        res.status(200).send("Cadastro alterado com sucesso!");

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }

})
//cadastro de cliente
app.post('/clientes',async (req:Request,res:Response)=>{
    const {nome,telefone,email,senha} = req.body;

    const hashedPassword = await hashPassword(senha);

    const id = v7(); // usar v7
    
    try{
        if(!nome || !telefone || !email || !senha){
            res.status(401);
            throw Error("Campo faltando")
        }

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
            'dfemail_cliente':email,
            'dfsenha_cliente':hashedPassword
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
        
        
        if(usuarioExiste.length === 0){
            res.status(404);
            throw Error("user não encontrado");   
        }
        
        await connection('tbcliente')
        .where({'dfid_cliente':idCliente})
        .delete()

        res.status(200).send('Cliente deletado com sucesso!')

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})
//Bebidas
app.get('/bebidas',async (req:Request,res:Response)=>{
    try{
        const bebidas = await connection('tbcliente');

        res.status(200).send(bebidas);

    }catch(error:any){ 
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})



app.listen(3003, () => {
    console.log('Vamos Rodar');
    
})