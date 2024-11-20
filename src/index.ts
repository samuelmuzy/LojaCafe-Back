import { app } from './app'
import { ClienteRouter } from './routes/ClienteRouter'
import { BebidaRouter } from './routes/BebidaRouter'

app.use('/clientes',ClienteRouter);
app.use('/bebidas',BebidaRouter);



