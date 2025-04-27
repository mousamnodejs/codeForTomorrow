import express from 'express';
import Controller from '../controllers/auth.controller'; // Default import

const route = express.Router();
route
.post('/register', Controller.authRegister)
.post('/login', Controller.authLogin)
export default route;