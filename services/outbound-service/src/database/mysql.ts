import mysql, { Pool } from 'mysql2/promise';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let pool: Pool | null = null;

export const getDbPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: env.DB_CONNECTION_LIMIT,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
    logger.info(`MySQL connection pool established to ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  }
  return pool;
};

export const initDatabase = async (): Promise<void> => {
  const db = getDbPool();

  try {
    // 1. Templates Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS outbound_templates (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL UNIQUE,
        subject VARCHAR(255) NOT NULL,
        body_template TEXT NOT NULL,
        channel ENUM('EMAIL', 'SMS', 'WHATSAPP') NOT NULL DEFAULT 'EMAIL',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Campaigns Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS outbound_campaigns (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        channel ENUM('EMAIL', 'SMS', 'WHATSAPP') NOT NULL DEFAULT 'EMAIL',
        target_department VARCHAR(100) NULL,
        min_cgpa DECIMAL(3,2) NULL,
        template_id BIGINT NOT NULL,
        status ENUM('DRAFT', 'SCHEDULED', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'DRAFT',
        total_recipients INT NOT NULL DEFAULT 0,
        sent_count INT NOT NULL DEFAULT 0,
        failed_count INT NOT NULL DEFAULT 0,
        scheduled_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_campaign_template FOREIGN KEY (template_id) REFERENCES outbound_templates(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Campaign Recipients Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS outbound_campaign_recipients (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        campaign_id BIGINT NOT NULL,
        student_id BIGINT NULL,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(180) NOT NULL,
        phone VARCHAR(30) NULL,
        status ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED') NOT NULL DEFAULT 'PENDING',
        error_message TEXT NULL,
        sent_at TIMESTAMP NULL,
        INDEX idx_campaign_status (campaign_id, status),
        CONSTRAINT fk_recipient_campaign FOREIGN KEY (campaign_id) REFERENCES outbound_campaigns(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed default recruitment templates if empty
    const [rows]: any = await db.query('SELECT COUNT(*) as cnt FROM outbound_templates');
    if (rows[0].cnt === 0) {
      await db.query(`
        INSERT INTO outbound_templates (name, subject, body_template, channel) VALUES
        ('Drive Invitation', 'Campus Recruitment Drive: Invitation for {{companyName}}', 'Hello {{studentName}},\\n\\nYou have been selected to apply for {{jobTitle}} at {{companyName}} with a package of {{packageLpa}} LPA. Please check your CampusFlow dashboard to submit your application before {{deadline}}.\\n\\nBest regards,\\nCampusFlow Placement Cell', 'EMAIL'),
        ('Interview Call', 'Interview Round Scheduled: {{companyName}} ({{roundName}})', 'Dear {{studentName}},\\n\\nYour {{roundName}} interview with {{companyName}} is scheduled on {{scheduledTime}}.\\nMeeting Link: {{meetingUrl}}\\n\\nPlease ensure you join 5 minutes early.\\n\\nPlacement Office', 'EMAIL'),
        ('Offer Extended', 'Congratulations! Placement Offer from {{companyName}}', 'Dear {{studentName}},\\n\\nWe are thrilled to inform you that {{companyName}} has formally extended a placement offer for {{jobTitle}} with a CTC of {{packageLpa}} LPA! Please review and accept the offer on CampusFlow within 48 hours.\\n\\nWarm Congratulations,\\nPlacement & Career Hub', 'EMAIL');
      `);
      logger.info('Seeded default recruitment outbound email templates.');
    }

    logger.info('Outbound marketing MySQL tables verified and initialized.');
  } catch (err: any) {
    logger.error('Failed to initialize outbound marketing database schema:', err);
    throw err;
  }
};
