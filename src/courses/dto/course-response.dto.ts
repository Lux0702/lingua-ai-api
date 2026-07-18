import { LanguageCode } from '../../common/enums/language-code.enum';
export class CourseResponseDto {
  id!: string;

  title!: string;

  languageCode!: LanguageCode;

  description!: string;

  coverImage!: string;
}
