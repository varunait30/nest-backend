import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
// import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { TestController } from './test.controller';
import { RolesModule } from './roles/roles.module'; 
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),

    MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),

    UsersModule,
    AuthModule,
    ProductsModule,
    // SeedModule,
    MailModule,
    RolesModule,
    TasksModule,
  ],
  controllers: [TestController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
