import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  // @Prop({
  //   type: String,
  //   enum: Role,
  //   default: Role.USER,
  // })
  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);