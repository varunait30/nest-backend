import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Global() // ✅ VERY IMPORTANT
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}