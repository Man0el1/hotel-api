import express from 'express';
const route = express.Router();

//controllers
import { registerAccount } from './controllers/registerController.js'
import { accountExists } from './controllers/loginController.js'
import { getProfileInfo } from './controllers/perfilController.js'
import { getAvalibility } from './controllers/reservaController.js'
import { createPreConfirmation } from './controllers/reservaController.js'
import { getCurrentDate } from './controllers/dataController.js'
import { getReservaInfo, submitReserva } from './controllers/confirmarReservaController.js'
import { xxx } from './controllers/cancelarReservaController.js'

//middlewares
import { verifyToken } from './middlewares/verifyToken.js';
import { blockLoggedIn } from './middlewares/blockLoggedIn.js';
import { get } from 'http';

//routes
//route.get('/', )

route.post('/login/entry', blockLoggedIn, accountExists);

route.post('/register/create', blockLoggedIn, registerAccount);

route.post('/reserva/disponibilidade', getAvalibility);

route.post('/reserva/pre-confirmacao', verifyToken, createPreConfirmation);

route.get('/perfil', verifyToken, getProfileInfo);

route.post('/cancelar-reserva', verifyToken, xxx)

route.get('/dataAtual', getCurrentDate);

route.get('/confirmar-reserva/:idReserva', verifyToken, getReservaInfo);

route.get('/confirmar-reserva/:idReserva/submit', verifyToken, submitReserva);

//route.post('/perfil', verifyToken, /*remover token*/);

export default route;
