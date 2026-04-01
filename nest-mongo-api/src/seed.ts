import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(SeedModule);
//   const seedService = app.get(SeedService);

//   await seedService.run();
//   await app.close();
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  const args = process.argv;

  // ✅ Roles argument (already exists)
  const rolesArg = args.find(arg => arg.startsWith('roles='));

  // ✅ NEW: users argument
  const usersArg = args.find(arg => arg.startsWith('users'));

  if (rolesArg) {
    const rolesString = rolesArg.split('=')[1];

    const roles = rolesString
      .split(/[,\s]+/)
      .map(role => role.trim())
      .filter(Boolean);

    console.log('Parsed roles:', roles);

    await seedService.seedRoles(roles);

  } else if (usersArg) {
    console.log('Seeding users only...');
    await seedService.seedUsers();

  } else {
    // default full seed
    await seedService.run();
  }

  await app.close();
}

bootstrap();
