import express from 'express';
const route = express.Router();
export default route;

//controllers
import { index, id_index } from './controllers/testController.js'

//middlewares

//routes
//route.get('/', )

route.get('/tshirt', index);

route.post('/tshirt/:id', id_index);
