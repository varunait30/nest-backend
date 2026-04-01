// test.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Controller('test')
export class TestController {
  constructor(private readonly mailService: MailService) {}

  @Get('mail')
  async testMail() {
   await this.mailService.sendTestEmail({
  to: 'test@mail.com',
  subject: 'Test Email 🚀',
  text: 'This is a test email',
});
  }
  @Get('mail-template')
  async testTemplate() {
    await this.mailService.sendTemplateEmail({
      to: 'test@mail.com',
      name: 'Rahul',
      email: 'rahul@test.com',
    });
  }
  @Get('mail-invoice')
  async testInvoice() {
    await this.mailService.sendInvoiceEmail({
      to: 'test@mail.com',
      name: 'Rahul',
      orderId: 'ORD123',
      amount: 999,
    });
  }
}
