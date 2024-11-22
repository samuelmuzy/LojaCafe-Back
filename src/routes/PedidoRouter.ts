import  express  from "express";
import { buscarPedidosCliente, cadastrarPedido } from "../controller/PedidosController";

export const PedidoRouter = express.Router();

PedidoRouter.post("/cadastro",cadastrarPedido);
PedidoRouter.get("/buscarpedido/:idCliente",buscarPedidosCliente)