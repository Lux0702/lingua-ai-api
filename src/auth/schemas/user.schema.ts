import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  email!: string;

  @Prop({ required: true, trim: true, maxlength: 80 })
  displayName!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
