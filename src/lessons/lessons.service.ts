import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson, LessonDocument } from './schemas/lesson.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(lessons: CreateLessonDto[]) {
    const courseMap = new Map<string, string>();

    for (const lesson of lessons) {
      const courseId = lesson.courseId;

      if (courseId) {
        const course = await this.courseModel.findById(courseId);

        if (course) {
          courseMap.set(
            `${lesson.courseTitle}-${lesson.languageCode}`,
            course._id.toString(),
          );
          continue;
        }
      }

      const key = `${lesson.courseTitle}-${lesson.languageCode}`;

      if (!courseMap.has(key)) {
        let course = await this.courseModel.findOne({
          title: lesson.courseTitle,
          languageCode: lesson.languageCode,
        });

        if (!course) {
          course = await this.courseModel.create({
            title: lesson.courseTitle,
            languageCode: lesson.languageCode,
          });
        }

        courseMap.set(key, course._id.toString());
      }
    }

    const lessonDocs = lessons.map((lesson) => ({
      ...lesson,
      courseId:
        lesson.courseId ||
        courseMap.get(`${lesson.courseTitle}-${lesson.languageCode}`)!,
    }));

    return this.lessonModel.insertMany(lessonDocs);
  }

  async findAll() {
    return this.lessonModel.find();
  }

  async findOne(id: string) {
    return this.lessonModel.findById(id);
  }
  async findByCourse(courseId: string) {
    return this.lessonModel.find({ courseId }).sort({ lessonNumber: 1 });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    return this.lessonModel.findByIdAndUpdate(id, updateLessonDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.lessonModel.findByIdAndDelete(id);
  }
}
