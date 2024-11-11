import { userType } from "./roleUsuario"

export type typeUsuario={
    id:string,
    nome:string,
    email:string,
    telefone:string,
    senha: string,
    role: userType
}