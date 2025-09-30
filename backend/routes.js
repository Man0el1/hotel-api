import express from 'express';
const route = express.Router();
export default route;

//controllers
import { index, id_index } from './controllers/testController.js'
import { register } from './controllers/registerController.js'

//middlewares

//routes
//route.get('/', )

route.get('/tshirt', index);

route.post('/tshirt/:id', id_index);

route.post('/login/register/create', register);
