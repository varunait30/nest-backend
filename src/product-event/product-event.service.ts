import { Injectable } from '@nestjs/common';
import { ProductEvent } from './product-event.entity';

@Injectable()
export class ProductEventService {
  private readonly events: ProductEvent[] = [];

  // ✅ CREATE EVENT
  async createEvent(
    event: Omit<ProductEvent, 'processed' | 'createdAt'>,
  ): Promise<ProductEvent> {
    const newEvent: ProductEvent = {
      ...event,
      processed: false,
      createdAt: new Date(),
    };

    this.events.push(newEvent);

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log('🔥 Event created:', newEvent);

    return newEvent;
  }

  // ✅ GET PENDING EVENTS
  async getPendingEvents(): Promise<ProductEvent[]> {
    const pendingEvents = this.events.filter((e) => !e.processed);

    console.log('📦 Pending events:', pendingEvents);

    return pendingEvents;
  }

  // ✅ MARK AS PROCESSED
  async markProcessed(event: ProductEvent): Promise<void> {
    const index = this.events.findIndex(
      (e) =>
        e.productId === event.productId &&
        e.type === event.type &&
        !e.processed,
    );

    if (index !== -1) {
      this.events[index].processed = true;

      console.log('✅ Event marked processed:', this.events[index]);
    } else {
      console.log('⚠️ Event not found to mark processed');
    }
  }
}