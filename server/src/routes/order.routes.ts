import { Router } from 'express';
import { 
  createOrder,
  getOrders, 
  getOrder, 
  updateOrderStatus, 
  deleteOrder 
} from '../controllers/order.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
