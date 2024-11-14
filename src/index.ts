import express, { Request,Response } from 'express'
import cors from 'cors'
import connection from './connection'
import {generateToken,getTokenData} from './middlewares/Authenticator'
import { hashPassword,comparePassword } from './middlewares/hash'
import v7 from './middlewares/uuid';
import { typeUsuario } from './middlewares/types/typeUsuario'
import { userType } from './middlewares/types/roleUsuario'

const app = express();

app.use(express.json());
app.use(cors());

//cliente por nome
app.get('/clientes',async (req:Request,res:Response)=>{
    const {nome} = req.query
    try{
        if(nome){
            const clientes = await connection('tbcliente')
            .where({'dfnome_cliente':nome})

            if(clientes.length === 0){
                res.status(400)
                throw new Error("Usuário não encontrado!")
            }

            res.status(200).send(clientes);
        }else{
            const clientes = await connection('tbcliente');

            res.status(200).send(clientes);
        }
        
    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})
//pesquisar por id
app.get('/clientes/buscar/:id',async (req:Request,res:Response)=>{
    const {id} = req.params

    try{

        const clientes = await connection('tbcliente')
        .where({'dfid_cliente':id})

        if(clientes.length === 0){
            res.status(400)
            throw new Error("Cliente não encontrado")
        }

        res.status(200).send(clientes);

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})

// Alterar usuário
app.put('/clientes/:id', async (req: Request, res: Response) => {
    const { nome, telefone, email, senha } = req.body;
    const { id } = req.params;

    const tokenData = getTokenData(req.headers.authorization!);

    try {
        // Verifica token
        if (!tokenData) {
            res.status(401);
            throw new Error("Token inválido");
        }

        // Verifica se ao menos um campo foi fornecido
        if (!nome && !telefone && !email && !senha) {
            res.status(400);
            throw new Error("Adicione ao menos um campo para alterar.");
        }

        // Verifica se o usuário existe
        const verificarUsuario = await connection('tbcliente')
            .where({ 'dfid_cliente': id });

        if (verificarUsuario.length === 0) {
            res.status(404);
            throw new Error("Id não encontrado");
        }

        const verificarEmail = await connection('tbcliente')
        .where({'dfemail_cliente':email})

        if (verificarEmail.length > 0) {
            res.status(401)
            throw Error("Email ja cadastrado");
        }

        // Prepara dados para atualização
        const dadosAtualizacao: any = {};
        
        if (nome) dadosAtualizacao.dfnome_cliente = nome;
        if (telefone) dadosAtualizacao.dftelefone_cliente = telefone;
        if (email) dadosAtualizacao.dfemail_cliente = email;
        
        // Criptografa a senha se fornecida
        if (senha) {
            if (typeof senha !== 'string') {
                res.status(400);
                throw new Error("A senha deve ser uma string.");
            }
            dadosAtualizacao.dfsenha_cliente = await hashPassword(senha);
        }

        // Atualiza o usuário
        await connection('tbcliente')
            .update(dadosAtualizacao)
            .where({ 'dfid_cliente': id });

        res.status(200).send("Cadastro alterado com sucesso!");

    } catch (error: any) {
        const message = error.sqlMessage || error.message;
        res.status(400).send(message);
    }
});

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

        const token = generateToken({ id: usuario.dfid_cliente ,role: usuario.dfuser_role});
        res.status(200).send({ token });

    } catch (error: any) {
        const message = error.sqlMessage || error.message;
        res.status(400).send(message);
    }
});

//cadastro de cliente
app.post('/clientes',async (req:Request,res:Response)=>{
    const {nome,telefone,email,senha} = req.body;

    const id = v7();// usar v7
    
    try{
        if(!nome || !telefone || !email || !senha){
            res.status(401);
            throw Error("Campo faltando")
        }
        if (typeof senha !== 'string') {
            res.status(400);
            throw new Error("A senha deve ser uma string.");
        }
        
        const hashedPassword = await hashPassword(senha);
        
        const verificarEmail = await connection('tbcliente')
        .where({'dfemail_cliente':email})

        if (verificarEmail.length > 0) {
            res.status(401)
            throw Error("Email ja cadastrado");
        }

        //type para verificar se esta correto os tipos 
        const novoUsuario : typeUsuario = {
            id: id,
            nome : nome,
            telefone : telefone,
            email : email,
            role: userType.ADMIN,
            senha: hashedPassword
        } 
        
        await connection('tbcliente')
        .insert({
            'dfid_cliente':novoUsuario.id,
            'dfnome_cliente':novoUsuario.nome,
            'dftelefone_cliente':novoUsuario.telefone,
            'dfemail_cliente':novoUsuario.email,
            'dfuser_role':novoUsuario.role,
            'dfsenha_cliente':novoUsuario.senha
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
    const {nome} = req.query
    try{
        if(nome){
            const bebidas = await connection('tbbebidas')
            .where({'dfnome_bebida':nome})

            if(bebidas.length === 0){
                res.status(400)
                throw new Error("Bebida não encontrada!")
            }

            res.status(200).send(bebidas);
        }else{
            const bebidas = await connection('tbbebidas');

            res.status(200).send(bebidas);
        }


    }catch(error:any){ 
        const message = (error.sqlMessage || error.message)
        res.send(message)
    }
})

app.post('/bebidas',async (req:Request,res:Response)=>{
    const {nome,descricao,disponivel,preco} = req.body;
    
    const tokenData = getTokenData(req.headers.authorization!)

    const id = v7()
    
    try{
        if(!tokenData){
            res.status(401);
            throw new Error("Token invalido");
        }

        if(!nome || !descricao || !disponivel || !preco){
            res.status(400);
            throw new Error("Campo faltando!")
        }
        
        await connection('tbbebidas')
        .insert({
            'dfid_bebida':id,
            'dfnome_bebida':nome,
            'dfdescricao_bebida':descricao,
            'dfbebida_disponivel':disponivel,
            'dfpreco':preco
        })
        res.status(201).send("Bebida cadastrada com sucesso");

    }catch(error:any){
        const message = (error.sqlMessage || error.message)
        res.send(message);
    }
})

app.listen(3003, () => {
    console.log('Vamos Rodar');
});