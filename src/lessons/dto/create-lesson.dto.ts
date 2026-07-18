import { LanguageCode } from '../../common/enums/language-code.enum';
export class CreateLessonDto {
  courseId!: string;

  courseTitle!: string;

  languageCode!: LanguageCode;

  lessonNumber!: number;

  title!: string;

  overview!: string;

  objectives!: string[];

  vocabulary!: any[];

  grammar!: any[];

  dialogue!: Record<string, unknown>;

  reading!: Record<string, unknown>;

  exercises!: any[];
}
