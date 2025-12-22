import express from 'express';
const route = express.Router();
export default route;

//controllers
import { index, id_index } from './controllers/testController.js'
import { registerAccount } from './controllers/registerController.js'
import { accountExists } from './controllers/loginController.js'
import { getProfile } from './controllers/perfilController.js'

//middlewares
import { verifyToken } from './middlewares/verifyToken.js';
import { blockLoggedIn } from './middlewares/blockLoggedIn.js';

//routes
//route.get('/', )

route.get('/tshirt', index);

route.post('/tshirt/:id', id_index);

route.post('/login/entry', blockLoggedIn, accountExists);

route.post('/register/create', blockLoggedIn, registerAccount);

//route.get('/perfil', getProfile);

//route.post('/perfil', verifyToken, /*remover token*/);
//route.post('/reserva', verifyToken, /*remover token*/);
