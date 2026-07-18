import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { Course, CourseSchema } from '@/courses/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
