import { userType } from './roleUsuario';

export interface typeUsuario {
    id:string,
    nome:string,
    email:string,
    telefone:string,
    senha: string,
    role: userType
}