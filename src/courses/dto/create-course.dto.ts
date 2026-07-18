import { IsEnum, IsOptional, IsString } from 'class-validator';

import { LanguageCode } from '@/common/enums/language-code.enum';
export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsEnum(['zh', 'en', 'ja', 'ko'])
  languageCode!: LanguageCode;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
