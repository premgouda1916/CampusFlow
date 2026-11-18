import { getDbPool } from '../database/mysql.js';
import { CampaignService } from './campaign.service.js';
import { TemplateService } from './template.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class DispatcherService {
  /**
   * Asynchronously dispatch an outbound campaign with batching and rate limiting
   */
  public static async dispatchCampaign(campaignId: number): Promise<{ success: boolean; dispatched: number; failed: number }> {
    const db = getDbPool();
    const campaign = await CampaignService.getCampaignById(campaignId);

    if (!campaign) {
      throw new Error(`Campaign ID ${campaignId} not found`);
    }

    if (campaign.status === 'COMPLETED' || campaign.status === 'PROCESSING') {
      throw new Error(`Campaign is already in ${campaign.status} state`);
    }

    const template = await TemplateService.getTemplateById(campaign.templateId);
    if (!template) {
      throw new Error(`Template ID ${campaign.templateId} not found`);
    }

    // Update status to PROCESSING
    await db.query('UPDATE outbound_campaigns SET status = ? WHERE id = ?', ['PROCESSING', campaignId]);

    // Fetch all pending recipients
    const [recipients]: any = await db.query(
      'SELECT id, name, email, phone FROM outbound_campaign_recipients WHERE campaign_id = ? AND status = ?',
      [campaignId, 'PENDING']
    );

    let sent = 0;
    let failed = 0;
    const batchSize = env.DISPATCH_BATCH_SIZE;

    logger.info(`Starting dispatch for campaign #${campaignId} (${recipients.length} recipients, batch size: ${batchSize})`);

    // Process in batches to prevent event loop / connection pool starvation
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (recipient: any) => {
          try {
            // Render customized content per recipient
            const renderedBody = TemplateService.render(template.bodyTemplate, {
              studentName: recipient.name,
              companyName: 'CampusFlow Partner',
              jobTitle: 'Software Engineer',
              packageLpa: '12.0',
              deadline: 'Within 7 Days',
              roundName: 'Technical Round 1',
              scheduledTime: 'Tomorrow, 10:00 AM',
              meetingUrl: 'https://meet.campusflow.internal/room/interview'
            });

            // Simulated high-throughput outbound gateway dispatch (e.g. SES / SendGrid / Twilio)
            // Real mock latency between 10ms - 30ms
            await new Promise((resolve) => setTimeout(resolve, 15));

            // Mark as SENT
            await db.query(
              'UPDATE outbound_campaign_recipients SET status = ?, sent_at = NOW() WHERE id = ?',
              ['SENT', recipient.id]
            );
            sent++;
          } catch (err: any) {
            failed++;
            await db.query(
              'UPDATE outbound_campaign_recipients SET status = ?, error_message = ? WHERE id = ?',
              ['FAILED', err.message || 'Dispatch failure', recipient.id]
            );
          }
        })
      );

      // Throttling delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, env.DISPATCH_DELAY_MS));
      }
    }

    // Finalize campaign status
    await db.query(
      'UPDATE outbound_campaigns SET status = ?, sent_count = ?, failed_count = ? WHERE id = ?',
      ['COMPLETED', sent, failed, campaignId]
    );

    logger.info(`Finished dispatch for campaign #${campaignId}. Sent: ${sent}, Failed: ${failed}`);
    return { success: true, dispatched: sent, failed };
  }
}
