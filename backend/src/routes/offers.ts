import { Router } from 'express';
import { 
  getOffers, 
  getOfferById, 
  createOffer, 
  updateOffer, 
  deleteOffer,
  pauseOffer,
  resumeOffer
} from '../controllers/offersController';

const router = Router();

// GET /api/offers
router.get('/', getOffers);

// GET /api/offers/:id
router.get('/:id', getOfferById);

// POST /api/offers
router.post('/', createOffer);

// PUT /api/offers/:id
router.put('/:id', updateOffer);

// DELETE /api/offers/:id
router.delete('/:id', deleteOffer);

// PATCH /api/offers/:id/pause
router.patch('/:id/pause', pauseOffer);

// PATCH /api/offers/:id/resume
router.patch('/:id/resume', resumeOffer);

export default router;