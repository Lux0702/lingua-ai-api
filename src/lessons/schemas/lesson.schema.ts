import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LanguageCode } from '../../common/enums/language-code.enum';
import { VocabularySchema, Vocabulary } from './subdocuments/vocabulary.schema';
import { ReadingSchema, Reading } from './subdocuments/reading.schema';
import { Dialogue, DialogueSchema } from './subdocuments/dialogue.schema';
import { Exercise, ExerciseSchema } from './subdocuments/exercise.schema';
import { Grammar, GrammarSchema } from './subdocuments/grammar.schema';
export type LessonDocument = HydratedDocument<Lesson>;

@Schema({
  timestamps: true,
  collection: 'lessons',
})
export class Lesson {
  @Prop({
    required: true,
  })
  courseId!: string;

  @Prop({
    required: true,
  })
  courseTitle!: string;

  @Prop({
    required: true,
    enum: LanguageCode,
  })
  languageCode!: LanguageCode;

  @Prop({
    required: true,
  })
  lessonNumber!: number;

  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    default: '',
  })
  overview!: string;

  @Prop({
    type: [String],
    default: [],
  })
  objectives!: string[];

  @Prop({
    type: [VocabularySchema],
    default: [],
  })
  vocabulary!: Vocabulary[];

  @Prop({
    type: [GrammarSchema],
    default: [],
  })
  grammar!: Grammar[];

  @Prop({
    type: DialogueSchema,
    default: {},
  })
  dialogue!: Dialogue;

  @Prop({
    type: ReadingSchema,
    default: {},
  })
  reading!: Reading;

  @Prop({
    type: [ExerciseSchema],
    default: [],
  })
  exercises!: Exercise[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
