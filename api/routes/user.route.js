import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test' , test);
router.post('/update/:id', verifyToken, updateUser);
// The update route is protected by verifyToken middleware so only the verified user can update his own profile

export default router;