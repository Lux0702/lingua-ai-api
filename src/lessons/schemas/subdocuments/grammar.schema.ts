import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Grammar {
  @Prop({ required: true })
  id!: string;
  @Prop({ required: true })
  title!: string;
  @Prop()
  explanation?: string;
  @Prop()
  example?: string;
  @Prop()
  translation?: string;
}
export const GrammarSchema = SchemaFactory.createForClass(Grammar);
