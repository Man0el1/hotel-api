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
import { cancelReserva } from './controllers/cancelarReservaController.js'

//middlewares
import { checkToken } from './middlewares/checkToken.js';
import { requireToken } from './middlewares/requireToken.js';
import { blockLoggedIn } from './middlewares/blockLoggedIn.js';

route.use(checkToken);

route.post('/login/entry', blockLoggedIn, accountExists);

route.post('/register/create', blockLoggedIn, registerAccount);

route.post('/reserva/disponibilidade', getAvalibility);

route.post('/reserva/pre-confirmacao', requireToken, createPreConfirmation);

route.get('/perfil', requireToken, getProfileInfo);

route.get('/dataAtual', getCurrentDate);

route.post('/cancelar-reserva', requireToken, cancelReserva);

route.get('/confirmar-reserva/:idReserva', requireToken, getReservaInfo);

route.get('/confirmar-reserva/:idReserva/submit', requireToken, submitReserva);

export default route;
