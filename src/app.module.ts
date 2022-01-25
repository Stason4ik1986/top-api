import { Module } from '@nestjs/common';

import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ReviewModule } from './review/review.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';
import { TelegramModule } from './telegram/telegram.module';

import { getMongoConfig } from './configs/mongo.config';
import { getTelegramConfig } from './configs/telegram.config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HhModule } from './hh/hh.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    FilesModule,
    ReviewModule,
    SitemapModule,
    TopPageModule,
    ProductModule,
    TelegramModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTelegramConfig
    }),
    HhModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
