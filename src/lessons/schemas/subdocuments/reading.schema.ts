import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ReadingParagraph {
  @Prop({ required: true })
  id!: string;

  @Prop()
  text?: string;
  @Prop()
  pronunciation?: string;
  @Prop()
  romanization?: string;
  @Prop()
  translation?: string;
}
export const ReadingParagraphSchema =
  SchemaFactory.createForClass(ReadingParagraph);
@Schema({ _id: false })
export class Reading {
  @Prop({ required: true })
  title!: string;
  @Prop({ type: [ReadingParagraphSchema], default: [] })
  paragraphs!: ReadingParagraph[];
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);
