import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Vocabulary {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  word!: string;

  @Prop()
  pronunciation?: string;

  @Prop()
  romanization?: string;

  @Prop({ required: true })
  meaning!: string;

  @Prop()
  example?: string;

  @Prop()
  translation?: string;

  @Prop()
  notes?: string;
}
export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
