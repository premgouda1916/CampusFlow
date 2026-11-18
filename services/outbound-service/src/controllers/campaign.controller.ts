import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaign.service.js';
import { DispatcherService } from '../services/dispatcher.service.js';
import { z } from 'zod';

const createCampaignSchema = z.object({
  title: z.string().min(3).max(200),
  channel: z.enum(['EMAIL', 'SMS', 'WHATSAPP']),
  targetDepartment: z.string().optional(),
  minCgpa: z.number().min(0).max(10).optional(),
  templateId: z.number().int().positive(),
  scheduledAt: z.string().datetime().optional(),
  recipientList: z
    .array(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        studentId: z.number().optional()
      })
    )
    .optional()
});

export class CampaignController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedBody = createCampaignSchema.parse(req.body);
      const campaign = await CampaignService.createCampaign(parsedBody);
      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await CampaignService.getAllCampaigns();
      res.status(200).json({
        success: true,
        data: campaigns
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const campaign = await CampaignService.getCampaignById(id);
      if (!campaign) {
        res.status(404).json({ success: false, message: 'Campaign not found' });
        return;
      }
      res.status(200).json({ success: true, data: campaign });
    } catch (err) {
      next(err);
    }
  }

  public static async dispatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      // Trigger dispatch asynchronously or synchronously based on query
      const result = await DispatcherService.dispatchCampaign(id);
      res.status(200).json({
        success: true,
        message: 'Campaign dispatch completed',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const analytics = await CampaignService.getCampaignAnalytics(id);
      res.status(200).json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }
}
