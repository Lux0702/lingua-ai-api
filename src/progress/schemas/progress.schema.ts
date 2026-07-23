import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;

@Schema({ timestamps: true, collection: 'progress' })
export class Progress {
  @Prop({ required: true, trim: true })
  userId!: string;

  // Stored as YYYY-MM-DD so it represents the learner's calendar day, not a UTC timestamp.
  @Prop({ required: true, match: /^\d{4}-\d{2}-\d{2}$/ })
  date!: string;

  @Prop({ default: false })
  completed!: boolean;

  @Prop({ default: '', trim: true })
  note!: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });
