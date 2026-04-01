import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    return await this.userModel.create(data);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().lean();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userModel.findById(id).lean();
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean();
  }

  async delete(id: string): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(id).lean();
  }

  // ✅ IMPORTANT: NO lean() here (needed for auth)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).populate('role');
  }

  async createUser(data: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(data);
    return await user.save();
  }
}