import { app } from './app'
import { ClienteRouter } from './routes/ClienteRouter'
import { BebidaRouter } from './routes/BebidaRouter'
import { PedidoRouter } from './routes/PedidoRouter';

app.use('/clientes',ClienteRouter);
app.use('/bebidas',BebidaRouter);
app.use('/pedidos',PedidoRouter);




