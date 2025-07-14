import { request, response } from 'express';
import { app } from '../src/app';
import axios from 'axios'
import connection from '../src/connection';
import { buscarEmailCliente, deletarCliente } from '../src/data/ClientData';
import { cadastro, procurarUsuarios } from '../src/services/clienteService';
import * as http from 'http';

describe('Teste inicial' , () =>{
  it('ver se e verdadeiro' , () =>{
    expect(true).toBe(true);
  });
});
let server: http.Server;
describe("teste" , () =>{

  beforeAll(() => {
    server = app.listen(3003); // Inicializa o servidor antes dos testes
  });
  
  afterAll(() => {
    server.close(); // Fecha o servidor depois dos testes
  });
  test('GET /bebidas - Deve listar bebidas', async () => {
    
    const response = await axios.get("http://localhost:3003/bebidas")
      
    
    expect(response.status).toBe(200);
    expect(response.data).toBeInstanceOf(Array); // Verifica se é um array
  });
})

describe('teste de integração', () =>{
  afterAll(async ()=>{
    const email = await buscarEmailCliente('samuelmuzy@gmail.com');
    // Verifica se o email foi encontrado antes de tentar deletar o cliente
    if (email && email.dfid_cliente) {
      await deletarCliente(email.dfid_cliente);
    }
    await connection.destroy();
  });

  it('Faltando campo' , async () =>{
    try{
      await cadastro(
        '',
        'samuelmuzy@gmail.com',
        '121313133',
        '123123131'
      );
    
      const email = await buscarEmailCliente('samuelmuzy@gmail.com');
      expect(email).toBeNull();

    }catch(error:any){
      expect(error.message).toBe('Campo faltando');
      expect(error.status).toBe(400);
    }

});

  it('Sucesso' ,async () =>{
    try{
      const user = await cadastro(  
        'sssss',
        'samuelmuzy@gmail.com',
        '122233',
        '123123131'
      );
      expect(user).toBe('Usuário cadastrado com sucesso');
      

    }catch(error:any){
            
    }
  });
});

jest.mock('../src/data/ClientData', () => ({
  buscarEmailCliente: jest.fn(),
}));

describe('Testando mockResolvedValue', () => {
  it('deve retornar um cliente com sucesso', async () => {
    // Definindo o comportamento do mock para simular uma resposta bem-sucedida

    const cliente = await buscarEmailCliente('npm');
        
    // Verificando se o valor retornado pela Promise é o esperado
    expect(cliente).toBe;
  });
});