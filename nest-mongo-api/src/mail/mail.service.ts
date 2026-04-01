import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,

    @InjectQueue('email-queue')
    private readonly emailQueue: Queue,
  ) {}

  // ✅ NEW: push to queue instead of sending directly
  async queueEmail(jobType: string, payload: any) {
    await this.emailQueue.add(jobType, payload, {
      attempts: 3,
      backoff: 3000,
    });
  }

  // ================= EXISTING METHODS =================

async sendTestEmail(data: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  console.log('📧 Inside sendTestEmail:', data);

  await this.mailerService.sendMail({
    to: data.to,
    subject: data.subject,
    text: data.text,
  });

  console.log('✅ MailerService executed');
}
  async sendTemplateEmail(data: any) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'welcome.hbs',
    );

    const templateSource = fs.readFileSync(filePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);

    const html = compiledTemplate({
      name: data.name,
      email: data.email,
    });

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Template Test 🎉',
      html,
    });
  }

  async sendMailWithAttachment(data: any) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'sample.pdf',
    );

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'PDF Attachment 📄',
      text: 'Check attached PDF',
      attachments: [
        {
          filename: 'invoice.pdf',
          path: filePath,
        },
      ],
    });
  }

  async sendInvoiceEmail(data: any) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'invoice.hbs',
    );

    const source = fs.readFileSync(templatePath, 'utf-8');
    const compiled = handlebars.compile(source);

    const html = compiled({
      name: data.name,
      orderId: data.orderId,
      amount: data.amount,
    });

    const filePath = path.join(
      process.cwd(),
      'src',
      'mail',
      'templates',
      'invoice.pdf',
    );

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Your Invoice 🧾',
      html,
      attachments: [
        {
          filename: 'invoice.pdf',
          path: filePath,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}