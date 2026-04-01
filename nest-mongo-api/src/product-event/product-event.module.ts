import { Module } from '@nestjs/common';
import { ProductEventService } from './product-event.service';

@Module({
  providers: [ProductEventService],
  exports: [ProductEventService], // ✅ VERY IMPORTANT
})
export class ProductEventModule {}