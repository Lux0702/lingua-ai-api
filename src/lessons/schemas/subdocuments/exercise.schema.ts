import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ExerciseType = 'multiple_choice' | 'fill_blank';

@Schema({ _id: false })
export class ExerciseOption {
  @Prop({ required: true })
  id!: string;

  @Prop()
  text?: string;
}
export const ExerciseOptionSchema =
  SchemaFactory.createForClass(ExerciseOption);
@Schema({ _id: false })
export class Exercise {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, enum: ['multiple_choice', 'fill_blank'] })
  type!: ExerciseType;

  @Prop({ required: true })
  question!: string;

  @Prop({ default: '' })
  answer?: string;

  @Prop({ type: [ExerciseOptionSchema] })
  options?: ExerciseOption[];
  @Prop({ required: true })
  explanation!: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
