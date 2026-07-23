import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SyncProgressDto } from './dto/sync-progress.dto';
import { UpsertProgressDto } from './dto/upsert-progress.dto';
import { Progress, ProgressDocument } from './schemas/progress.schema';

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
  ) {}

  async upsert(userId: string, date: string, dto: UpsertProgressDto) {
    this.assertDate(date);

    return this.progressModel
      .findOneAndUpdate(
        { userId, date },
        { $set: { completed: dto.completed, note: dto.note ?? '' } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean();
  }

  async findByMonth(userId: string, month: string) {
    const [year, monthNumber] = month.split('-').map(Number);
    const nextMonth = new Date(Date.UTC(year, monthNumber, 1))
      .toISOString()
      .slice(0, 7);

    return this.progressModel
      .find({ userId, date: { $gte: `${month}-01`, $lt: `${nextMonth}-01` } })
      .sort({ date: 1 })
      .lean();
  }

  async sync(userId: string, dto: SyncProgressDto) {
    const entries = Object.entries(dto.entries);
    entries.forEach(([date]) => this.assertDate(date));

    if (entries.length === 0) return [];

    await this.progressModel.bulkWrite(
      entries.map(([date, entry]) => ({
        updateOne: {
          filter: { userId, date },
          update: {
            $set: { completed: entry.completed, note: entry.note ?? '' },
          },
          upsert: true,
        },
      })),
    );

    return this.progressModel
      .find({ userId, date: { $in: entries.map(([date]) => date) } })
      .sort({ date: 1 })
      .lean();
  }

  async getStats(userId: string, month: string) {
    const entries = await this.findByMonth(userId, month);
    const completedDates = new Set(
      entries.filter((entry) => entry.completed).map((entry) => entry.date),
    );

    return {
      month,
      completedDays: completedDates.size,
      currentStreak: await this.getCurrentStreak(userId),
    };
  }

  private async getCurrentStreak(userId: string) {
    const completedEntries = await this.progressModel
      .find({ userId, completed: true })
      .sort({ date: -1 })
      .select({ date: 1, _id: 0 })
      .lean();

    const completedDates = new Set(completedEntries.map((entry) => entry.date));
    let cursor = this.toDateOnly(new Date());
    let streak = 0;

    while (completedDates.has(cursor)) {
      streak += 1;
      const previousDay = new Date(`${cursor}T00:00:00.000Z`);
      previousDay.setUTCDate(previousDay.getUTCDate() - 1);
      cursor = this.toDateOnly(previousDay);
    }

    return streak;
  }

  private assertDate(date: string) {
    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (
      !DATE_PATTERN.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      this.toDateOnly(parsedDate) !== date
    ) {
      throw new BadRequestException('date must use the YYYY-MM-DD format');
    }
  }

  private toDateOnly(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
