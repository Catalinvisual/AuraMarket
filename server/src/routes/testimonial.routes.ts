import { Router } from 'express';
import { getTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';

const router = Router();

router.get('/', getTestimonials); // Public: get active only
router.get('/admin', getAllTestimonials); // Admin: get all
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
