import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../users/schemas/schema';
import { Role, RoleSchema } from '../roles/role.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),

    // ✅ ADD THIS (VERY IMPORTANT)
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),

    UsersModule,
    RolesModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}