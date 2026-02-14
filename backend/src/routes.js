import express from 'express';
const route = express.Router();

//controllers
import { registerAccount } from './controllers/registerController.js'
import { accountExists } from './controllers/loginController.js'
import { getProfile } from './controllers/perfilController.js'
import { getAvalibility } from './controllers/reservaController.js'
import { createPreConfirmation } from './controllers/reservaController.js'
import { getCurrentDate } from './controllers/dataController.js'

//middlewares
import { verifyToken } from './middlewares/verifyToken.js';
import { blockLoggedIn } from './middlewares/blockLoggedIn.js';

//routes
//route.get('/', )

route.post('/login/entry', blockLoggedIn, accountExists);

route.post('/register/create', blockLoggedIn, registerAccount);

route.post('/reserva/disponibilidade', getAvalibility);

route.post('/reserva/pre-confirmacao', verifyToken, createPreConfirmation);

route.get('/perfil', verifyToken, getProfile);

route.get('/dataAtual', getCurrentDate);

//route.post('/perfil', verifyToken, /*remover token*/);

export default route;
