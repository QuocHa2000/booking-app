import { TasksModule } from './tasks/tasks.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { AppLoggerMiddleware } from './utils/logger.middleware';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './modules/auth/auth.service';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './modules/admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/roles/roles.guard';
import { ManagerModule } from './modules/manager/manager.module';
import { InitModule } from './modules/init/init.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from './modules/room/room.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    // Config .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Passport
    PassportModule,
    JwtModule,

    // Cronjob
    ScheduleModule.forRoot(),
    TasksModule,

    // Config TypeOrm
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    // MongooseModule.forRoot(getMongoUrl(), {
    //   autoIndex: true,
    //   autoCreate: true,
    // }),

    // Init Module
    InitModule,

    // Common Module
    ManagerModule,
    AuthModule,
    RoomModule,
    BookingModule,
    ClientModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    AuthService,
    LocalStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
