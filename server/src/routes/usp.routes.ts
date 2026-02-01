import { Router } from 'express';
import { getUSPs, createUSP, updateUSP, deleteUSP } from '../controllers/usp.controller';

const router = Router();

router.get('/', getUSPs);
router.post('/', createUSP);
router.put('/:id', updateUSP);
router.delete('/:id', deleteUSP);

export default router;
