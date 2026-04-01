import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from 'src/common/constants';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_CONSTANTS.SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT PAYLOAD:', payload); 
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role, // ✅ important
    };
  }
}