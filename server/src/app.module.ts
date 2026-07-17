import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClothesModule } from './clothes/clothes.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AiModule } from './ai/ai.module';
import { GoogleSearchModule } from './google-search/google-search.module';
import { CategoriesModule } from './categories/categories.module';
import { SalesModule } from './sales/sales.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { RedisThrottlerStorage } from '@nestjs-redis/throttler-storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'fitly',
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
      migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
      migrationsRun: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisModule],
      useFactory: (redisService: RedisService) => ({
        storage: new RedisThrottlerStorage(redisService.redisClient),
        throttlers: [
          {
            name: 'short',
            ttl: 1000, // 1 second
            limit: 3, // 3 requests per second
          },
          {
            name: 'medium',
            ttl: 10000, // 10 seconds
            limit: 20,
          },
          {
            name: 'long',
            ttl: 60000, // 1 minute
            limit: 100,
          },
        ],
      }),
    }),
    UsersModule,
    AuthModule,
    ClothesModule,
    AiModule,
    GoogleSearchModule,
    CategoriesModule,
    SalesModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        disableErrorMessages: false,
        validationError: { target: false, value: false },
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
