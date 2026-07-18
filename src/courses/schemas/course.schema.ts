import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LanguageCode } from '@/common/enums/language-code.enum';
import { HydratedDocument } from 'mongoose';
export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true, collection: 'courses' })
export class Course {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, enum: ['zh', 'en', 'ja', 'ko'] })
  languageCode!: LanguageCode;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: '' })
  coverImage?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
