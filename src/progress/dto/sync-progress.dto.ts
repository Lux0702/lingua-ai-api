import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class ProgressEntryDto {
  @IsBoolean()
  completed!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}

export class SyncProgressDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ProgressEntryDto)
  entries!: Record<string, ProgressEntryDto>;
}

export class ProgressQueryDto {
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  month?: string;
}
