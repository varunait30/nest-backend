import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANTS } from 'src/common/constants';
import { PassportModule } from '@nestjs/passport';        // ✅ ADD
import { JwtStrategy } from './strategies/jwt.strategy';  // ✅ ADD

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // ✅ ADD THIS
    JwtModule.register({
      secret: JWT_CONSTANTS.SECRET,
      signOptions: { expiresIn: JWT_CONSTANTS.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // ✅ ADD THIS
  ],
  exports: [JwtModule, PassportModule], // ✅ ADD (recommended)
})
export class AuthModule {}