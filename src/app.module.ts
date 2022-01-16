import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './product/product.module';

import { getMongoConfig } from './configs/mongo.config';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    ReviewModule,
    TopPageModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
