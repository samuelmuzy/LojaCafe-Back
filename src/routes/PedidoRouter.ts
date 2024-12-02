import  express  from "express";
import { buscarPedidos, buscarPedidosCliente, cadastrarNovaBebidaPedido, cadastrarPedido, deletarBebidaNoPedido, deletarPedidos,atualizarPedido } from "../controller/PedidosController";

export const PedidoRouter = express.Router();

PedidoRouter.post("/cadastro",cadastrarPedido);
PedidoRouter.post('/cadastrar/NovaBebida',cadastrarNovaBebidaPedido);

PedidoRouter.get("/buscarpedido/:idCliente",buscarPedidosCliente);
PedidoRouter.get('/buscarTodosPedidos',buscarPedidos);

PedidoRouter.delete('/:idPedido',deletarPedidos);
PedidoRouter.delete('/deletarbebida/:idPedido/:idBebida', deletarBebidaNoPedido);
PedidoRouter.put('/:idPedido',atualizarPedido);