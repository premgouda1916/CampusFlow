import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller.js';

const router = Router();

router.post('/', CampaignController.create);
router.get('/', CampaignController.getAll);
router.get('/:id', CampaignController.getById);
router.post('/:id/dispatch', CampaignController.dispatch);
router.get('/:id/analytics', CampaignController.getAnalytics);

export default router;
