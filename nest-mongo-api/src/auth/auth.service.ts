import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES } from '../common/constants';

interface RegisterDto {
  email: string;
  password: string;
}
interface RoleType {
  _id: string;
  name: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException(MESSAGES.USER_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      message: MESSAGES.USER_CREATED,
      user,
    };
  }

  async login(data: RegisterDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new BadRequestException(MESSAGES.INVALID_PASSWORD);
    }

    const role = user.role as unknown as { name: string };

    // ✅ THEN USE IT HERE
    const payload = {
      sub: user._id.toString(),
      userId: user._id.toString(),
      email: user.email,
      role: role.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: MESSAGES.LOGIN_SUCCESS,
      access_token: token,
    };
  }
}