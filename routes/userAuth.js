import express from 'express';
import { userAuth } from '../controllers/userAuth.js';

const router = express.Router();

router.post('/', userAuth); 

export default router;