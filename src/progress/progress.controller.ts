import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProgressQueryDto, SyncProgressDto } from './dto/sync-progress.dto';
import { UpsertProgressDto } from './dto/upsert-progress.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(AuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  findByMonth(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ProgressQueryDto,
  ) {
    const month = query.month ?? new Date().toISOString().slice(0, 7);
    return this.progressService.findByMonth(user.id, month);
  }

  @Get('stats')
  getStats(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ProgressQueryDto,
  ) {
    const month = query.month ?? new Date().toISOString().slice(0, 7);
    return this.progressService.getStats(user.id, month);
  }

  @Put('sync')
  sync(@CurrentUser() user: AuthenticatedUser, @Body() dto: SyncProgressDto) {
    return this.progressService.sync(user.id, dto);
  }

  @Put(':date')
  upsert(
    @CurrentUser() user: AuthenticatedUser,
    @Param('date') date: string,
    @Body() dto: UpsertProgressDto,
  ) {
    return this.progressService.upsert(user.id, date, dto);
  }
}
