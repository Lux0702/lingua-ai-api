import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';


import { Course } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Lesson } from '../lessons/schemas/lesson.schema';
import { HydratedDocument, Model } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;
export type LessonDocument = HydratedDocument<Lesson>;

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

  create(dto: CreateCourseDto) {
    return this.courseModel.create(dto);
  }

  async findAll() {
    const courses = await this.courseModel.find().lean();

    return Promise.all(
      courses.map(async (course) => {
        const lessonCount = await this.lessonModel.countDocuments({
          courseId: course._id.toString(),
        });

        return {
          ...course,
          lessonCount,
        };
      }),
    );
  }

  findOne(id: string) {
    return this.courseModel.findById(id).lean();
  }

  update(id: string, dto: UpdateCourseDto) {
    return this.courseModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
}
