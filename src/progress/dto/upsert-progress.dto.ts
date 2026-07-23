import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertProgressDto {
  @IsBoolean()
  completed!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
