import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ProductEventModule } from '../product-event/product-event.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ProductEventModule, // ✅ ADD THIS
    MailModule, // ✅ ADD THIS
  ],
  providers: [TasksService],
})
export class TasksModule {}
