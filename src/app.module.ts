import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressModule } from './progress/progress.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    CoursesModule,
    LessonsModule,
    AuthModule,
    ProgressModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
