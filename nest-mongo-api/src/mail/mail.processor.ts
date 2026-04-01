import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

@Processor('email-queue')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
    console.log('🔥 MailProcessor initialized');
  }

  async process(job: Job): Promise<void> {
    console.log('🔥 JOB RECEIVED:', job.name, job.data);

    const event = job.data;

    if (!event?.email) {
      console.error('❌ Missing email in event');
      return;
    }

    try {
      await this.mailService.sendTestEmail({
        to: event.email,
        subject: `Product ${event.type}`,
        text: `Product ${event.productId} was ${event.type}`,
      });

      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error('❌ Email failed:', error.message);
      throw error; // important for retry in queue
    }
  }
}