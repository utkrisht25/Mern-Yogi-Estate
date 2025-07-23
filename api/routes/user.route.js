import express from 'express';
import { deleteUser, test, updateUser , getUserListings } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test' , test);
router.post('/update/:id', verifyToken, updateUser);
// The update route is protected by verifyToken middleware so only the verified user can update his own profile
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id' , verifyToken, getUserListings);
export default router;