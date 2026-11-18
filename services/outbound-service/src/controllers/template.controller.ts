import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/template.service.js';

export class TemplateController {
  public static async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const templates = await TemplateService.getAllTemplates();
      res.status(200).json({ success: true, data: templates });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const template = await TemplateService.getTemplateById(id);
      if (!template) {
        res.status(404).json({ success: false, message: 'Template not found' });
        return;
      }
      res.status(200).json({ success: true, data: template });
    } catch (err) {
      next(err);
    }
  }
}
