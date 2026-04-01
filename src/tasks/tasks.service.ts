import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductEventService } from '../product-event/product-event.service';
import { MailService } from '../mail/mail.service';
import { ProductEvent } from '../product-event/product-event.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly eventService: ProductEventService,
    private readonly mailService: MailService,
  ) {}

  @Cron('*/5 * * * *') // ✅ every 10 seconds (faster testing)
  async handleCron(): Promise<void> {
    console.log('Cron running...');

    const events: ProductEvent[] = await this.eventService.getPendingEvents();

    if (!events.length) {
      console.log('No pending events');
      return;
    }

    for (const event of events) {
      try {
        // 🔥 VERY IMPORTANT LOG
        console.log('🚀 Sending to queue:', event);

        await this.mailService.queueEmail('PRODUCT_EVENT', event);

        // ✅ mark processed ONLY after queue success
        await this.eventService.markProcessed(event);

        console.log('✅ Event processed successfully');
      } catch (error) {
        console.error('❌ Failed to process event:', error);
      }
    }
  }
}