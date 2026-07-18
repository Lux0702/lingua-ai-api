import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DialogueLine {
  @Prop({ required: true })
  id!: string;
  @Prop()
  speaker?: string;
  @Prop()
  text?: string;
  @Prop()
  translation?: string;
}
const DialogueLineSchema = SchemaFactory.createForClass(DialogueLine);

@Schema({ _id: false })
export class Dialogue {
  @Prop({ required: true })
  title!: string;
  @Prop({ type: [DialogueLineSchema], default: [] })
  lines!: DialogueLine[];
}
export const DialogueSchema = SchemaFactory.createForClass(Dialogue);
