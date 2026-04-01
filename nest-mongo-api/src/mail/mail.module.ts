import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { QueueModule } from '../queue/queue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    QueueModule,
    ConfigModule, // 👈 ADD THIS

    MailerModule.forRootAsync({
      imports: [ConfigModule], // 👈 ADD
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const user = config.get<string>('MAIL_USER');
        const pass = config.get<string>('MAIL_PASS');

        console.log('ENV USER:', user); // 🔍 debug
        console.log('ENV PASS:', pass);

        return {
          transport: {
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: '"No Reply" <no-reply@test.com>',
          },
        };
      },
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}