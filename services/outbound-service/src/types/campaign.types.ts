export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type CampaignChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';
export type RecipientStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';

export interface Template {
  id: number;
  name: string;
  subject: string;
  bodyTemplate: string;
  channel: CampaignChannel;
  createdAt: Date;
}

export interface Campaign {
  id: number;
  title: string;
  channel: CampaignChannel;
  targetDepartment: string | null;
  minCgpa: number | null;
  templateId: number;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignRecipient {
  id: number;
  campaignId: number;
  studentId: number | null;
  email: string;
  phone: string | null;
  name: string;
  status: RecipientStatus;
  errorMessage: string | null;
  sentAt: Date | null;
}

export interface CreateCampaignDTO {
  title: string;
  channel: CampaignChannel;
  targetDepartment?: string;
  minCgpa?: number;
  templateId: number;
  scheduledAt?: string;
  recipientList?: Array<{
    name: string;
    email: string;
    phone?: string;
    studentId?: number;
  }>;
}

export interface CampaignAnalytics {
  campaignId: number;
  title: string;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  deliveryRatePercentage: number;
  averageDispatchTimeMs: number;
}
