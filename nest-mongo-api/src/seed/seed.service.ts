import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role as RoleEnum } from '../users/enums/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Role, RoleDocument } from '../roles/role.schema';
import { User, UserDocument } from '../users/schemas/schema';
import { usersSeed } from './users.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>, // ✅ FIXED

    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    // await this.seedUsers(); // optional (keep disabled if using CLI)
  }

  // ✅ MAIN RUN (full seed)
  async run() {
    await this.seedRoles();
    await this.seedUsers(); // ✅ include users here
  }

  // ✅ ROLE SEEDING
  async seedRoles(customRoles?: string[]) {
    const roles = customRoles || ['user', 'admin', 'manager', 'storekeeper'];

    for (const role of roles) {
      const exists = await this.roleModel.exists({ name: role });

      if (!exists) {
        await this.roleModel.create({ name: role });
        console.log(`✅ Created role: ${role}`);
      } else {
        console.log(`⚡ Role already exists: ${role}`);
      }
    }
  }

  // ✅ USER SEEDING (FIXED)
  async seedUsers() {
    console.log('🚀 Seeding users...');

    for (const user of usersSeed) {
      // ✅ 1. Check if user exists
      const exists = await this.userModel.findOne({ email: user.email });

      if (exists) {
        console.log(`⚡ User exists: ${user.email}`);
        continue;
      }

      // ✅ 2. Role fallback
      const roleName = user.role?.trim() || 'user';

      // ✅ 3. Find role
      const roleDoc = await this.roleModel.findOne({ name: roleName });

      if (!roleDoc) {
        console.log(`❌ Role not found: ${roleName}`);
        continue;
      }

      // ✅ 4. Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // ✅ 5. Create user
      await this.userModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: roleDoc._id,
      });

      console.log(`✅ User created: ${user.email} (${roleName})`);
    }

    console.log('🎉 Users seeding completed');
  }
}