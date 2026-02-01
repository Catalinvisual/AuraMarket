import { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  createCategory
} from '../controllers/product.controller';

const router = Router();

// Public routes (or protected depending on requirements, usually public for viewing)
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (Admin only) - For now I'll skip middleware for speed, but should be added
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/categories', createCategory);

export default router;
