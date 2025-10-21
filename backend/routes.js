import express from 'express';
const route = express.Router();
export default route;

//controllers
import { index, id_index } from './controllers/testController.js'
import { register } from './controllers/registerController.js'

//middlewares
import { verifyToken } from './middlewares/verifyToken.js';
import { blockLoggedIn } from './middlewares/blockLoggedIn.js';

//routes
//route.get('/', )

route.get('/tshirt', index);

route.post('/tshirt/:id', id_index);

route.post('/login/register/create', blockLoggedIn, register);
