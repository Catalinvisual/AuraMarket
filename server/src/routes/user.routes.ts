import { Router } from 'express';
import { getUsers, deleteUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
